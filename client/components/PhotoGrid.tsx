import React from 'react';
import { TouchableOpacity, FlatList, Image, View, Text, Dimensions, StyleSheet } from 'react-native';
import { Trash2, Download, Check } from 'lucide-react-native';
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';

interface Photo {
  id: string;
  url: string;
  name: string;
}

interface PhotoGridProps {
  photos: Photo[];
  selectedPhotos: string[];
  isMultiSelectMode: boolean;
  onPhotoPress: (photo: Photo) => void;
  onPhotoLongPress: (photo: Photo) => void;
  onTogglePhotoSelection: (photoId: string) => void;
  onDownloadPhoto: (photoId: string) => void;
  onDeletePhoto: (photoId: string) => void;
}

const windowWidth = Dimensions.get('window').width;

const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  selectedPhotos,
  isMultiSelectMode,
  onPhotoPress,
  onPhotoLongPress,
  onTogglePhotoSelection,
  onDownloadPhoto,
  onDeletePhoto
}) => {

  const renderPhotoItem = ({ item }: { item: Photo }) => {
    const isSelected = selectedPhotos.includes(item.id);
    return (
      <LongPressGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            onPhotoLongPress(item);
          }
        }}
        minDurationMs={600}
      >
        <TouchableOpacity
          style={[
            styles.photoItem,
            { width: (windowWidth - 48) / 3 },
            isSelected && styles.selectedPhotoItem
          ]}
          onPress={() => onPhotoPress(item)}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: `${item.url}?w=200&h=200&fit=crop&crop=entropy&auto=format` }}
            style={styles.photoThumbnail}
            resizeMode="cover"
          />

          {isMultiSelectMode && (
            <View style={[styles.selectionIndicator, isSelected && styles.selectedIndicator]}>
              {isSelected && <Check size={16} color="#FFFFFF" />}
            </View>
          )}

          {!isMultiSelectMode && (
            <View style={styles.photoActions}>
              <TouchableOpacity
                style={styles.photoActionButton}
                onPress={() => onDownloadPhoto(item.id)}
              >
                <Download size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.photoActionButton, styles.deleteButton]}
                onPress={() => onDeletePhoto(item.id)}
              >
                <Trash2 size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.photoName} numberOfLines={1}>{item.name}</Text>
        </TouchableOpacity>
      </LongPressGestureHandler>
    );
  };

  return (
    <FlatList
      data={photos}
      renderItem={renderPhotoItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={styles.photoGrid}
      columnWrapperStyle={styles.photoRow}
    />
  );
};

const styles = StyleSheet.create({
  photoGrid: {
    paddingBottom: 16,
  },
  photoRow: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  photoItem: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedPhotoItem: {
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  photoThumbnail: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  photoName: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
    textAlign: 'center',
  },
  photoActions: {
    position: 'absolute',
    bottom: 24,
    right: 5,
    flexDirection: 'row',
  },
  photoActionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(79, 70, 229, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
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
  },
});

export default PhotoGrid;
