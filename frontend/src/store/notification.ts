import { defineStore } from "pinia";


type Notification = {
    body: string,
}
type NotificationObject = {
    [key: string]: Notification
}

export const useNotifications = defineStore('Notification', {
    state() {
        return {
            notifications: {} as NotificationObject
        }
    },
    getters: {
        GetNots(state):Notification[] {
           return Object.values(this.notifications)
        }
    },
    actions: {
        Add(obj: Notification) {
            const code:string = 'NOT_' + (Math.random() + 1).toString(36).substring(7);
            this.notifications[code] = obj
            setTimeout(() => {
                delete this.notifications[code]
            }, 4000);
        },
    }
})

