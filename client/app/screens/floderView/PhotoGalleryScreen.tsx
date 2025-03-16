import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Modal, FlatList, SafeAreaView } from 'react-native';
import { ChevronLeft, Search, FolderPlus, Upload, Download, Trash2, Grid2x2 as Grid, List, X, Plus, FolderIcon, ImageIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView, LongPressGestureHandler, State } from 'react-native-gesture-handler';
import CreateFolder from '@/components/CreateFolder';
import FileUploadForm from '@/components/FileUploadForm';

interface Album {
  id: string;
  name: string;
  coverImage: string;
  count: number;
}

interface Photo {
  id: string;
  url: string;
  name: string;
  date: string;
  size: string;
}

const mockAlbums: Album[] = [
  {
    id: '1',
    name: 'Family',
    coverImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    count: 24
  },
  {
    id: '2',
    name: 'Vacation',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    count: 56
  },
  {
    id: '3',
    name: 'Work',
    coverImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    count: 12
  },
  {
    id: '4',
    name: 'Workssss',
    coverImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    count: 12
  }
];

const mockPhotos: { [key: string]: Photo[] } = {
  'Family': [
    {
      id: '1',
      name: 'Family Dinner',
      url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      date: '2024-02-15',
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'Birthday Party',
      url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      date: '2024-02-10',
      size: '3.1 MB'
    }
  ],
  'Vacation': [
    {
      id: '3',
      name: 'Beach Sunset',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      date: '2024-01-20',
      size: '4.2 MB'
    },
    {
      id: '4',
      name: 'Mountain View',
      url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      date: '2024-01-18',
      size: '3.8 MB'
    }
  ],
  'Work': [
    {
      id: '5',
      name: 'Office Meeting',
      url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      date: '2024-02-01',
      size: '2.1 MB'
    },
    {
      id: '6',
      name: 'Team Building',
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      date: '2024-01-25',
      size: '3.5 MB'
    }
  ]
};

const EmptyAlbumList = () => (
  <View style={styles.emptyStateContainer}>
    <FolderIcon size={64} color="#D1D5DB" />
    <Text style={styles.emptyStateTitle}>No Albums Found</Text>
    <Text style={styles.emptyStateText}>Create your first album to organize your photos</Text>
  </View>
);

const EmptyPhotoList = () => (
  <View style={styles.emptyStateContainer}>
    <ImageIcon size={64} color="#D1D5DB" />
    <Text style={styles.emptyStateTitle}>No Photos Found</Text>
    <Text style={styles.emptyStateText}>Add some photos to this album</Text>
  </View>
);

export default function PhotoAlbumScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'horizontal'>('grid');
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [newAlbumModalVisible, setNewAlbumModalVisible] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');

  const filteredAlbums = mockAlbums.filter(album =>
    album.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentPhotos = selectedAlbum ? mockPhotos[selectedAlbum] || [] : [];

  const handleAlbumSelect = (albumName: string) => {
    setSelectedAlbum(albumName);
    setIsMultiSelectMode(false);
    setSelectedPhotos([]);
  };

  const handlePhotoPress = (photo: Photo) => {
    if (isMultiSelectMode) {
      togglePhotoSelection(photo.id);
    } else {
      setSelectedPhoto(photo);
    }
  };

  const handlePhotoLongPress = (photo: Photo) => {
    if (!isMultiSelectMode) {
      setIsMultiSelectMode(true);
      setSelectedPhotos([photo.id]);
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    if (selectedPhotos.includes(photoId)) {
      setSelectedPhotos(selectedPhotos.filter(id => id !== photoId));
      if (selectedPhotos.length === 1) {
        setIsMultiSelectMode(false);
      }
    } else {
      setSelectedPhotos([...selectedPhotos, photoId]);
    }
  };

  const handleCreateAlbum = () => {
    if (newAlbumName.trim()) {
      // In a real app, this would create a new album
      console.log(`Creating album: ${newAlbumName}`);
      setNewAlbumName('');
      setNewAlbumModalVisible(false);
    }
  };

  const handleUploadPhoto = () => {
    if (uploadFileName.trim()) {
      // In a real app, this would upload a photo
      console.log(`Uploading photo: ${uploadFileName}`);
      setUploadFileName('');
      setUploadModalVisible(false);
    }
  };

  const handleDownloadSelected = () => {
    // In a real app, this would download selected photos
    console.log(`Downloading ${selectedPhotos.length} photos`);
    setIsMultiSelectMode(false);
    setSelectedPhotos([]);
  };

  const handleDeleteSelected = () => {
    // In a real app, this would delete selected photos
    console.log(`Deleting ${selectedPhotos.length} photos`);
    setIsMultiSelectMode(false);
    setSelectedPhotos([]);
  };

  const renderAlbumItem = ({ item }: { item: Album }) => (
    <TouchableOpacity
      style={styles.albumItem}
      onPress={() => handleAlbumSelect(item.name)}
    >
      <Image source={{ uri: item.coverImage }} style={styles.albumCover} />
      <View style={styles.albumInfo}>
        <Text style={styles.albumName}>{item.name}</Text>
        <Text style={styles.albumCount}>{item.count} photos</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPhotoItem = ({ item }: { item: Photo }) => {
    const isSelected = selectedPhotos.includes(item.id);

    return (
      <LongPressGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            handlePhotoLongPress(item);
          }
        }}
        minDurationMs={600}
      >
        <TouchableOpacity
          style={[
            viewMode === 'grid' ? styles.photoItem : styles.photoItemHorizontal,
            isSelected && styles.selectedPhotoItem
          ]}
          onPress={() => handlePhotoPress(item)}
          activeOpacity={0.7}
        >
          {viewMode === 'grid' ? (
            <>
              <Image source={{ uri: item.url }} style={styles.photoThumbnail} />
              <Text style={styles.photoName}>{item.name}</Text>

              {!isMultiSelectMode && (
                <View style={styles.photoActions}>
                  <TouchableOpacity
                    style={styles.photoActionButton}
                    onPress={() => { }}
                  >
                    <Download size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.photoActionButton, styles.deleteButton]}
                    onPress={() => { }}
                  >
                    <Trash2 size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}

              {isMultiSelectMode && (
                <View style={[styles.selectionIndicator, isSelected && styles.selectedIndicator]}>
                  {isSelected && <X size={16} color="#FFFFFF" />}
                </View>
              )}
            </>
          ) : (
            <>
              <Image source={{ uri: item.url }} style={styles.photoThumbnailHorizontal} />
              <View style={styles.photoInfoHorizontal}>
                <Text style={styles.photoNameHorizontal}>{item.name}</Text>
                <Text style={styles.photoMetaHorizontal}>{item.size} • {item.date}</Text>
              </View>

              {!isMultiSelectMode ? (
                <View style={styles.photoActionsHorizontal}>
                  <TouchableOpacity
                    style={styles.photoActionButtonHorizontal}
                    onPress={() => { }}
                  >
                    <Download size={20} color="#4F46E5" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.photoActionButtonHorizontal, styles.deleteButtonHorizontal]}
                    onPress={() => { }}
                  >
                    <Trash2 size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={[styles.selectionIndicator, isSelected && styles.selectedIndicator]}>
                  {isSelected && <X size={16} color="#FFFFFF" />}
                </View>
              )}
            </>
          )}
        </TouchableOpacity>
      </LongPressGestureHandler>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {isMultiSelectMode ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  setIsMultiSelectMode(false);
                  setSelectedPhotos([]);
                }}
                style={styles.backButton}
              >
                <X size={24} color="#4F46E5" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {selectedPhotos.length} selected
              </Text>
              <View style={styles.placeholder} />
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => {
                  if(selectedAlbum){
                    setSelectedAlbum(null);
                  }
                  else{
                    router.back();
                  }
                }}
                style={styles.backButton}
              >
                <ChevronLeft size={24} color="#4F46E5" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {selectedAlbum || 'Photo Albums'}
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  if (selectedAlbum) {
                    setUploadModalVisible(true);
                  } else {
                    setNewAlbumModalVisible(true);
                  }
                }}
              >
                {selectedAlbum ? (
                  <Upload size={24} color="#4F46E5" />
                ) : (
                  <FolderPlus size={24} color="#4F46E5" />
                )}
              </TouchableOpacity>
            </>
          )}
        </View>


        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={selectedAlbum ? "Search photos..." : "Search albums..."}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {isMultiSelectMode && (
          <View style={styles.multiSelectActions}>
            <TouchableOpacity
              style={[styles.multiSelectButton, styles.downloadButton]}
              onPress={handleDownloadSelected}
            >
              <Download size={20} color="#FFFFFF" />
              <Text style={styles.multiSelectButtonText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.multiSelectButton, styles.deleteMultiButton]}
              onPress={handleDeleteSelected}
            >
              <Trash2 size={20} color="#FFFFFF" />
              <Text style={styles.multiSelectButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedAlbum ? (
          <View style={styles.content}>
            <View style={styles.viewModeContainer}>
              <TouchableOpacity
                style={[
                  styles.viewModeButton,
                  viewMode === 'grid' && styles.activeViewModeButton
                ]}
                onPress={() => setViewMode('grid')}
              >
                <Grid size={16} color={viewMode === 'grid' ? '#4F46E5' : '#6B7280'} />
                <Text style={[
                  styles.viewModeText,
                  viewMode === 'grid' && styles.activeViewModeText
                ]}>Grid</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.viewModeButton,
                  viewMode === 'horizontal' && styles.activeViewModeButton
                ]}
                onPress={() => setViewMode('horizontal')}
              >
                <List size={16} color={viewMode === 'horizontal' ? '#4F46E5' : '#6B7280'} />
                <Text style={[
                  styles.viewModeText,
                  viewMode === 'horizontal' && styles.activeViewModeText
                ]}>List</Text>
              </TouchableOpacity>
            </View>
            {currentPhotos.length > 0 ? (
              <FlatList
                data={currentPhotos}
                renderItem={renderPhotoItem}
                keyExtractor={(item) => item.id}
                numColumns={viewMode === 'grid' ? 2 : 1}
                key={viewMode}
                contentContainerStyle={styles.photoGrid}
                columnWrapperStyle={viewMode === 'grid' ? styles.photoRow : undefined}
              />
            ) : (
              <EmptyPhotoList />
            )}
          </View>
        ) : (
          filteredAlbums.length > 0 ? (
            <FlatList
              data={filteredAlbums}
              renderItem={renderAlbumItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.albumGrid}
            />
          ) : (
            <EmptyAlbumList />
          )
        )}

        {/* Photo Preview Modal */}
        {selectedPhoto && (
          <Modal
            visible={!!selectedPhoto}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setSelectedPhoto(null)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.previewContainer}>
                <Image
                  source={{ uri: selectedPhoto.url }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
                <View style={styles.previewInfo}>
                  <Text style={styles.previewName}>{selectedPhoto.name}</Text>
                  <Text style={styles.previewMeta}>
                    {selectedPhoto.size} • {selectedPhoto.date}
                  </Text>
                </View>
                <View style={styles.previewActions}>
                  <TouchableOpacity
                    style={styles.previewActionButton}
                    onPress={() => {
                      // Download photo
                      setSelectedPhoto(null);
                    }}
                  >
                    <Download size={20} color="#FFFFFF" />
                    <Text style={styles.previewActionText}>Download</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.previewActionButton, styles.deletePreviewButton]}
                    onPress={() => {
                      // Delete photo
                      setSelectedPhoto(null);
                    }}
                  >
                    <Trash2 size={20} color="#FFFFFF" />
                    <Text style={styles.previewActionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.closePreviewButton}
                  onPress={() => setSelectedPhoto(null)}
                >
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {/* New Album Modal */}
        <CreateFolder
          visible={newAlbumModalVisible}
          onClose={() => setNewAlbumModalVisible(false)}
          onSubmit={handleCreateAlbum}
        />
        
        {/* Upload Photo Modal */}
        <FileUploadForm
        fileType='Photos'
        onClose={() => setUploadModalVisible(false)}
        onSubmit={handleUploadPhoto}
        visible={uploadModalVisible}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  addButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  albumGrid: {
    padding: 16,
  },
  albumItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  albumCover: {
    width: '100%',
    height: 200,
  },
  albumInfo: {
    padding: 16,
  },
  albumName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  albumCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  viewModeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 16,
    padding: 4,
  },
  viewModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  activeViewModeButton: {
    backgroundColor: '#FFFFFF',
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeViewModeText: {
    color: '#4F46E5',
  },
  photoGrid: {
    paddingBottom: 16,
  },
  photoRow: {
    justifyContent: 'space-between',
  },
  photoItem: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedPhotoItem: {
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  photoThumbnail: {
    width: '100%',
    aspectRatio: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  photoName: {
    fontSize: 14,
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  photoActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  photoActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  photoItemHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  photoThumbnailHorizontal: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  photoInfoHorizontal: {
    flex: 1,
    marginLeft: 12,
  },
  photoNameHorizontal: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  photoMetaHorizontal: {
    fontSize: 14,
    color: '#6B7280',
  },
  photoActionsHorizontal: {
    flexDirection: 'row',
  },
  photoActionButtonHorizontal: {
    padding: 8,
    marginLeft: 4,
  },
  deleteButtonHorizontal: {
    backgroundColor: '#FEF2F2',
    borderRadius: 20,
  },
  multiSelectActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  multiSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  downloadButton: {
    backgroundColor: '#4F46E5',
  },
  deleteMultiButton: {
    backgroundColor: '#EF4444',
  },
  multiSelectButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelMultiButton: {
    backgroundColor: '#6B7280',
  },
  selectionIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(209, 213, 219, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicator: {
    backgroundColor: '#4F46E5',
    borderColor: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 16,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  previewInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  previewName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  previewMeta: {
    fontSize: 14,
    color: '#6B7280',
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  previewActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
  },
  deletePreviewButton: {
    backgroundColor: '#EF4444',
  },
  previewActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  closePreviewButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});
