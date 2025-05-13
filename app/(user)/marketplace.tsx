import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, TextInput, RefreshControl, Modal, Platform } from 'react-native';
import { Search, Filter, Heart, MessageCircle, Share2, X, Camera, Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const CATEGORIES = [
  'All',
  'Vegetables',
  'Fruits',
  'Seedlings',
  'Seeds',
  'Tools',
  'Fertilizers',
];

const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Fresh Organic Tomatoes',
    price: 2.99,
    unit: 'per kg',
    description: 'Locally grown organic tomatoes, perfect for salads and cooking',
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=1280',
    seller: {
      name: 'Green Valley Farm',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4.8,
    },
    category: 'Vegetables',
    location: 'Local Farm',
    likes: 24,
    comments: 8,
    stock: 50,
  },
  {
    id: '2',
    title: 'Red Onion Seedlings',
    price: 1.99,
    unit: 'per plant',
    description: 'Healthy red onion seedlings ready for transplanting',
    image: 'https://images.pexels.com/photos/4750270/pexels-photo-4750270.jpeg?auto=compress&cs=tinysrgb&w=1280',
    seller: {
      name: 'AgriTech Nursery',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4.9,
    },
    category: 'Seedlings',
    location: 'Greenhouse',
    likes: 45,
    comments: 12,
    stock: 100,
  },
  {
    id: '3',
    title: 'Fresh Garlic Bulbs',
    price: 3.99,
    unit: 'per kg',
    description: 'Premium quality garlic bulbs, locally grown',
    image: 'https://images.pexels.com/photos/4197447/pexels-photo-4197447.jpeg?auto=compress&cs=tinysrgb&w=1280',
    seller: {
      name: 'Organic Roots',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4.7,
    },
    category: 'Vegetables',
    location: 'Local Farm',
    likes: 67,
    comments: 15,
    stock: 30,
  },
  {
    id: '4',
    title: 'Chili Pepper Plants',
    price: 4.99,
    unit: 'per plant',
    description: 'Hot chili pepper plants, various varieties available',
    image: 'https://images.pexels.com/photos/4750200/pexels-photo-4750200.jpeg?auto=compress&cs=tinysrgb&w=1280',
    seller: {
      name: 'Spice Garden',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4.6,
    },
    category: 'Seedlings',
    location: 'Greenhouse',
    likes: 38,
    comments: 9,
    stock: 25,
  },
  {
    id: '5',
    title: 'Organic Fertilizer',
    price: 15.99,
    unit: 'per 5kg bag',
    description: 'Natural organic fertilizer, perfect for vegetables',
    image: 'https://images.pexels.com/photos/9976896/pexels-photo-9976896.jpeg?auto=compress&cs=tinysrgb&w=1280',
    seller: {
      name: 'EcoGrow Solutions',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4.9,
    },
    category: 'Fertilizers',
    location: 'Warehouse',
    likes: 52,
    comments: 18,
    stock: 200,
  },
];

export default function MarketplaceScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [isNewPostModalVisible, setNewPostModalVisible] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    price: '',
    quantity: '',
    unit: '',
    description: '',
    category: '',
    images: [] as string[],
  });

  const handleAddImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setNewPost(prev => ({
          ...prev,
          images: [...prev.images, result.assets[0].uri],
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleCreatePost = () => {
    console.log('Creating new post:', newPost);
    setNewPost({
      title: '',
      price: '',
      quantity: '',
      unit: '',
      description: '',
      category: '',
      images: [],
    });
    setNewPostModalVisible(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const toggleLike = (productId: string) => {
    setLikedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderProductCard = (product: typeof MOCK_PRODUCTS[0]) => (
    <View key={product.id} style={styles.productCard}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      
      <View style={styles.productContent}>
        <View style={styles.productHeader}>
          <Text style={styles.productTitle}>{product.title}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>${product.price}</Text>
            <Text style={styles.unitText}>{product.unit}</Text>
          </View>
        </View>
        
        <Text style={styles.productDescription} numberOfLines={2}>
          {product.description}
        </Text>

        <View style={styles.stockInfo}>
          <Text style={styles.stockText}>In stock: {product.stock} units</Text>
        </View>
        
        <View style={styles.sellerInfo}>
          <Image source={{ uri: product.seller.avatar }} style={styles.sellerAvatar} />
          <View style={styles.sellerDetails}>
            <Text style={styles.sellerName}>{product.seller.name}</Text>
            <Text style={styles.location}>{product.location}</Text>
          </View>
          <View style={styles.rating}>
            <Text style={styles.ratingText}>★ {product.seller.rating}</Text>
          </View>
        </View>
        
        <View style={styles.productFooter}>
          <View style={styles.interactions}>
            <TouchableOpacity 
              style={styles.interactionButton}
              onPress={() => toggleLike(product.id)}
            >
              <Heart 
                size={20} 
                color={likedProducts.includes(product.id) ? '#EF4444' : '#6B7280'}
                fill={likedProducts.includes(product.id) ? '#EF4444' : 'none'}
              />
              <Text style={styles.interactionText}>
                {likedProducts.includes(product.id) ? product.likes + 1 : product.likes}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.interactionButton}>
              <MessageCircle size={20} color="#6B7280" />
              <Text style={styles.interactionText}>{product.comments}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.interactionButton}>
              <Share2 size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AgriPots Market</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setNewPostModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ New Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={24} color="#1B5E20" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category && styles.categoryButtonTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredProducts.map(renderProductCard)}
      </ScrollView>

      <Modal
        visible={isNewPostModalVisible}
        animationType="slide"
        onRequestClose={() => setNewPostModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Listing</Text>
            <TouchableOpacity 
              onPress={() => setNewPostModalVisible(false)}
              style={styles.closeButton}
            >
              <X size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.imageSection}>
              <Text style={styles.sectionTitle}>Product Images</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imageList}
              >
                {newPost.images.map((uri, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri }} style={styles.uploadedImage} />
                    <TouchableOpacity 
                      style={styles.removeImageButton}
                      onPress={() => {
                        setNewPost(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index),
                        }));
                      }}
                    >
                      <X size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity 
                  style={styles.addImageButton}
                  onPress={handleAddImage}
                >
                  <Upload size={24} color="#6B7280" />
                  <Text style={styles.addImageText}>Add Image</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Product Details</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Title</Text>
                <TextInput
                  style={styles.input}
                  value={newPost.title}
                  onChangeText={(text) => setNewPost(prev => ({ ...prev, title: text }))}
                  placeholder="Enter product title"
                />
              </View>

              <View style={styles.priceRow}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Price</Text>
                  <TextInput
                    style={styles.input}
                    value={newPost.price}
                    onChangeText={(text) => setNewPost(prev => ({ ...prev, price: text }))}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                  />
                </View>

                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.inputLabel}>Quantity</Text>
                  <TextInput
                    style={styles.input}
                    value={newPost.quantity}
                    onChangeText={(text) => setNewPost(prev => ({ ...prev, quantity: text }))}
                    placeholder="0"
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Unit</Text>
                <TextInput
                  style={styles.input}
                  value={newPost.unit}
                  onChangeText={(text) => setNewPost(prev => ({ ...prev, unit: text }))}
                  placeholder="e.g., kg, pieces, bundles"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Category</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryList}
                >
                  {CATEGORIES.filter(cat => cat !== 'All').map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        newPost.category === category && styles.categoryChipSelected
                      ]}
                      onPress={() => setNewPost(prev => ({ ...prev, category }))}
                    >
                      <Text style={[
                        styles.categoryChipText,
                        newPost.category === category && styles.categoryChipTextSelected
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newPost.description}
                  onChangeText={(text) => setNewPost(prev => ({ ...prev, description: text }))}
                  placeholder="Describe your product..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setNewPostModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={handleCreatePost}
            >
              <Text style={styles.createButtonText}>Create Listing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1B5E20',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#1B5E20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 48,
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
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
  },
  categoriesContent: {
    paddingHorizontal: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 4,
  },
  categoryButtonActive: {
    backgroundColor: '#DCF5E1',
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: '#1B5E20',
  },
  productsContainer: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  productContent: {
    padding: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1B5E20',
  },
  unitText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  productDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  stockInfo: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  stockText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1B5E20',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sellerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  location: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  rating: {
    backgroundColor: '#DCF5E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#1B5E20',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  interactions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  interactionText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  contactButton: {
    backgroundColor: '#1B5E20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        paddingTop: 60,
      },
      android: {
        paddingTop: 16,
      },
    }),
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  imageSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 12,
  },
  imageList: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  imageContainer: {
    marginRight: 12,
    position: 'relative',
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 4,
  },
  addImageButton: {
    width: 100,
    height: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  addImageText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 8,
  },
  formSection: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  priceRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryList: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: '#DCF5E1',
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoryChipTextSelected: {
    color: '#1B5E20',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  createButton: {
    flex: 1,
    backgroundColor: '#1B5E20',
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
});