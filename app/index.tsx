import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const role = await AsyncStorage.getItem('userRole');
        
        if (token) {
          setIsAuthenticated(true);
          setUserRole(role);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // If authenticated, redirect to the appropriate dashboard
  if (isAuthenticated) {
    if (userRole === 'admin') {
      return <Redirect href="/(admin)/dashboard" />;
    } else {
      return <Redirect href="/(user)/home" />;
    }
  }

  // If not authenticated, redirect to login
  return <Redirect href="/auth/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4B5563',
  },
});