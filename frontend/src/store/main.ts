import { defineStore } from "pinia";

export const useMain = defineStore('Main', {
    state() {
        return {
            AccessToken: null
        }
    },
    getters: {
        getToken(state):string|boolean {
            if(state.AccessToken) {
                return `Bearer ${state.AccessToken}`
            } else {
                return false
            }
        }
    },
    actions: {
        setToken(token: any) {
            this.AccessToken = token
        },
    },
    persist: {
        enabled: true
    }
})

