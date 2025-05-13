import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bell, Search, TrendingUp, TrendingDown, Users, FileText, ChevronRight, MessageSquare } from 'lucide-react-native';

export default function AdminDashboardScreen() {
  const [adminName, setAdminName] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    users: 124,
    tasks: 247,
    messages: 89,
    reports: 12
  });

  // Sample chart data (simplified)
  const userGrowthData = [20, 25, 30, 35, 45, 60, 80];
  const taskCompletionData = [40, 35, 55, 60, 50, 65, 70];

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        setAdminName(name);
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    };

    loadAdminData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Simplified mini chart renderer
  const renderMiniChart = (data: number[], color: string) => (
    <View style={styles.miniChart}>
      {data.map((value, index) => (
        <View 
          key={index}
          style={[
            styles.miniChartBar,
            { 
              height: value,
              backgroundColor: color,
              marginLeft: index > 0 ? 3 : 0
            }
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.adminName}>{adminName || 'Admin'}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={24} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconContainer, styles.usersIconBg]}>
                <Users size={20} color="#3B82F6" />
              </View>
              <TrendingUp size={20} color="#10B981" />
            </View>
            <Text style={styles.statTitle}>Total Users</Text>
            <Text style={styles.statValue}>{stats.users}</Text>
            <Text style={styles.statChange}>+5.2% <Text style={styles.statPeriod}>from last week</Text></Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconContainer, styles.tasksIconBg]}>
                <FileText size={20} color="#8B5CF6" />
              </View>
              <TrendingUp size={20} color="#10B981" />
            </View>
            <Text style={styles.statTitle}>Total Tasks</Text>
            <Text style={styles.statValue}>{stats.tasks}</Text>
            <Text style={styles.statChange}>+12.0% <Text style={styles.statPeriod}>from last week</Text></Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconContainer, styles.messagesIconBg]}>
                <MessageSquare size={20} color="#EC4899" />
              </View>
              <TrendingDown size={20} color="#EF4444" />
            </View>
            <Text style={styles.statTitle}>Messages</Text>
            <Text style={styles.statValue}>{stats.messages}</Text>
            <Text style={styles.statChange}>-2.3% <Text style={styles.statPeriod}>from last week</Text></Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconContainer, styles.reportsIconBg]}>
                <FileText size={20} color="#F59E0B" />
              </View>
              <TrendingUp size={20} color="#10B981" />
            </View>
            <Text style={styles.statTitle}>Reports</Text>
            <Text style={styles.statValue}>{stats.reports}</Text>
            <Text style={styles.statChange}>+1.0% <Text style={styles.statPeriod}>from last week</Text></Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>User Growth</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See Details</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.chartTitle}>New Users</Text>
                <Text style={styles.chartValue}>+24 <Text style={styles.chartPeriod}>this week</Text></Text>
              </View>
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#3B82F6' }]} />
                  <Text style={styles.legendText}>This Week</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#93C5FD' }]} />
                  <Text style={styles.legendText}>Last Week</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.chartContainer}>
              {renderMiniChart(userGrowthData, '#3B82F6')}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Task Completion</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See Details</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.chartTitle}>Completed Tasks</Text>
                <Text style={styles.chartValue}>70% <Text style={styles.chartPeriod}>completion rate</Text></Text>
              </View>
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#8B5CF6' }]} />
                  <Text style={styles.legendText}>Completed</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#C4B5FD' }]} />
                  <Text style={styles.legendText}>Pending</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.chartContainer}>
              {renderMiniChart(taskCompletionData, '#8B5CF6')}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {[1, 2, 3].map((item) => (
            <TouchableOpacity key={item} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityTitle}>
                  {item === 1 ? 'New User Registered' : 
                   item === 2 ? 'Task Status Updated' : 'System Update'}
                </Text>
                <Text style={styles.activityTime}>
                  {item === 1 ? '2 hours ago' : 
                   item === 2 ? 'Yesterday' : '2 days ago'}
                </Text>
              </View>
              <Text style={styles.activityDescription}>
                {item === 1 ? 'A new user has registered with email user@example.com' : 
                 item === 2 ? 'Admin updated the status of Project Alpha to Completed' : 
                 'System successfully updated to version 1.2.5'}
              </Text>
              <View style={styles.activityFooter}>
                <Text style={styles.activityLink}>View Details</Text>
                <ChevronRight size={16} color="#3B82F6" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  welcomeText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  adminName: {
    fontSize: 20,
    color: '#111827',
    fontFamily: 'Inter-Bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  usersIconBg: {
    backgroundColor: '#EBF5FF',
  },
  tasksIconBg: {
    backgroundColor: '#F3E8FF',
  },
  messagesIconBg: {
    backgroundColor: '#FCE7F3',
  },
  reportsIconBg: {
    backgroundColor: '#FEF3C7',
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    color: '#111827',
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    color: '#10B981',
    fontFamily: 'Inter-Medium',
  },
  statPeriod: {
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginTop: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 4,
  },
  chartValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  chartPeriod: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  chartLegend: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  chartContainer: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    flex: 1,
    justifyContent: 'space-between',
  },
  miniChartBar: {
    width: 8,
    borderRadius: 4,
    flex: 1,
    maxWidth: 20,
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
    marginBottom: 12,
  },
  activityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityLink: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginRight: 4,
  },
});