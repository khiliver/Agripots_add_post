import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bell, Search, Leaf, Sun, Droplet, Wind } from 'lucide-react-native';

const PLANT_TIPS = [
  {
    id: '1',
    title: 'Watering Guide',
    icon: <Droplet size={24} color="#3B82F6" />,
    description: 'Water your plants early morning or evening. Check soil moisture before watering.',
    details: [
      'Morning watering prevents evaporation',
      'Use room temperature water',
      'Avoid overwatering - check soil first',
      'Water at the base of plants'
    ]
  },
  {
    id: '2',
    title: 'Sunlight Tips',
    icon: <Sun size={24} color="#F59E0B" />,
    description: 'Most vegetables need 6-8 hours of direct sunlight daily.',
    details: [
      'Rotate plants regularly',
      'Use shade cloth in intense heat',
      'Consider seasonal sun changes',
      'Monitor leaf burn signs'
    ]
  },
  {
    id: '3',
    title: 'Plant Care',
    icon: <Leaf size={24} color="#10B981" />,
    description: 'Regular maintenance ensures healthy growth and better yields.',
    details: [
      'Remove dead leaves regularly',
      'Check for pest infestations',
      'Prune for better growth',
      'Apply organic fertilizers'
    ]
  },
  {
    id: '4',
    title: 'Ventilation',
    icon: <Wind size={24} color="#8B5CF6" />,
    description: 'Good air circulation prevents disease and promotes strong growth.',
    details: [
      'Space plants properly',
      'Use fans if needed',
      'Monitor humidity levels',
      'Ensure greenhouse ventilation'
    ]
  }
];

export default function HomeScreen() {
  const [userName, setUserName] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTip, setSelectedTip] = useState<string | null>(null);
  const [stats, setStats] = useState({
    plantsGrowing: 12,
    harvestReady: 5,
    totalYield: '25 kg'
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      setUserName(name);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUserData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome to AgriPots,</Text>
          <Text style={styles.userName}>{userName || 'Farmer'}</Text>
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
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.plantsGrowing}</Text>
            <Text style={styles.statLabel}>Growing</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.harvestReady}</Text>
            <Text style={styles.statLabel}>Ready to Harvest</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalYield}</Text>
            <Text style={styles.statLabel}>Total Yield</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Growing Tips</Text>
        </View>

        <View style={styles.tipsContainer}>
          {PLANT_TIPS.map((tip) => (
            <TouchableOpacity
              key={tip.id}
              style={[
                styles.tipCard,
                selectedTip === tip.id && styles.tipCardSelected
              ]}
              onPress={() => setSelectedTip(selectedTip === tip.id ? null : tip.id)}
            >
              <View style={styles.tipHeader}>
                <View style={styles.tipIconContainer}>
                  {tip.icon}
                </View>
                <Text style={styles.tipTitle}>{tip.title}</Text>
              </View>
              <Text style={styles.tipDescription}>{tip.description}</Text>
              
              {selectedTip === tip.id && (
                <View style={styles.tipDetails}>
                  {tip.details.map((detail, index) => (
                    <View key={index} style={styles.detailItem}>
                      <View style={styles.detailBullet} />
                      <Text style={styles.detailText}>{detail}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Seasonal Calendar</Text>
        </View>

        <View style={styles.calendarCard}>
          <Text style={styles.calendarTitle}>Best Crops for This Season</Text>
          <View style={styles.cropsList}>
            <View style={styles.cropItem}>
              <Text style={styles.cropName}>Tomatoes</Text>
              <Text style={styles.cropTiming}>Plant now - harvest in 60-80 days</Text>
            </View>
            <View style={styles.cropItem}>
              <Text style={styles.cropName}>Lettuce</Text>
              <Text style={styles.cropTiming}>Plant now - harvest in 30-60 days</Text>
            </View>
            <View style={styles.cropItem}>
              <Text style={styles.cropName}>Bell Peppers</Text>
              <Text style={styles.cropTiming}>Plant now - harvest in 60-90 days</Text>
            </View>
          </View>
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
  userName: {
    fontSize: 20,
    color: '#1B5E20',
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1B5E20',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  tipsContainer: {
    paddingHorizontal: 16,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tipCardSelected: {
    borderColor: '#1B5E20',
    borderWidth: 1,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  tipDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  tipDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1B5E20',
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  calendarTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 12,
  },
  cropsList: {
    gap: 8,
  },
  cropItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cropName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1B5E20',
  },
  cropTiming: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
});