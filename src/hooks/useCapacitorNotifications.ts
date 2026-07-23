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
    canSchedule: false,
  });

  useEffect(() => {
    const checkOnly = async () => {
      const isNative = Capacitor.isNativePlatform();

      if (isNative) {
        // Check status only — never prompt until the user opts in.
        const permissionsGranted = await CapacitorNotifications.checkPermissions();
        setSettings({
          isNative: true,
          permissionsGranted,
          canSchedule: permissionsGranted,
        });
      } else {
        setSettings({
          isNative: false,
          permissionsGranted: false,
          canSchedule: false,
        });
      }
    };

    void checkOnly();
  }, []);

  const requestPermissions = async (): Promise<boolean> => {
    const granted = await CapacitorNotifications.requestPermissions();
    setSettings((prev) => ({
      ...prev,
      permissionsGranted: granted,
      canSchedule: granted,
    }));
    return granted;
  };

  const scheduleReminder = async (time: string) => {
    let canSchedule = settings.canSchedule;
    if (!canSchedule && Capacitor.isNativePlatform()) {
      canSchedule = await CapacitorNotifications.checkPermissions();
      if (canSchedule) {
        setSettings((prev) => ({
          ...prev,
          permissionsGranted: true,
          canSchedule: true,
        }));
      }
    }
    if (!canSchedule) {
      return false;
    }
    return CapacitorNotifications.scheduleDailyReminder(time);
  };

  const cancelReminders = async () => {
    if (settings.canSchedule) {
      await CapacitorNotifications.cancelAllNotifications();
    }
  };

  return {
    ...settings,
    requestPermissions,
    scheduleReminder,
    cancelReminders,
  };
}
