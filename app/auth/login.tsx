import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { router } from 'expo-router';
import { Eye, EyeOff, Shield, Clock } from 'lucide-react-native';
import { UserService } from '../../services/userService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutInfo, setLockoutInfo] = useState<{ isLocked: boolean; remainingTime?: number }>({ isLocked: false });

  useEffect(() => {
    // Initialize users on component mount
    UserService.initializeUsers();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (lockoutInfo.isLocked && lockoutInfo.remainingTime && lockoutInfo.remainingTime > 0) {
      interval = setInterval(async () => {
        if (email) {
          const status = await UserService.checkAccountLockout(email);
          setLockoutInfo(status);
          
          if (!status.isLocked) {
            setError(null);
          }
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [lockoutInfo, email]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!UserService.validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await UserService.authenticateUser(email, password);
      
      if (result.success && result.user) {
        await UserService.setCurrentUser(result.user);
        
        if (result.user.role === 'admin') {
          router.replace('/(admin)/dashboard');
        } else {
          router.replace('/(user)/home');
        }
      } else {
        setError(result.error || 'Authentication failed');
        
        // Check if account is now locked
        const lockoutStatus = await UserService.checkAccountLockout(email);
        setLockoutInfo(lockoutStatus);
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

  const isLoginDisabled = isLoading || lockoutInfo.isLocked;

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
        <Text style={styles.appName}>AgriPots</Text>
        <Text style={styles.appSubtitle}>Smart Agriculture Management</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
        
        {error && (
          <View style={[
            styles.errorContainer,
            lockoutInfo.isLocked && styles.lockoutErrorContainer
          ]}>
            {lockoutInfo.isLocked && <Shield size={16} color="#EF4444" style={styles.errorIcon} />}
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {lockoutInfo.isLocked && lockoutInfo.remainingTime && (
          <View style={styles.lockoutContainer}>
            <Clock size={16} color="#F59E0B" style={styles.lockoutIcon} />
            <Text style={styles.lockoutText}>
              Account locked for {lockoutInfo.remainingTime} seconds
            </Text>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, lockoutInfo.isLocked && styles.inputDisabled]}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!lockoutInfo.isLocked}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={[styles.passwordContainer, lockoutInfo.isLocked && styles.inputDisabled]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
              editable={!lockoutInfo.isLocked}
            />
            <TouchableOpacity 
              style={styles.passwordToggle} 
              onPress={togglePasswordVisibility}
              disabled={lockoutInfo.isLocked}
            >
              {showPassword ? 
                <EyeOff size={20} color={lockoutInfo.isLocked ? "#D1D5DB" : "#6B7280"} /> : 
                <Eye size={20} color={lockoutInfo.isLocked ? "#D1D5DB" : "#6B7280"} />
              }
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotPassword} disabled={lockoutInfo.isLocked}>
          <Text style={[styles.forgotPasswordText, lockoutInfo.isLocked && styles.textDisabled]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, isLoginDisabled && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={isLoginDisabled}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Signing In...' : lockoutInfo.isLocked ? 'Account Locked' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={navigateToRegister} disabled={lockoutInfo.isLocked}>
            <Text style={[styles.registerLink, lockoutInfo.isLocked && styles.textDisabled]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {!lockoutInfo.isLocked && (
          <View style={styles.demoCredentials}>
            <Text style={styles.demoTitle}>Demo Accounts:</Text>
            <TouchableOpacity 
              style={styles.demoButton}
              onPress={() => {
                setEmail('admin@example.com');
                setPassword('admin123');
              }}
            >
              <Text style={styles.demoButtonText}>Use Admin Account</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.demoButton}
              onPress={() => {
                setEmail('user@example.com');
                setPassword('user123');
              }}
            >
              <Text style={styles.demoButtonText}>Use User Account</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.securityInfo}>
          <Shield size={14} color="#6B7280" />
          <Text style={styles.securityText}>
            Account will be locked for 30 seconds after 5 failed attempts
          </Text>
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
    marginTop: 12,
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1B5E20',
  },
  appSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  lockoutErrorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  lockoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  lockoutIcon: {
    marginRight: 8,
  },
  lockoutText: {
    color: '#D97706',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    flex: 1,
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
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
    color: '#9CA3AF',
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
    color: '#1B5E20',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  textDisabled: {
    color: '#D1D5DB',
  },
  button: {
    backgroundColor: '#1B5E20',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
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
    color: '#1B5E20',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  demoCredentials: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  demoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#4B5563',
    marginBottom: 12,
    textAlign: 'center',
  },
  demoButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  demoButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#1B5E20',
    textAlign: 'center',
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  securityText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 6,
    textAlign: 'center',
  },
});