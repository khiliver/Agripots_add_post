import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface LoginAttempt {
  email: string;
  failedAttempts: number;
  lastFailedAttempt: string;
  lockedUntil?: string;
}

const USERS_STORAGE_KEY = 'app_users';
const CURRENT_USER_KEY = 'current_user';
const LOGIN_ATTEMPTS_KEY = 'login_attempts';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 1000; // 30 seconds in milliseconds

// Initialize with default admin and user accounts
const DEFAULT_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
];

export class UserService {
  static async initializeUsers(): Promise<void> {
    try {
      const existingUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (!existingUsers) {
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      }
    } catch (error) {
      console.error('Error initializing users:', error);
    }
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      return usersJson ? JSON.parse(usersJson) : DEFAULT_USERS;
    } catch (error) {
      console.error('Error getting users:', error);
      return DEFAULT_USERS;
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  static async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    try {
      const users = await this.getAllUsers();
      
      // Check if user already exists
      const existingUser = users.find(user => user.email.toLowerCase() === userData.email.toLowerCase());
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getLoginAttempts(): Promise<LoginAttempt[]> {
    try {
      const attemptsJson = await AsyncStorage.getItem(LOGIN_ATTEMPTS_KEY);
      return attemptsJson ? JSON.parse(attemptsJson) : [];
    } catch (error) {
      console.error('Error getting login attempts:', error);
      return [];
    }
  }

  static async saveLoginAttempts(attempts: LoginAttempt[]): Promise<void> {
    try {
      await AsyncStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
    } catch (error) {
      console.error('Error saving login attempts:', error);
    }
  }

  static async checkAccountLockout(email: string): Promise<{ isLocked: boolean; remainingTime?: number }> {
    try {
      const attempts = await this.getLoginAttempts();
      const userAttempt = attempts.find(attempt => attempt.email.toLowerCase() === email.toLowerCase());
      
      if (!userAttempt || userAttempt.failedAttempts < MAX_FAILED_ATTEMPTS) {
        return { isLocked: false };
      }

      if (userAttempt.lockedUntil) {
        const lockoutTime = new Date(userAttempt.lockedUntil).getTime();
        const currentTime = new Date().getTime();
        
        if (currentTime < lockoutTime) {
          const remainingTime = Math.ceil((lockoutTime - currentTime) / 1000);
          return { isLocked: true, remainingTime };
        } else {
          // Lockout period has expired, reset attempts
          await this.resetFailedAttempts(email);
          return { isLocked: false };
        }
      }

      return { isLocked: false };
    } catch (error) {
      console.error('Error checking account lockout:', error);
      return { isLocked: false };
    }
  }

  static async recordFailedAttempt(email: string): Promise<void> {
    try {
      const attempts = await this.getLoginAttempts();
      const existingAttemptIndex = attempts.findIndex(attempt => 
        attempt.email.toLowerCase() === email.toLowerCase()
      );

      const now = new Date().toISOString();

      if (existingAttemptIndex >= 0) {
        attempts[existingAttemptIndex].failedAttempts += 1;
        attempts[existingAttemptIndex].lastFailedAttempt = now;
        
        if (attempts[existingAttemptIndex].failedAttempts >= MAX_FAILED_ATTEMPTS) {
          const lockoutTime = new Date(Date.now() + LOCKOUT_DURATION).toISOString();
          attempts[existingAttemptIndex].lockedUntil = lockoutTime;
        }
      } else {
        const newAttempt: LoginAttempt = {
          email: email.toLowerCase(),
          failedAttempts: 1,
          lastFailedAttempt: now,
        };
        attempts.push(newAttempt);
      }

      await this.saveLoginAttempts(attempts);
    } catch (error) {
      console.error('Error recording failed attempt:', error);
    }
  }

  static async resetFailedAttempts(email: string): Promise<void> {
    try {
      const attempts = await this.getLoginAttempts();
      const filteredAttempts = attempts.filter(attempt => 
        attempt.email.toLowerCase() !== email.toLowerCase()
      );
      await this.saveLoginAttempts(filteredAttempts);
    } catch (error) {
      console.error('Error resetting failed attempts:', error);
    }
  }

  static async authenticateUser(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Check if account is locked
      const lockoutStatus = await this.checkAccountLockout(email);
      if (lockoutStatus.isLocked) {
        return {
          success: false,
          error: `Account temporarily locked. Try again in ${lockoutStatus.remainingTime} seconds.`
        };
      }

      const user = await this.getUserByEmail(email);
      if (user && user.password === password) {
        // Successful login - reset failed attempts
        await this.resetFailedAttempts(email);
        return { success: true, user };
      } else {
        // Failed login - record attempt
        await this.recordFailedAttempt(email);
        
        // Check how many attempts are left
        const attempts = await this.getLoginAttempts();
        const userAttempt = attempts.find(attempt => attempt.email.toLowerCase() === email.toLowerCase());
        const remainingAttempts = MAX_FAILED_ATTEMPTS - (userAttempt?.failedAttempts || 0);
        
        if (remainingAttempts <= 0) {
          return {
            success: false,
            error: 'Account locked due to too many failed attempts. Try again in 30 seconds.'
          };
        } else {
          return {
            success: false,
            error: `Invalid email or password. ${remainingAttempts} attempts remaining.`
          };
        }
      }
    } catch (error) {
      console.error('Error authenticating user:', error);
      return { success: false, error: 'An error occurred during authentication.' };
    }
  }

  static async setCurrentUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      await AsyncStorage.setItem('authToken', `token-${user.id}`);
      await AsyncStorage.setItem('userRole', user.role);
      await AsyncStorage.setItem('userName', user.name);
    } catch (error) {
      console.error('Error setting current user:', error);
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async clearCurrentUser(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        CURRENT_USER_KEY,
        'authToken',
        'userRole',
        'userName'
      ]);
    } catch (error) {
      console.error('Error clearing current user:', error);
      throw error;
    }
  }

  static async updateUser(userId: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    try {
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(user => user.id === userId);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const updatedUser = { ...users[userIndex], ...updates };
      users[userIndex] = updatedUser;
      
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      
      // Update current user if it's the same user
      const currentUser = await this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        await this.setCurrentUser(updatedUser);
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      const users = await this.getAllUsers();
      const filteredUsers = users.filter(user => user.id !== userId);
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filteredUsers));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): { isValid: boolean; message?: string } {
    if (password.length < 6) {
      return { isValid: false, message: 'Password must be at least 6 characters long' };
    }
    return { isValid: true };
  }
}