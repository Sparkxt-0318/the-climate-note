import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { App } from '@capacitor/app';

export class CapacitorNotifications {
  static async initialize() {
    if (!Capacitor.isNativePlatform()) {
      return false;
    }

    try {
      // Request permissions
      const pushResult = await PushNotifications.requestPermissions();
      const localResult = await LocalNotifications.requestPermissions();
      
      if (pushResult.receive === 'granted' || localResult.display === 'granted') {
        await this.setupNotificationListeners();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error initializing Capacitor notifications:', error);
      return false;
    }
  }

  static async setupNotificationListeners() {
    // Handle notification received
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received: ', notification);
    });

    // Handle notification action performed
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
      // Navigate to the app when notification is tapped
      if (notification.actionId === 'tap') {
        // You can add navigation logic here
        window.location.href = '/';
      }
    });

    // Handle local notification action
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('Local notification action performed', notification);
      window.location.href = '/';
    });

    // Register for push notifications
    await PushNotifications.register();
  }

  static async scheduleLocalNotification(title: string, body: string, scheduleAt: Date) {
    if (!Capacitor.isNativePlatform()) {
      return false;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Math.floor(Math.random() * 1000000),
            schedule: { at: scheduleAt },
            sound: 'beep.wav',
            attachments: undefined,
            actionTypeId: '',
            extra: {
              action: 'open_app'
            }
          }
        ]
      });
      return true;
    } catch (error) {
      console.error('Error scheduling local notification:', error);
      return false;
    }
  }

  static async cancelAllNotifications() {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    try {
      await LocalNotifications.cancel({ notifications: [] });
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }
}

// App state listeners
export class CapacitorApp {
  static initialize() {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active?', isActive);
      
      if (isActive) {
        // App became active - you can refresh data here
        window.dispatchEvent(new CustomEvent('app-became-active'));
      }
    });

    App.addListener('appUrlOpen', (event) => {
      console.log('App opened with URL:', event.url);
      // Handle deep links here
    });
  }
}