import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Edit, MapPin, Mail, Phone, Calendar, Briefcase } from 'lucide-react-native';

export default function ProfileScreen() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        setUserName(name);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=300' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Edit size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{userName || 'User'}</Text>
          <Text style={styles.userRole}>Regular User</Text>
          
          <View style={styles.locationContainer}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.locationText}>San Francisco, CA</Text>
          </View>
          
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Mail size={16} color="#3B82F6" />
            </View>
            <View>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>user@example.com</Text>
            </View>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Phone size={16} color="#3B82F6" />
            </View>
            <View>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>+1 (555) 123-4567</Text>
            </View>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Calendar size={16} color="#3B82F6" />
            </View>
            <View>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>January 1, 1990</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Information</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Briefcase size={16} color="#3B82F6" />
            </View>
            <View>
              <Text style={styles.infoLabel}>Company</Text>
              <Text style={styles.infoValue}>Acme Inc.</Text>
            </View>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <Briefcase size={16} color="#3B82F6" />
            </View>
            <View>
              <Text style={styles.infoLabel}>Position</Text>
              <Text style={styles.infoValue}>Software Developer</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Statistics</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>17</Text>
            <Text style={styles.statLabel}>Tasks</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>28</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>Project Update</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
          <Text style={styles.activityDescription}>
            You submitted a progress report for Project Alpha.
          </Text>
        </View>
        
        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>Task Completed</Text>
            <Text style={styles.activityTime}>Yesterday</Text>
          </View>
          <Text style={styles.activityDescription}>
            You completed the task "Implement user profile UI".
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerContent: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#3B82F6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  userRole: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  editButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activityCard: {
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
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  activityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
});