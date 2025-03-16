import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Chrome, Gamepad, Instagram, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import PasswordFolder from '../../components/PasswordFolder';
import CreatePasswordFolder from '../../components/CreateFolder';

const mockPasswordData = {
  'Google Passwords': [
    { id: '1', name: 'johndoe@gmail.com', website: 'gmail.com' },
    { id: '2', name: 'john.doe', website: 'youtube.com' },
  ],
  'Game Passwords': [
    { id: '3', name: 'johngamer', website: 'steam.com' },
  ],
  'Social Media Passwords': [
    { id: '4', name: 'john_doe', website: 'instagram.com' },
    { id: '5', name: 'johndoe', website: 'twitter.com' },
    { id: '6', name: 'john.doe', website: 'facebook.com' },
  ],
};

export default function PasswordsScreen() {
  const router = useRouter();
  const [createFolderVisible, setCreateFolderVisible] = useState(false);
  const [folders, setFolders] = useState([
    { title: 'Google Passwords', count: 2, icon: <Chrome size={24} color="#4285F4" />, color: '#4285F4' },
    { title: 'Game Passwords', count: 1, icon: <Gamepad size={24} color="#FF4081" />, color: '#FF4081' },
    { title: 'Social Media Passwords', count: 3, icon: <Instagram size={24} color="#E1306C" />, color: '#E1306C' },
  ]);

  // When a folder is pressed, push to PasswordList and pass folderName and passwords.
  const handleFolderPress = (folder: { title: string; count: number; color: string; icon: JSX.Element }) => {
    router.push({
      pathname: '/screens/PasswordList',
      params: {
        folderName: folder.title,
        passwords: JSON.stringify(mockPasswordData[folder.title] || []),
      },
    });
  };

  const handleCreateFolder = () => {
    setCreateFolderVisible(true);
  };

  const closeCreateFolder = () => {
    setCreateFolderVisible(false);
  };

  const submitNewFolder = (folderName: string) => {
    const newFolder = {
      title: folderName,
      count: 0,
      icon: <Chrome size={24} color="#6366F1" />,
      color: '#6366F1',
    };
    setFolders([...folders, newFolder]);
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Password Manager</Text>
        <Text style={styles.subtitle}>Securely store and manage your passwords</Text>
          
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {folders.map((folder, index) => (
            <PasswordFolder 
              key={index}
              title={folder.title} 
              count={folder.count} 
              icon={folder.icon} 
              color={folder.color}
              onPress={() => handleFolderPress(folder)}
            />
          ))}
        </ScrollView>
          
        <TouchableOpacity style={styles.addButton} onPress={handleCreateFolder}>
          <Plus size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Create New Password Folder</Text>
        </TouchableOpacity>
      </View>

      <CreatePasswordFolder
        visible={createFolderVisible}
        onClose={closeCreateFolder}
        onSubmit={submitNewFolder}
      />
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default PasswordsScreen;
