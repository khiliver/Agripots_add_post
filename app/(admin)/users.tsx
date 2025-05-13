import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { Search, Filter, Plus, MoveVertical as MoreVertical, User, Mail, Phone } from 'lucide-react-native';

// Mock data for demonstration
const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: 'user',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    lastActive: 'Today at 10:30 AM',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 234-5678',
    role: 'user',
    status: 'inactive',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    lastActive: 'Yesterday at 3:45 PM',
  },
  {
    id: '3',
    name: 'Michael Smith',
    email: 'michael.smith@example.com',
    phone: '+1 (555) 345-6789',
    role: 'admin',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    lastActive: 'Today at 9:15 AM',
  },
  {
    id: '4',
    name: 'Emily Brown',
    email: 'emily.brown@example.com',
    phone: '+1 (555) 456-7890',
    role: 'user',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100',
    lastActive: '2 days ago',
  },
  {
    id: '5',
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    phone: '+1 (555) 567-8901',
    role: 'user',
    status: 'active',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    lastActive: 'Today at 2:20 PM',
  },
];

export default function UsersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserDetails, setSelectedUserDetails] = useState<typeof MOCK_USERS[0] | null>(null);

  const filteredUsers = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showUserDetails = (user: typeof MOCK_USERS[0]) => {
    setSelectedUserDetails(user);
  };

  const hideUserDetails = () => {
    setSelectedUserDetails(null);
  };

  const renderUserItem = ({ item }: { item: typeof MOCK_USERS[0] }) => (
    <TouchableOpacity 
      style={styles.userCard} 
      onPress={() => showUserDetails(item)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={styles.userMeta}>
          <View style={[
            styles.statusBadge, 
            item.status === 'active' ? styles.statusActive : styles.statusInactive
          ]}>
            <Text style={[
              styles.statusText,
              item.status === 'active' ? styles.statusTextActive : styles.statusTextInactive
            ]}>
              {item.status === 'active' ? 'Active' : 'Inactive'}
            </Text>
          </View>
          <Text style={styles.userRole}>
            {item.role === 'admin' ? 'Admin' : 'User'}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.moreButton}>
        <MoreVertical size={20} color="#6B7280" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Users</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{MOCK_USERS.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {MOCK_USERS.filter(user => user.status === 'active').length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {MOCK_USERS.filter(user => user.status === 'inactive').length}
          </Text>
          <Text style={styles.statLabel}>Inactive</Text>
        </View>
      </View>
      
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.usersList}
      />
      
      {selectedUserDetails && (
        <View style={styles.userDetailsOverlay}>
          <View style={styles.userDetailsCard}>
            <View style={styles.userDetailsHeader}>
              <Text style={styles.userDetailsTitle}>User Details</Text>
              <TouchableOpacity onPress={hideUserDetails}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.userProfile}>
              <Image 
                source={{ uri: selectedUserDetails.avatar }} 
                style={styles.detailsAvatar} 
              />
              <Text style={styles.detailsName}>{selectedUserDetails.name}</Text>
              <View style={[
                styles.statusBadge, 
                selectedUserDetails.status === 'active' ? styles.statusActive : styles.statusInactive,
                styles.detailsStatusBadge
              ]}>
                <Text style={[
                  styles.statusText,
                  selectedUserDetails.status === 'active' ? styles.statusTextActive : styles.statusTextInactive
                ]}>
                  {selectedUserDetails.status === 'active' ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailsSection}>
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Mail size={16} color="#3B82F6" />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{selectedUserDetails.email}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Phone size={16} color="#3B82F6" />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Phone</Text>
                  <Text style={styles.detailValue}>{selectedUserDetails.phone}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <User size={16} color="#3B82F6" />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Role</Text>
                  <Text style={styles.detailValue}>
                    {selectedUserDetails.role === 'admin' ? 'Administrator' : 'Regular User'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.detailsFooter}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Edit User</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
              >
                <Text style={styles.deleteButtonText}>
                  {selectedUserDetails.status === 'active' ? 'Deactivate' : 'Activate'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  filterButton: {
    padding: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  usersList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  statusActive: {
    backgroundColor: '#D1FAE5',
  },
  statusInactive: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  statusTextActive: {
    color: '#059669',
  },
  statusTextInactive: {
    color: '#EF4444',
  },
  userRole: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  moreButton: {
    padding: 8,
  },
  userDetailsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  userDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '85%',
    maxHeight: '80%',
    padding: 16,
  },
  userDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userDetailsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  closeButton: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  userProfile: {
    alignItems: 'center',
    marginBottom: 16,
  },
  detailsAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  detailsName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  detailsStatusBadge: {
    marginRight: 0,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  detailsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});