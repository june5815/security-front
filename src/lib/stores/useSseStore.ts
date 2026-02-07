import { EventSourcePolyfill } from "event-source-polyfill";
import { create } from "zustand";
import { API_PREFIX } from "@/lib/api/client";

interface SseState {
  eventSource: EventSource | null;
  isConnected: boolean;
  isConnecting: boolean;
  subscriptions: Map<string, (data: any) => void>;
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribe: (topic: string, callback: (data: any) => void) => void;
  unsubscribe: (topic: string) => void;
}

export default create<SseState>((set, get) => ({
  eventSource: null,
  isConnected: false,
  isConnecting: false,
  subscriptions: new Map(),

  connect: async () => {
    const { isConnected, isConnecting } = get();
    if (isConnected || isConnecting) {
      console.log("[SSE] 이미 연결 중이거나 연결됨. 중복 연결 방지.");
      return;
    }

    set({ isConnecting: true });

    try {
      console.log("[SSE] 연결 시도");
      const BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000";
      const eventSource = new EventSourcePolyfill(
        `${BASE_URL}${API_PREFIX}/notifications/sse`,
        {
          withCredentials: true,
        },
      );

      eventSource.onopen = () => {
        console.log("[SSE]  연결 성공");
        set({ eventSource, isConnected: true, isConnecting: false });
      };

      eventSource.onerror = (error) => {
        console.error("[SSE] 에러:", {
          error,
          readyState: eventSource.readyState,
        });
        set({
          isConnected: false,
          isConnecting: false,
          eventSource: null,
        });
        // 자동 재연결 시도 (5초 후)
        setTimeout(() => {
          const currentState = get();
          if (!currentState.isConnected && !currentState.isConnecting) {
            console.log("[SSE] 재연결 시도 중...");
            get().connect();
          }
        }, 5000);
      };

      // ❌ 제거: onopen을 기다리지 않고 바로 isConnected를 true로 설정하면 안됨!
      // set({ eventSource, isConnected: true, isConnecting: false });
    } catch (error) {
      console.error("[SSE] 연결 시도 중 에러:", error);
      set({ isConnected: false, isConnecting: false, eventSource: null });
    }
  },

  disconnect: () => {
    const { eventSource, isConnected, subscriptions } = get();
    if (eventSource && isConnected) {
      // 모든 구독 해제
      subscriptions.forEach((callback, topic) => {
        eventSource.removeEventListener(topic, callback);
      });
      eventSource.close();
      set({ eventSource: null, isConnected: false });
    }
  },

  subscribe: (topic, callback) => {
    const { eventSource, isConnected, subscriptions } = get();

    if (subscriptions.has(topic)) {
      console.log("[SSE] Already subscribed", topic);
      return;
    }

    // 구독 정보 저장
    const wrappedCallback = (event: MessageEvent) => {
      console.log(
        `[SSE Subscribe] 이벤트 수신: topic=${topic}, rawData=${event.data.substring(0, 100)}...`,
      );
      try {
        const data = JSON.parse(event.data);
        console.log(
          `[SSE Subscribe] 파싱 성공: topic=${topic}, parsedData=`,
          data,
        );
        callback(data);
      } catch (error) {
        console.error(
          "[SSE] Message parsing error:",
          error,
          "rawData:",
          event.data,
        );
        callback(event.data); // JSON 파싱 실패시 원본 데이터 전달
      }
    };

    if (eventSource && isConnected) {
      console.log(`[SSE] 구독 시작: topic=${topic}`);
      eventSource.addEventListener(topic, wrappedCallback);

      subscriptions.set(topic, wrappedCallback);
      set({ subscriptions });
    } else {
      console.warn(
        `[SSE] 구독 불가: eventSource=${!!eventSource}, isConnected=${isConnected}`,
      );
    }
  },

  unsubscribe: (topic) => {
    const { eventSource, isConnected, subscriptions } = get();

    if (eventSource && isConnected) {
      const callback = subscriptions.get(topic);
      if (callback) {
        eventSource.removeEventListener(topic, callback);
      }
    }

    subscriptions.delete(topic);
    set({ subscriptions });
  },
}));
