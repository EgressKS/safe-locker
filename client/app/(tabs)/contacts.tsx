import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { Search, UserPlus } from 'lucide-react-native';
import Header from '../../components/Header';
import ContactCard from '../../components/ContactCard';
import AddContactForm from '../../components/AddContactForm';

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  imageUrl: string;
  hasWhatsapp: boolean;
}

export default function ContactsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [addContactVisible, setAddContactVisible] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Smith',
      phoneNumber: '+1 (555) 123-4567',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      hasWhatsapp: true,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      phoneNumber: '+1 (555) 987-6543',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      hasWhatsapp: true,
    },
    {
      id: '3',
      name: 'Michael Brown',
      phoneNumber: '+1 (555) 456-7890',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      hasWhatsapp: false,
    },
    {
      id: '4',
      name: 'Emily Davis',
      phoneNumber: '+1 (555) 234-5678',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      hasWhatsapp: true,
    },
    {
      id: '5',
      name: 'David Wilson',
      phoneNumber: '+1 (555) 876-5432',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      hasWhatsapp: false,
    },
    {
      id: '6',
      name: 'Jessica Taylor',
      phoneNumber: '+1 (555) 345-6789',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
      hasWhatsapp: true,
    },
  ]);

  const handleContactPress = (contactName: string) => {
    // Handle contact press
    console.log(`Contact pressed: ${contactName}`);
  };

  const handleAddContact = () => {
    setAddContactVisible(true);
  };

  const closeAddContact = () => {
    setAddContactVisible(false);
  };

  const submitNewContact = (contact: Omit<Contact, 'id'>) => {
    const newContact = {
      ...contact,
      id: Date.now().toString(),
    };
    
    setContacts([...contacts, newContact]);
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phoneNumber.includes(searchQuery)
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <View style={styles.content}>
        <Text style={styles.title}>Connect Numbers</Text>
        <Text style={styles.subtitle}>Manage your important contacts</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {filteredContacts.length > 0 ? (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {filteredContacts.map((contact) => (
              <ContactCard 
                key={contact.id}
                name={contact.name}
                phoneNumber={contact.phoneNumber}
                imageUrl={contact.imageUrl}
                hasWhatsapp={contact.hasWhatsapp}
                onPress={() => handleContactPress(contact.name)}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <UserPlus size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No contacts found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try a different search term' : 'Add your first contact'}
            </Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
          <UserPlus size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add New Contact</Text>
        </TouchableOpacity>
      </View>
      
      <AddContactForm
        visible={addContactVisible}
        onClose={closeAddContact}
        onSubmit={submitNewContact}
      />
    </SafeAreaView>
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
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  scrollView: {
    flex: 1,
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