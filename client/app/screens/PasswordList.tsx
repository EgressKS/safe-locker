import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Key, CreditCard as Edit, Trash2, ArrowLeft } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CreateNewPassword from '../../components/PasswordDetail';

interface PasswordItem {
  id: string;
  name: string;
  website: string;
}

export default function PasswordList() {
  const router = useRouter();
  const { folderName, passwords } = useLocalSearchParams();
  const folder = folderName ? folderName.toString() : '';
  const parsedPasswords = passwords ? JSON.parse(passwords as string) : [];
  const [createNewPassword, setCreateNewPassword] = useState(false);

  // Implement local handler functions:
  const handleEditPassword = (id: string) => {
    console.log(`Edit password with id: ${id}`);
  };

  const handleDeletePassword = (id: string) => {
    console.log(`Delete password with id: ${id}`);
  };

  const handleAddPassword = () => {
    setCreateNewPassword(true);
    // console.log(createNewPassword)
  };

  const closeCreatePassword = ()=>{
    setCreateNewPassword(false);
  }

  const handleBackPress = () => {
    router.back();
  };


  const renderItem = ({ item }: { item: PasswordItem }) => (
    <View style={styles.passwordItem}>
      <View style={styles.passwordIcon}>
        <Key size={20} color="#4F46E5" />
      </View>
      <View style={styles.passwordInfo}>
        <Text style={styles.passwordName}>{item.name}</Text>
        <Text style={styles.passwordWebsite}>{item.website}</Text>
      </View>
      <View style={styles.passwordActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleEditPassword(item.id)}
        >
          <Edit size={18} color="#4B5563" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeletePassword(item.id)}
        >
          <Trash2 size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <ArrowLeft size={24} color="#4F46E5" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{folder}</Text>
          {/* <Text style={styles.count}>{parsedPasswords.length} passwords</Text> */}
        </View>
      </View>

      {parsedPasswords.length > 0 ? (
        <FlatList
          data={parsedPasswords}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Key size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>No passwords found</Text>
          <Text style={styles.emptySubtext}>Add your first password to this folder</Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddPassword}
      >
        <Text style={styles.addButtonText}>Add New Password</Text>
      </TouchableOpacity>

      <CreateNewPassword
        visible={createNewPassword}
        onClose={closeCreatePassword}
        folderName={folder}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 40,
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  count: {
    fontSize: 14,
    color: '#6B7280',
  },
  listContent: {
    padding: 16,
  },
  passwordItem: {
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
  passwordIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  passwordInfo: {
    flex: 1,
  },
  passwordName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  passwordWebsite: {
    fontSize: 14,
    color: '#6B7280',
  },
  passwordActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    margin: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PasswordList;
