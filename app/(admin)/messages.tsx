import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { Search, ChevronRight } from 'lucide-react-native';

// Mock data for demonstration
const MOCK_MESSAGES = [
  {
    id: '1',
    user: {
      id: '101',
      name: 'John Doe',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    subject: 'Account Verification',
    preview: 'I\'m having trouble verifying my account. Could you help me with the process?',
    date: '2025-04-15T10:30:00',
    unread: true,
    category: 'support',
  },
  {
    id: '2',
    user: {
      id: '102',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    subject: 'Payment Issue',
    preview: 'My last payment was declined but the amount was still deducted from my account.',
    date: '2025-04-14T15:45:00',
    unread: false,
    category: 'billing',
  },
  {
    id: '3',
    user: {
      id: '103',
      name: 'Michael Smith',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    subject: 'Feature Request',
    preview: 'I think it would be great if you could add a dark mode option to the app.',
    date: '2025-04-14T09:15:00',
    unread: true,
    category: 'feature',
  },
  {
    id: '4',
    user: {
      id: '104',
      name: 'Emily Brown',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    subject: 'Bug Report',
    preview: 'The task assignment feature is not working properly on my device.',
    date: '2025-04-13T14:20:00',
    unread: false,
    category: 'bug',
  },
  {
    id: '5',
    user: {
      id: '105',
      name: 'Robert Wilson',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    subject: 'Account Deletion Request',
    preview: 'I would like to delete my account. Can you please guide me through the process?',
    date: '2025-04-12T11:30:00',
    unread: false,
    category: 'account',
  },
];

// Helper function to format date
const formatDate = (dateString: string) => {
  const messageDate = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    // Today - show time
    return messageDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    // Within last week
    return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    // Older than a week
    return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

// Helper function to get category badge style
const getCategoryBadgeStyle = (category: string) => {
  switch (category) {
    case 'support':
      return { backgroundColor: '#EBF5FF', textColor: '#3B82F6' };
    case 'billing':
      return { backgroundColor: '#FEF3C7', textColor: '#D97706' };
    case 'feature':
      return { backgroundColor: '#DCFCE7', textColor: '#059669' };
    case 'bug':
      return { backgroundColor: '#FEE2E2', textColor: '#EF4444' };
    case 'account':
      return { backgroundColor: '#F3E8FF', textColor: '#8B5CF6' };
    default:
      return { backgroundColor: '#F3F4F6', textColor: '#6B7280' };
  }
};

export default function AdminMessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'support', label: 'Support' },
    { id: 'bug', label: 'Bug' },
    { id: 'feature', label: 'Feature' },
  ];

  const filteredMessages = MOCK_MESSAGES.filter(message => {
    // Apply search filter
    const matchesSearch = searchQuery === '' || 
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply category filter
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'unread' && message.unread) ||
      message.category === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const renderMessageItem = ({ item }: { item: typeof MOCK_MESSAGES[0] }) => {
    const categoryStyle = getCategoryBadgeStyle(item.category);
    
    return (
      <TouchableOpacity style={[
        styles.messageCard,
        item.unread && styles.unreadMessage
      ]}>
        <View style={styles.messageHeader}>
          <View style={styles.userInfo}>
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.userName}>{item.user.name}</Text>
              <Text style={styles.messageDate}>{formatDate(item.date)}</Text>
            </View>
          </View>
          
          <View style={[
            styles.categoryBadge,
            { backgroundColor: categoryStyle.backgroundColor }
          ]}>
            <Text style={[
              styles.categoryText,
              { color: categoryStyle.textColor }
            ]}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
          </View>
        </View>
        
        <View style={styles.messageContent}>
          <Text style={[
            styles.messageSubject,
            item.unread && styles.unreadText
          ]}>
            {item.subject}
            {item.unread && <View style={styles.unreadDot} />}
          </Text>
          <Text style={styles.messagePreview} numberOfLines={2}>
            {item.preview}
          </Text>
        </View>
        
        <View style={styles.messageFooter}>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Message</Text>
            <ChevronRight size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                selectedFilter === filter.id && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter.id && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{MOCK_MESSAGES.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {MOCK_MESSAGES.filter(m => m.unread).length}
          </Text>
          <Text style={styles.statLabel}>Unread</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {MOCK_MESSAGES.filter(m => !m.unread).length}
          </Text>
          <Text style={styles.statLabel}>Read</Text>
        </View>
      </View>
      
      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messagesList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No messages found</Text>
          </View>
        }
      />
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
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
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
  filtersContainer: {
    paddingHorizontal: 16,
  },
  filtersScroll: {
    paddingVertical: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#EBF5FF',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#3B82F6',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 8,
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
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  messageCard: {
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
  unreadMessage: {
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  messageDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  messageContent: {
    marginBottom: 12,
  },
  messageSubject: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  unreadText: {
    fontFamily: 'Inter-Bold',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginLeft: 8,
  },
  messagePreview: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginRight: 4,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
});