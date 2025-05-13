import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call for registration
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Navigate to login after successful registration
      router.replace('/auth/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={navigateBack}
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
        </View>

        <View style={styles.formContainer}>
          {error && <Text style={styles.errorText}>{error}</Text>}
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
            />
          </View>

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
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.passwordToggle} 
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 
                  <EyeOff size={20} color="#6B7280" /> : 
                  <Eye size={20} color="#6B7280" />
                }
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                style={styles.passwordToggle} 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 
                  <EyeOff size={20} color="#6B7280" /> : 
                  <Eye size={20} color="#6B7280" />
                }
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginRight: 40, // Balance the back button
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
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
  button: {
    backgroundColor: '#3B82F6',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  loginLink: {
    color: '#3B82F6',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});