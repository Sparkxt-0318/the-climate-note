import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { CapacitorNotifications } from '../capacitor-plugins';

interface CapacitorNotificationSettings {
  isNative: boolean;
  permissionsGranted: boolean;
  canSchedule: boolean;
}

export function useCapacitorNotifications() {
  const [settings, setSettings] = useState<CapacitorNotificationSettings>({
    isNative: false,
    permissionsGranted: false,
    canSchedule: false
  });

  useEffect(() => {
    const initializeCapacitor = async () => {
      const isNative = Capacitor.isNativePlatform();
      
      if (isNative) {
        const permissionsGranted = await CapacitorNotifications.initialize();
        setSettings({
          isNative: true,
          permissionsGranted,
          canSchedule: permissionsGranted
        });
      } else {
        setSettings({
          isNative: false,
          permissionsGranted: false,
          canSchedule: false
        });
      }
    };

    initializeCapacitor();
  }, []);

  const scheduleReminder = async (time: string) => {
    if (!settings.canSchedule) {
      return false;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    return await CapacitorNotifications.scheduleLocalNotification(
      'Time for your Climate Note! 🌱',
      'Read today\'s environmental story and write your action note to keep your streak going.',
      scheduledTime
    );
  };

  const cancelReminders = async () => {
    if (settings.canSchedule) {
      await CapacitorNotifications.cancelAllNotifications();
    }
  };

  return {
    ...settings,
    scheduleReminder,
    cancelReminders
  };
}