import { defineStore } from 'pinia'

interface LoginUser {
  id: string,
  username: string,
  avatar?: string,
  roles: Array<string>
}

export const useUserStore = defineStore('users', {
  state: () => {
    return {
      loginUser: {
        id: '',
        username: '',
        avatar: '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',
        roles: []
      } as LoginUser,
      token: ''
    }
  },
  actions: {
    setLoginUser(loginUser: LoginUser) {
      this.loginUser = loginUser
    },
    setToken(token: string) {
      this.token = token
    },
    initUser() {
      this.loginUser = {
        id: '',
        username: '',
        avatar: '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',
        roles: []
      } as LoginUser
      this.token = ''
    }
  }
})