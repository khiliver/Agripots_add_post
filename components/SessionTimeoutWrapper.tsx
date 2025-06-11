import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useSessionTimeout } from '../hooks/useSessionTimeout';

interface SessionTimeoutWrapperProps {
  children: React.ReactNode;
  warningThreshold?: number; // Show warning when X seconds remain
}

export function SessionTimeoutWrapper({ 
  children, 
  warningThreshold = 10 
}: SessionTimeoutWrapperProps) {
  const [showWarning, setShowWarning] = useState(false);
  const { timeRemaining, isSessionActive, updateActivity, resetSession } = useSessionTimeout();

  useEffect(() => {
    // Show warning when time is running low
    if (timeRemaining <= warningThreshold && timeRemaining > 0 && isSessionActive) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [timeRemaining, warningThreshold, isSessionActive]);

  const handleExtendSession = async () => {
    await resetSession();
    setShowWarning(false);
  };

  const handleUserActivity = async () => {
    if (isSessionActive) {
      await updateActivity();
    }
  };

  return (
    <View style={styles.container} onTouchStart={handleUserActivity}>
      {children}
      
      <Modal
        visible={showWarning}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWarning(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.warningContainer}>
            <View style={styles.warningHeader}>
              <AlertTriangle size={24} color="#F59E0B" />
              <Text style={styles.warningTitle}>Session Expiring Soon</Text>
            </View>
            
            <Text style={styles.warningMessage}>
              Your session will expire in {timeRemaining} seconds due to inactivity.
            </Text>
            
            <View style={styles.timerContainer}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.timerText}>{timeRemaining}s remaining</Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.extendButton}
                onPress={handleExtendSession}
              >
                <Text style={styles.extendButtonText}>Stay Logged In</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.infoText}>
              Any activity will automatically extend your session.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  warningContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginLeft: 12,
  },
  warningMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    marginBottom: 16,
    textAlign: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  buttonContainer: {
    marginBottom: 12,
  },
  extendButton: {
    backgroundColor: '#1B5E20',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  extendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
});