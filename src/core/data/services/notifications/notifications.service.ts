import { Injectable } from '@angular/core';
import { LocalNotifications, ILocalNotification } from '@ionic-native/local-notifications';

@Injectable()
export class NotificationsService {

    constructor(
        private localNotifications: LocalNotifications
    ) {

    }

    async addNotifications(notifications: any) {
        // TODO: maybe check what notifications are already set
        await this.localNotifications.schedule(notifications);
    }

    async getAllNotifications(): Promise<Array<ILocalNotification>> {
        return await this.localNotifications.getAll();
    }

    /*
     * Deletes notification by unique id
     * Returns a promise when the notification is canceled
     */
    async deleteNotification(id: any): Promise<any> {
        if (this.localNotifications.isPresent(id)) {
            return await this.localNotifications.cancel(id);
        }
        return null;
    }
}
