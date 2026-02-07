import { create } from 'zustand';
import { LoginResponse } from '@/lib/types';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AuthState = {
  authentication: LoginResponse | null;
  setAuthentication: (authentication: LoginResponse) => void;
  isAuthenticated: () => boolean;
  isSuperAdminUser: () => boolean;
  isAdminUser: () => boolean;
  isResidentUser: () => boolean;
  clear: () => void;
}

const useAuthStore =  create<AuthState>()(
  persist(
    (set, get) => ({
      authentication: null,
      setAuthentication: authentication => set({authentication}),
      isAuthenticated: () => get().authentication != null,
      isSuperAdminUser: () => {
        const {authentication} = get();
        return authentication ? authentication.role === 'SUPER_ADMIN' : false;
      },
      isAdminUser: () => {
        const {authentication} = get();
        return authentication ? authentication.role === 'ADMIN' : false;
      },
      isResidentUser: () => {
        const {authentication} = get();
        return authentication ? authentication.role === 'USER' : false;
      },
      clear: () => {
        set({
          authentication: null
        })
      }
    }),
    {
      name: 'welive:authentication',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export default useAuthStore;