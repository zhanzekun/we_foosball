import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserInfo } from '@/types'

interface UserStore {
  userInfo: UserInfo | null
  isLoading: boolean
  setUserInfo: (userInfo: UserInfo | null) => void
  setLoading: (loading: boolean) => void
  clearUserInfo: () => void
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userInfo: null,
      isLoading: true,
      
      setUserInfo: (userInfo: UserInfo | null) => {
        set({ userInfo, isLoading: false })
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
      
      clearUserInfo: () => {
        set({ userInfo: null, isLoading: false })
      }
    }),
    {
      name: 'user-storage', // localStorage 的 key
      partialize: (state) => ({ userInfo: state.userInfo }), // 只持久化 userInfo
    }
  )
)

export default useUserStore 