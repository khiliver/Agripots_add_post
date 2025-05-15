import { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronRight, Bell, Moon, Globe, Lock, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const toggleDarkMode = (value: boolean) => {
    setDarkModeEnabled(value);
    Alert.alert(
      "Dark Mode",
      value ? "Dark mode enabled" : "Dark mode disabled",
      [{ text: "OK" }]
    );
  };

  const toggleNotifications = (value: boolean) => {
    setNotificationsEnabled(value);
    Alert.alert(
      "Notifications",
      value ? "Notifications enabled" : "Notifications disabled",
      [{ text: "OK" }]
    );
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
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          {renderSettingItem(
            <Bell size={22} color="#1B5E20" />,
            "Notifications",
            "Receive alerts and updates",
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#D1D5DB', true: '#DCF5E1' }}
              thumbColor={notificationsEnabled ? '#1B5E20' : '#9CA3AF'}
            />
          )}

          {renderSettingItem(
            <Moon size={22} color="#1B5E20" />,
            "Dark Mode",
            "Change app appearance",
            <Switch
              value={darkModeEnabled}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#D1D5DB', true: '#DCF5E1' }}
              thumbColor={darkModeEnabled ? '#1B5E20' : '#9CA3AF'}
            />
          )}

          {renderSettingItem(
            <Globe size={22} color="#1B5E20" />,
            "Language",
            "Change app language",
            <View style={styles.rightContent}>
              <Text style={styles.rightText}>English</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </View>,
            () => Alert.alert("Language Settings", "Language settings will be available in the next update.")
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account & Security</Text>

          {renderSettingItem(
            <Lock size={22} color="#1B5E20" />,
            "Privacy",
            "Manage your data and privacy",
            <ChevronRight size={18} color="#9CA3AF" />,
            () => Alert.alert("Privacy Settings", "Privacy settings will be available in the next update.")
          )}

          {renderSettingItem(
            <Lock size={22} color="#1B5E20" />,
            "Password",
            "Change your password",
            <ChevronRight size={18} color="#9CA3AF" />,
            () => Alert.alert("Change Password", "Password change feature will be available in the next update.")
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          {renderSettingItem(
            <HelpCircle size={22} color="#1B5E20" />,
            "Help Center",
            "Get help and contact support",
            <ChevronRight size={18} color="#9CA3AF" />,
            () => Alert.alert("Help Center", "Help center will be available in the next update.")
          )}

          {renderSettingItem(
            <HelpCircle size={22} color="#1B5E20" />,
            "About",
            "App version and information",
            <View style={styles.rightContent}>
              <Text style={styles.rightText}>v1.0.0</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </View>,
            () => Alert.alert("About AgriPots", "AgriPots\nVersion 1.0.0\nYour Smart Agriculture Companion")
          )}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={18} color="#EF4444" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
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
    color: '#1B5E20',
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
    backgroundColor: '#DCF5E1',
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
  rightText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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