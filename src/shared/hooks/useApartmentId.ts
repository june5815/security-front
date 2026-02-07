import useAuthStore from '@/lib/stores/useAuthStore';
import { useMemo } from 'react';

export const useApartmentId = () => {
  const authentication = useAuthStore(state => state.authentication);
  const apartmentId: string|undefined = useMemo(() => {
    if (authentication) {
      if (authentication.role === 'ADMIN') {
        return authentication.adminOf?.id;
      } else if (authentication.role === 'USER') {
        return authentication.resident?.apartmentId;
      }}
    return undefined;
    }, [authentication]);

  return {apartmentId};
}