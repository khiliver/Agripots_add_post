import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { router } from 'expo-router';
import { UserService } from '../services/userService';

interface UseSessionTimeoutOptions {
  onSessionExpired?: () => void;
  checkInterval?: number; // in milliseconds
}

export function useSessionTimeout(options: UseSessionTimeoutOptions = {}) {
  const { onSessionExpired, checkInterval = 1000 } = options;
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const updateActivity = async () => {
    try {
      const currentUser = await UserService.getCurrentUser();
      if (currentUser) {
        await UserService.updateSessionActivity(currentUser.id);
        setIsSessionActive(true);
      }
    } catch (error) {
      console.error('Error updating session activity:', error);
    }
  };

  const checkSessionStatus = async () => {
    try {
      const isExpired = await UserService.isSessionExpired();
      const remaining = await UserService.getSessionTimeRemaining();
      
      setTimeRemaining(remaining);
      
      if (isExpired) {
        setIsSessionActive(false);
        await handleSessionExpired();
      } else {
        setIsSessionActive(true);
      }
    } catch (error) {
      console.error('Error checking session status:', error);
    }
  };

  const handleSessionExpired = async () => {
    try {
      await UserService.clearCurrentUser();
      
      if (onSessionExpired) {
        onSessionExpired();
      } else {
        router.replace('/auth/login');
      }
    } catch (error) {
      console.error('Error handling session expiry:', error);
    }
  };

  const resetSession = async () => {
    await updateActivity();
    await checkSessionStatus();
  };

  useEffect(() => {
    // Initial session check
    checkSessionStatus();

    // Set up interval to check session status
    intervalRef.current = setInterval(checkSessionStatus, checkInterval);

    // Handle app state changes
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground, check session immediately
        checkSessionStatus();
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      subscription?.remove();
    };
  }, [checkInterval]);

  return {
    timeRemaining,
    isSessionActive,
    updateActivity,
    resetSession,
    checkSessionStatus,
  };
}