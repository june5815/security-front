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
  const {data: notifications, fetch, add: addData, update: updateData} = useNotificationStore();

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
      case 'SUPER_ADMIN':
        return '/super-admin';
      case 'ADMIN':
        return '/admin/notice';
      case 'USER':
        return '/resident/notice';
      default:
        return '/';
    }
  };

  // 로그아웃 처리
  async function handleLogout() {
    try {
      await logout();
      clearAuthentication();
      router.replace('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  }

  // 알림 토글 함수
  const toggleNotification = () => setIsNotificationOpen((prev) => !prev);

  const {connect, disconnect, isConnected, subscribe, unsubscribe} = useSseStore();

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    }
  }, [])

  useEffect(() => {
    const TOPIC = 'alarm'
    if (isConnected) {
      subscribe(TOPIC, (newNotifications: NotificationDto[]) => {
        try {
          newNotifications.forEach(n => addData(n));

        } catch (error) {
          console.error('알림 데이터 파싱 에러:', error);
        }
      })
    }

    return () => {
      unsubscribe(TOPIC);
    }
  }, [isConnected])

  useEffect(() => {
    fetch();
  }, [])

  // 알람 읽음 함수
  async function markAsRead(notificationId: string) {
    try {
      await markNotificationAsRead(notificationId);
      updateData(notificationId, {isChecked: true})

    } catch (error) {
      console.error('알림읽음 처리함수 에러', error);
      throw error;
    }
  }

  return (
    <div className='z-10 h-[72px] border-b border-gray-200 px-[50px] py-[18px]'>
      <div className='flex h-full items-center justify-between'>
        {/* 메인로고 */}
        <Link href={getLinkByRole(role)}>
          <Image src='/img/logo.svg' alt='WeLive Logo' width={81} height={30} priority />
        </Link>

        {/* 알림 및 유저 정보 */}
        <div className='flex items-center justify-center gap-10'>
          {/* 알림 아이콘 */}
          <div className='relative'>
            <Image
              src='/img/Bell.svg'
              alt='알림'
              width={24}
              height={24}
              priority
              className='cursor-pointer text-gray-500'
              onClick={toggleNotification}
            />
            {/* 빨간 점 표시 */}
            {unreadCount > 0 && (
              <span className='absolute bottom-0 left-5 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-white bg-red-500' />
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
          <div className='flex items-center gap-2.5'>
            <Image
              src={authentication?.avatar ?? '/img/userImage.svg'}
              alt='유저 이미지'
              width={36}
              height={36}
              priority
              className='rounded-full object-cover'
            />
            <p className='text-gray-500'>{authentication?.name ?? '사용자'}</p>
          </div>

          {/* 로그아웃 */}
          <button className='text-gray-300 hover:text-gray-500' onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
