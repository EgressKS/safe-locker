import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Modal, FlatList, SafeAreaView } from 'react-native';
import { ChevronLeft, Search, FolderPlus, Upload, Download, Trash2, Grid2x2 as Grid, List, X, Plus, Play } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView, LongPressGestureHandler, State } from 'react-native-gesture-handler';
import { FolderIcon, Video as VideoIcon } from 'lucide-react-native';
import CreateFolder from '@/components/CreateFolder';
import FileUploadForm from '@/components/FileUploadForm';

interface Album {
  id: string;
  name: string;
  count: number;
  coverImage: string;
}

interface Video {
  id: string;
  url: string;
  name: string;
  date: string;
  size: string;
  thumbnailUrl: string;
  duration: string;
}

const mockAlbums: Album[] = [
  {
    id: '1',
    name: 'Family',
    count: 24,
    coverImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '2',
    name: 'Vacation',
    count: 56,
    coverImage: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: '3',
    name: 'Work',
    count: 12,
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
  }
];

const mockVideos: { [key: string]: Video[] } = {
  'Family': [
    {
      id: '1',
      name: 'Family Dinner',
      url: 'https://example.com/videos/family-dinner.mp4',
      thumbnailUrl: 'https://images.unsplash.com/Video-1511895426328-dc8714191300',
      date: '2024-02-15',
      size: '24.4 MB',
      duration: '2:30'
    },
    {
      id: '2',
      name: 'Birthday Party',
      url: 'https://example.com/videos/birthday-party.mp4',
      thumbnailUrl: 'https://images.unsplash.com/Video-1464349095431-e9a21285b5f3',
      date: '2024-02-10',
      size: '31.1 MB',
      duration: '3:45'
    }
  ],
};

const EmptyAlbumList = () => (
  <View style={styles.emptyStateContainer}>
    <FolderIcon size={64} color="#D1D5DB" />
    <Text style={styles.emptyStateTitle}>No Video Albums Found</Text>
    <Text style={styles.emptyStateText}>Create your first album to organize your videos</Text>
  </View>
);

const EmptyVideoList = () => (
  <View style={styles.emptyStateContainer}>
    <VideoIcon size={64} color="#D1D5DB" />
    <Text style={styles.emptyStateTitle}>No Videos Found</Text>
    <Text style={styles.emptyStateText}>Add some videos to this album</Text>
  </View>
);

export default function VideoAlbumScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'horizontal'>('grid');
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [newAlbumModalVisible, setNewAlbumModalVisible] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');

  const filteredAlbums = mockAlbums.filter(album =>
    album.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentVideos = selectedAlbum ? mockVideos[selectedAlbum] || [] : [];

  const handleAlbumSelect = (albumName: string) => {
    setSelectedAlbum(albumName);
    setIsMultiSelectMode(false);
    setSelectedVideos([]);
  };

  const handleVideoPress = (Video: Video) => {
    if (isMultiSelectMode) {
      toggleVideoSelection(Video.id);
    } else {
      setSelectedVideo(Video);
    }
  };

  const handleVideoLongPress = (Video: Video) => {
    if (!isMultiSelectMode) {
      setIsMultiSelectMode(true);
      setSelectedVideos([Video.id]);
    }
  };

  const toggleVideoSelection = (VideoId: string) => {
    if (selectedVideos.includes(VideoId)) {
      setSelectedVideos(selectedVideos.filter(id => id !== VideoId));
      if (selectedVideos.length === 1) {
        setIsMultiSelectMode(false);
      }
    } else {
      setSelectedVideos([...selectedVideos, VideoId]);
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

  const handleUploadVideo = () => {
    if (uploadFileName.trim()) {
      // In a real app, this would upload a Video
      console.log(`Uploading Video: ${uploadFileName}`);
      setUploadFileName('');
      setUploadModalVisible(false);
    }
  };

  const handleDownloadSelected = () => {
    // In a real app, this would download selected Videos
    console.log(`Downloading ${selectedVideos.length} Videos`);
    setIsMultiSelectMode(false);
    setSelectedVideos([]);
  };

  const handleDeleteSelected = () => {
    // In a real app, this would delete selected Videos
    console.log(`Deleting ${selectedVideos.length} Videos`);
    setIsMultiSelectMode(false);
    setSelectedVideos([]);
  };

  const handleDownloadVideo = (video: Video) => {
    // In a real app, this would download the video
    console.log(`Downloading video: ${video.name}`);
  };

  const renderAlbumItem = ({ item }: { item: Album }) => (
    <TouchableOpacity
      style={styles.albumItem}
      onPress={() => handleAlbumSelect(item.name)}
    >
      <Image source={{ uri: item.coverImage }} style={styles.albumCover} />
      <View style={styles.albumInfo}>
        <Text style={styles.albumName}>{item.name}</Text>
        <Text style={styles.albumCount}>{item.count} Videos</Text>
      </View>
    </TouchableOpacity>
  );

  const renderVideoItem = ({ item }: { item: Video }) => {
    const isSelected = selectedVideos.includes(item.id);

    function handleDeleteVideo(video: Video): void {
      // In a real app, this would delete the video
      console.log(`Deleting video: ${video.name}`);
      // Remove the video from the mockVideos object
      if (selectedAlbum) {
      mockVideos[selectedAlbum] = mockVideos[selectedAlbum].filter(v => v.id !== video.id);
      setSelectedVideos(selectedVideos.filter(id => id !== video.id));
      }
    }

    return (
      <LongPressGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            handleVideoLongPress(item);
          }
        }}
        minDurationMs={600}
      >
        <TouchableOpacity
          style={[
            viewMode === 'grid' ? styles.videoItem : styles.videoItemHorizontal,
            isSelected && styles.selectedVideoItem
          ]}
          onPress={() => handleVideoPress(item)}
          activeOpacity={0.7}
        >
          {viewMode === 'grid' ? (
            <>
              <View style={styles.videoThumbnailContainer}>
                <Image source={{ uri: item.thumbnailUrl }} style={styles.videoThumbnail} />
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{item.duration}</Text>
                </View>
                <View style={styles.playButton}>
                  <Play size={24} color="#FFFFFF" />
                </View>
              </View>
              <Text style={styles.videoName}>{item.name}</Text>

              {!isMultiSelectMode && (
                <View style={styles.videoActions}>
                    <TouchableOpacity
                    style={styles.videoActionButton}
                    onPress={() => handleDownloadVideo(item)}
                    >
                    <Download size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.videoActionButton, styles.deleteButton]}
                    onPress={() => handleDeleteVideo(item)}
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
              <View style={styles.videoThumbnailContainerHorizontal}>
                <Image source={{ uri: item.thumbnailUrl }} style={styles.videoThumbnailHorizontal} />
                <View style={styles.durationBadgeHorizontal}>
                  <Text style={styles.durationText}>{item.duration}</Text>
                </View>
                <View style={styles.playButtonHorizontal}>
                  <Play size={20} color="#FFFFFF" />
                </View>
              </View>
              <View style={styles.videoInfoHorizontal}>
                <Text style={styles.videoNameHorizontal}>{item.name}</Text>
                <Text style={styles.videoMetaHorizontal}>
                  {item.size} • {item.duration} • {item.date}
                </Text>
              </View>
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
                  setSelectedVideos([]);
                }}
                style={styles.backButton}
              >
                <X size={24} color="#4F46E5" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {selectedVideos.length} selected
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
                {selectedAlbum || 'Video Albums'}
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
            placeholder={selectedAlbum ? "Search Videos..." : "Search albums..."}
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
            
            {currentVideos.length > 0 ? (
              <FlatList
                data={currentVideos}
                renderItem={renderVideoItem}
                keyExtractor={(item) => item.id}
                numColumns={viewMode === 'grid' ? 2 : 1}
                key={viewMode}
                contentContainerStyle={styles.VideoGrid}
                columnWrapperStyle={viewMode === 'grid' ? styles.VideoRow : undefined}
              />
            ) : (
              <EmptyVideoList />
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

        {/* Video Preview Modal */}
        {selectedVideo && (
          <Modal
            visible={!!selectedVideo}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setSelectedVideo(null)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.previewContainer}>
                <Image
                  source={{ uri: selectedVideo.url }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
                <View style={styles.previewInfo}>
                  <Text style={styles.previewName}>{selectedVideo.name}</Text>
                  <Text style={styles.previewMeta}>
                    {selectedVideo.size} • {selectedVideo.date}
                  </Text>
                </View>
                <View style={styles.previewActions}>
                  <TouchableOpacity
                    style={styles.previewActionButton}
                    onPress={() => {
                      // Download Video
                      setSelectedVideo(null);
                    }}
                  >
                    <Download size={20} color="#FFFFFF" />
                    <Text style={styles.previewActionText}>Download</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.previewActionButton, styles.deletePreviewButton]}
                    onPress={() => {
                      // Delete Video
                      setSelectedVideo(null);
                    }}
                  >
                    <Trash2 size={20} color="#FFFFFF" />
                    <Text style={styles.previewActionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.closePreviewButton}
                  onPress={() => setSelectedVideo(null)}
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

        {/* Upload Video Modal */}
        <FileUploadForm 
        fileType='Video'
        onClose={() => setUploadModalVisible(false)}
        onSubmit={handleUploadVideo}
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
  VideoGrid: {
    paddingBottom: 16,
  },
  VideoRow: {
    justifyContent: 'space-between',
  },
  videoItem: {
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
  selectedVideoItem: {
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  videoThumbnailContainer: {
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    aspectRatio: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 24,
    padding: 4,
  },
  videoName: {
    fontSize: 14,
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  videoActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  videoActionButton: {
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
  videoItemHorizontal: {
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
  videoThumbnailContainerHorizontal: {
    position: 'relative',
  },
  videoThumbnailHorizontal: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  durationBadgeHorizontal: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  playButtonHorizontal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 4,
  },
  videoInfoHorizontal: {
    flex: 1,
    marginLeft: 12,
  },
  videoNameHorizontal: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  videoMetaHorizontal: {
    fontSize: 14,
    color: '#6B7280',
  },
  VideoActionsHorizontal: {
    flexDirection: 'row',
  },
  VideoActionButtonHorizontal: {
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
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});