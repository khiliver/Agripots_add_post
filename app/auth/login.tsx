import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call for authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo login logic (replace with actual authentication)
      if (email === 'admin@example.com' && password === 'admin123') {
        // Admin login
        await AsyncStorage.setItem('authToken', 'demo-token-admin');
        await AsyncStorage.setItem('userRole', 'admin');
        await AsyncStorage.setItem('userName', 'Admin User');
        router.replace('/(admin)/dashboard');
      } else if (email === 'user@example.com' && password === 'user123') {
        // Regular user login
        await AsyncStorage.setItem('authToken', 'demo-token-user');
        await AsyncStorage.setItem('userRole', 'user');
        await AsyncStorage.setItem('userName', 'Regular User');
        router.replace('/(user)/home');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigateToRegister = () => {
    router.push('/auth/register');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/5926393/pexels-photo-5926393.jpeg?auto=compress&cs=tinysrgb&w=300' }} 
          style={styles.logo} 
        />
        <Text style={styles.appName}>AdminUser App</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign In</Text>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.passwordToggle} 
              onPress={togglePasswordVisibility}
            >
              {showPassword ? 
                <EyeOff size={20} color="#6B7280" /> : 
                <Eye size={20} color="#6B7280" />
              }
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Signing In...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={navigateToRegister}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demoCredentials}>
          <Text style={styles.demoTitle}>Demo Credentials:</Text>
          <Text style={styles.demoText}>Admin: admin@example.com / admin123</Text>
          <Text style={styles.demoText}>User: user@example.com / user123</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  appName: {
    marginTop: 8,
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 24,
  },
  errorText: {
    backgroundColor: '#FEE2E2',
    color: '#EF4444',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: 48,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  passwordToggle: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#3B82F6',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  button: {
    backgroundColor: '#3B82F6',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  registerText: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  registerLink: {
    color: '#3B82F6',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  demoCredentials: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  demoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#4B5563',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
});