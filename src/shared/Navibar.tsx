import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import NotificationPanel from './NotificationPanel';
import useAuthStore from '@/lib/stores/useAuthStore';
import { useRouter } from 'next/router';
import { logout } from '@/lib/api/auth';
import { markNotificationAsRead } from '@/lib/api/notifications';
import useNotificationStore from '@/lib/stores/useNotificationStore';
import { NotificationDto } from '@/lib/types';
import useSseStore from '@/lib/stores/useSseStore';

export default function Navibar() {
  const {
    data: notifications,
    fetch,
    add: addData,
    update: updateData,
  } = useNotificationStore();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const authentication = useAuthStore((state) => state.authentication);
  const clearAuthentication = useAuthStore((state) => state.clear);
  const router = useRouter();
  const role = useAuthStore((state) => state.authentication?.role);

  // 읽지 않은 알림 개수
  const unreadCount = notifications.filter((n) => !n.isChecked).length;

  // 역할별 링크
  const getLinkByRole = (role?: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "/super-admin";
      case "ADMIN":
        return "/admin/notice";
      case "USER":
        return "/resident/notice";
      default:
        return "/";
    }
  };

  // 로그아웃 처리
  async function handleLogout() {
    try {
      await logout();
      clearAuthentication();
      router.replace("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  }

  // 알림 토글 함수
  const toggleNotification = () => setIsNotificationOpen((prev) => !prev);

  const { connect, disconnect, isConnected, subscribe, unsubscribe } =
    useSseStore();

  // 브라우저 Notification 권한 요청
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.warn(
        "[Notification] 브라우저가 Notification API를 지원하지 않습니다",
      );
      return;
    }

    if (Notification.permission === "granted") {
      console.log("[Notification] 이미 권한이 허용됨");
      return;
    }

    if (Notification.permission !== "denied") {
      try {
        const permission = await Notification.requestPermission();
        console.log("[Notification] 권한 요청 결과:", permission);

        if (permission === "granted") {
          console.log("[Notification] 권한 허용됨");
        }
      } catch (error) {
        console.error("[Notification] 권한 요청 중 에러:", error);
      }
    }
  };

  useEffect(() => {
    connect();
    requestNotificationPermission();
    console.log("[ALARM] Navibar 마운트: SSE connect 및 권한 요청");
    return () => {
      disconnect();
      console.log("[ALARM] Navibar 언마운트: SSE disconnect");
    };
  }, []);

  // 브라우저 알림 표시
  const showBrowserNotification = (notification: NotificationDto) => {
    if (!("Notification" in window)) {
      console.warn("[ALARM] 브라우저가 Notification API를 지원하지 않습니다");
      return;
    }
    if (Notification.permission !== "granted") {
      console.warn(
        "[ALARM] 알림 권한이 없습니다. 권한:",
        Notification.permission,
      );
      return;
    }
    try {
      const browserNotification = new Notification("WeLive 알림", {
        body: notification.content,
        icon: "/img/logo.svg",
        badge: "/img/logo.svg",
        tag: `notification-${notification.id}`,
        requireInteraction: false,
      });
      console.log("[ALARM]  브라우저 알림 표시:", notification);
      browserNotification.addEventListener("click", () => {
        console.log("[ALARM] 브라우저 알림 클릭됨:", notification.id);
        window.focus();
        browserNotification.close();
      });
      browserNotification.addEventListener("close", () => {
        console.log("[ALARM] 브라우저 알림 닫힘:", notification.id);
      });
    } catch (error) {
      console.error("[ALARM] 브라우저 알림 표시 중 에러:", error);
    }
  };
 
  useEffect(() => {
    const TOPIC = "alarm";
    if (isConnected) {
      console.log("[ALARM] SSE 연결됨, alarm 구독 시작");
      subscribe(TOPIC, (newNotifications: NotificationDto[]) => {
        console.log("[ALARM] alarm 이벤트 수신:", newNotifications);
        try {
          const notificationsArray = Array.isArray(newNotifications)
            ? newNotifications
            : [newNotifications];

          notificationsArray.forEach((n) => {
            console.log("[ALARM] 알림 addData 호출:", n);
            addData(n);
            if (!n.isChecked) {
              showBrowserNotification(n);
            }
          });
        } catch (error) {
          console.error("[ALARM] 알림 데이터 파싱 에러:", error);
        }
      });
    }
    return () => {
      unsubscribe(TOPIC);
      console.log("[ALARM] alarm 구독 해제");
    };
  }, [isConnected, subscribe, unsubscribe, addData]);

  useEffect(() => {
    fetch();
  }, []);

  // 알람 읽음 함수
  async function markAsRead(notificationId: string) {
    try {
      await markNotificationAsRead(notificationId);
      updateData(notificationId, { isChecked: true });
    } catch (error) {
      console.error("알림읽음 처리함수 에러", error);
      throw error;
    }
  }


  return (
    <div className="z-10 h-[72px] border-b border-gray-200 px-[50px] py-[18px]">
      <div className="flex h-full items-center justify-between">
        {/* 메인로고 */}
        <Link href={getLinkByRole(role)}>
          <Image
            src="/img/logo.svg"
            alt="WeLive Logo"
            width={81}
            height={30}
            priority
          />
        </Link>

        {/* 알림 및 유저 정보 */}
        <div className="flex items-center justify-center gap-10">
          {/* 알림 아이콘 */}
          <div className="relative">
            <Image
              src="/img/Bell.svg"
              alt="알림"
              width={24}
              height={24}
              priority
              className="cursor-pointer text-gray-500"
              onClick={toggleNotification}
            />
            {/* 빨간 점 표시 */}
            {unreadCount > 0 && (
              <span className="absolute bottom-0 left-5 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-white bg-red-500" />
            )}
            {isNotificationOpen && (
              <NotificationPanel
                notifications={notifications}
                onClose={toggleNotification}
                onMarkAsRead={markAsRead}
              />
            )}
          </div>

          {/* 유저 이미지 및 이름 */}
          <div className="flex items-center gap-2.5">
            <Image
              src={authentication?.avatar ?? "/img/userImage.svg"}
              alt="유저 이미지"
              width={36}
              height={36}
              priority
              className="rounded-full object-cover"
            />
            <p className="text-gray-500">{authentication?.name ?? "사용자"}</p>
          </div>

          {/* 로그아웃 */}
          <button
            className="text-gray-300 hover:text-gray-500"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
