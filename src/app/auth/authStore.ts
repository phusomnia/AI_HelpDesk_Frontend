import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'
import useCookie, { deleteCookie, getCookie, setCookie } from './useCookie'

export const useAuthStore = create<any>()(
  (set) => ({
    token: getCookie('access_token') || null,
    payload: getCookie('access_token') ? jwtDecode(getCookie('access_token')!) : null,

    login: (token: string) => {
      setCookie('access_token', token, 1)
      set({
        token,
        payload: jwtDecode(token),
      })
    },

    logout: () => {
      deleteCookie('access_token')
      set({
        token: null,
        payload: null,
      })
    }
  })
)

