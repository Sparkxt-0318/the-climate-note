import { useEffect, useState } from 'react';

interface NotificationSettings {
  browserNotifications: boolean;
  reminderTime: string;
  lastUpdated: string;
}

export function useNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>({
    browserNotifications: false,
    reminderTime: '18:00',
    lastUpdated: new Date().toISOString()
  });

  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('climateNoteSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    setPermission(permission);
    return permission === 'granted';
  };

  const scheduleReminder = (time: string) => {
    if (permission !== 'granted') return;

    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      new Notification('Time for your Climate Note! 🌱', {
        body: 'Read today\'s environmental story and write your action note.',
        icon: '/favicon.ico',
        tag: 'climate-note-reminder',
        requireInteraction: true
      });

      // Schedule next day
      scheduleReminder(time);
    }, timeUntilNotification);
  };

  const sendStreakReminder = (streakCount: number) => {
    if (permission !== 'granted') return;

    new Notification(`${streakCount} Day Streak! 🔥`, {
      body: 'Keep your climate action streak alive! Write today\'s note.',
      icon: '/favicon.ico',
      tag: 'streak-reminder'
    });
  };

  const sendEncouragementNotification = (message: string) => {
    if (permission !== 'granted') return;

    new Notification('Someone encouraged your action! 💚', {
      body: message,
      icon: '/favicon.ico',
      tag: 'encouragement'
    });
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings, lastUpdated: new Date().toISOString() };
    setSettings(updatedSettings);
    localStorage.setItem('climateNoteSettings', JSON.stringify(updatedSettings));

    // Schedule notifications if enabled
    if (updatedSettings.browserNotifications && permission === 'granted') {
      scheduleReminder(updatedSettings.reminderTime);
    }
  };

  return {
    settings,
    permission,
    requestPermission,
    scheduleReminder,
    sendStreakReminder,
    sendEncouragementNotification,
    updateSettings
  };
}