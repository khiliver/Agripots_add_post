import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { Search, Plus } from 'lucide-react-native';

// Mock data for demonstration
const MOCK_CONVERSATIONS = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey, I just completed the task you assigned!',
    time: '10:30 AM',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    unread: 2,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    lastMessage: 'The meeting has been rescheduled to tomorrow',
    time: 'Yesterday',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    unread: 0,
  },
  {
    id: '3',
    name: 'Admin Support',
    lastMessage: 'Your account has been successfully upgraded',
    time: 'Yesterday',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    unread: 1,
  },
  {
    id: '4',
    name: 'Tech Team',
    lastMessage: 'We\'ve fixed the issue you reported earlier',
    time: 'Jul 10',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100',
    unread: 0,
  },
  {
    id: '5',
    name: 'Project Group',
    lastMessage: 'New project update: Phase 2 completed',
    time: 'Jul 9',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    unread: 0,
  },
];

export default function MessagingScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const renderConversationItem = ({ item }: { item: typeof MOCK_CONVERSATIONS[0] }) => (
    <TouchableOpacity style={styles.conversationItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.name}</Text>
          <Text style={styles.conversationTime}>{item.time}</Text>
        </View>
        
        <View style={styles.conversationFooter}>
          <Text style={styles.conversationMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.newButton}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <FlatList
        data={MOCK_CONVERSATIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderConversationItem}
        contentContainerStyle={styles.conversationsList}
      />
      
      {MOCK_CONVERSATIONS.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No conversations yet</Text>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start a new conversation</Text>
          </TouchableOpacity>
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
  newButton: {
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
  conversationsList: {
    paddingHorizontal: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
    marginRight: 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  conversationTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationMessage: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  unreadBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    paddingHorizontal: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});