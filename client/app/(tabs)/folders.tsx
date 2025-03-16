import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image as ImageIcon, Video, FileText, FileKey, Upload } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import FileFolder from '../../components/FileFolder';

export default function FoldersScreen() {
  const router = useRouter();
  const [folders, setFolders] = useState([
    { title: 'Photos', count: 48, icon: <ImageIcon size={24} color="#EC4899" />, color: '#EC4899' },
    { title: 'Videos', count: 7, icon: <Video size={24} color="#F59E0B" />, color: '#F59E0B' },
    { title: 'Document', count: 23, icon: <FileText size={24} color="#10B981" />, color: '#10B981' },
    { title: 'Secret Notes', count: 15, icon: <FileKey size={24} color="#6366F1" />, color: '#6366F1' },
  ]);

  const handleFolderPress = (folderName: string) => {
    switch (folderName) {
      case 'Photos':
        // Navigate to PhotoGalleryScreen
        router.push('/screens/floderView/PhotoGalleryScreen');
        break;
      case 'Videos':
        // Navigate to VideoGalleryScreen
        router.push('/screens/floderView/VideoGalleryScreen');
        break;
      case 'Document' :
        // Navigate to DocumentListScreen
        router.push('/screens/floderView/DocumentListScreen');
        break;
      case 'Secret Notes':
        router.push('/screens/floderView/DocumentListScreen');
        break;
      default:
        // Set the selected file type and show the upload form for other folders
        break;
    }
  };

  const handleFileUpload = (fileName: string, fileType: string) => {
    // Handle file upload logic here
    console.log(`Uploaded ${fileName} to ${fileType}`);
    
    // Update folder count
    const updatedFolders = folders.map(folder => {
      if (folder.title === fileType) {
        return { ...folder, count: folder.count + 1 };
      }
      return folder;
    });
    
    setFolders(updatedFolders);
  };

  return (
    <View style={styles.container}>
      <Header />
      
      <View style={styles.content}>
        <Text style={styles.title}>File Manager</Text>
        <Text style={styles.subtitle}>Securely store and manage your files</Text>
        
        <View style={styles.folderGrid}>
          {folders.map((folder, index) => (
            <FileFolder 
              key={index}
              title={folder.title} 
              count={folder.count} 
              icon={folder.icon} 
              color={folder.color}
              onPress={() => handleFolderPress(folder.title)}
              style={styles.folderItem}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 25, 
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5, 
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  folderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
    marginBottom: 24,
  },
  folderItem: {
    width: '45%', 
    backgroundColor: '#FFFFFF',
    borderRadius: 10, 
    padding: 16, 
    marginBottom: 16, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB', 
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});
