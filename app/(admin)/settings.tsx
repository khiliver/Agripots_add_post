import { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronRight, Server, Shield, Database, Bell, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AdminSettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [enhancedSecurity, setEnhancedSecurity] = useState(true);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    description: string,
    rightElement?: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIconContainer}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      {rightElement}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System</Text>
          
          {renderSettingItem(
            <Server size={22} color="#3B82F6" />,
            "Maintenance Mode",
            "Temporarily disable user access",
            <Switch
              value={maintenanceMode}
              onValueChange={setMaintenanceMode}
              trackColor={{ false: '#D1D5DB', true: '#BFDBFE' }}
              thumbColor={maintenanceMode ? '#3B82F6' : '#9CA3AF'}
            />
          )}
          
          {renderSettingItem(
            <Database size={22} color="#3B82F6" />,
            "Database Backup",
            "Manage system backups",
            <View style={styles.rightContent}>
              <Text style={styles.lastBackupText}>Last: Today</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </View>,
            () => Alert.alert("Database Backup", "This feature will be available in a future update.")
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          {renderSettingItem(
            <Shield size={22} color="#3B82F6" />,
            "Enhanced Security",
            "Additional security measures",
            <Switch
              value={enhancedSecurity}
              onValueChange={setEnhancedSecurity}
              trackColor={{ false: '#D1D5DB', true: '#BFDBFE' }}
              thumbColor={enhancedSecurity ? '#3B82F6' : '#9CA3AF'}
            />
          )}
          
          {renderSettingItem(
            <Shield size={22} color="#3B82F6" />,
            "Access Logs",
            "View system access history",
            <ChevronRight size={18} color="#9CA3AF" />,
            () => Alert.alert("Access Logs", "This feature will be available in a future update.")
          )}
          
          {renderSettingItem(
            <Shield size={22} color="#3B82F6" />,
            "Permission Management",
            "Manage user roles and permissions",
            <ChevronRight size={18} color="#9CA3AF" />,
            () => Alert.alert("Permission Management", "This feature will be available in a future update.")
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          {renderSettingItem(
            <Bell size={22} color="#3B82F6" />,
            "System Notifications",
            "Receive important alerts",
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#BFDBFE' }}
              thumbColor={notificationsEnabled ? '#3B82F6' : '#9CA3AF'}
            />
          )}
          
          {renderSettingItem(
            <Bell size={22} color="#3B82F6" />,
            "Email Notifications",
            "Configure email alerts",
            <ChevronRight size={18} color="#9CA3AF" />,
            () => Alert.alert("Email Notifications", "This feature will be available in a future update.")
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced</Text>
          
          {renderSettingItem(
            <Server size={22} color="#3B82F6" />,
            "System Logs",
            "View application logs",
            <ChevronRight size={18} color="#9CA3AF" />,
            () => Alert.alert("System Logs", "This feature will be available in a future update.")
          )}
          
          {renderSettingItem(
            <Server size={22} color="#3B82F6" />,
            "API Configuration",
            "Manage API settings",
            <ChevronRight size={18} color="#9CA3AF" />,
            () => Alert.alert("API Configuration", "This feature will be available in a future update.")
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={18} color="#EF4444" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout Admin</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastBackupText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#10B981',
    marginRight: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
});