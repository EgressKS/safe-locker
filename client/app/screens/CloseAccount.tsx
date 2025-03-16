import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, SafeAreaView, Alert } from 'react-native';
import { ChevronLeft, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface ReasonOption {
  id: string;
  text: string;
}

export default function CloseAccount() {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [password, setPassword] = useState('');
  
  const reasonOptions: ReasonOption[] = [
    { id: '1', text: 'I found another app' },
    { id: '2', text: 'User experience is not good' },
    { id: '3', text: 'Privacy and security concerns' },
    { id: '4', text: 'I no longer need this service' },
    { id: '5', text: 'Other reason' },
  ];

  const handleReasonSelect = (id: string) => {
    setSelectedReason(id);
  };

  const handleCloseAccount = () => {
    if (!selectedReason || !password) {
      Alert.alert(
        'Missing Information',
        'Please select a reason and enter your password to continue.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Show confirmation dialog
    Alert.alert(
      'Confirm Account Closure',
      'Are you sure you want to close your account? This action cannot be undone and all your data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Close Account',
          style: 'destructive',
          onPress: () => {
            // Close account logic would go here
            console.log(`Account closed. Reason: ${selectedReason}, Feedback: ${feedbackMessage}`);
            
            // Navigate back to login or home
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#4F46E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Close Account</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.warningCard}>
          <AlertTriangle size={24} color="#EF4444" style={styles.warningIcon} />
          <Text style={styles.warningTitle}>Warning: Account Closure</Text>
          <Text style={styles.warningText}>
            Closing your account will permanently delete all your data, including passwords, files, and contacts. This action cannot be undone.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why are you leaving?</Text>
          <Text style={styles.sectionSubtitle}>Please select a reason for closing your account:</Text>
          
          {reasonOptions.map((option) => (
            <TouchableOpacity 
              key={option.id} 
              style={[
                styles.reasonOption,
                selectedReason === option.id && styles.selectedReason
              ]}
              onPress={() => handleReasonSelect(option.id)}
            >
              <View style={[
                styles.radioButton,
                selectedReason === option.id && styles.radioButtonSelected
              ]}>
                {selectedReason === option.id && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.reasonText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Feedback</Text>
          <Text style={styles.sectionSubtitle}>Please share any additional feedback to help us improve:</Text>
          
          <TextInput
            style={styles.feedbackInput}
            value={feedbackMessage}
            onChangeText={setFeedbackMessage}
            placeholder="Tell us more about your experience..."
            multiline
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confirm with Password</Text>
          <Text style={styles.sectionSubtitle}>Please enter your password to confirm account closure:</Text>
          
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />
        </View>
        
        <TouchableOpacity 
          style={[
            styles.closeButton, 
            (!selectedReason || !password) && styles.disabledButton
          ]} 
          onPress={handleCloseAccount}
          disabled={!selectedReason || !password}
        >
          <Text style={styles.closeButtonText}>Close Account</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  warningCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  warningIcon: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#B91C1C',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  selectedReason: {
    backgroundColor: '#F3F4F6',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#4F46E5',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4F46E5',
  },
  reasonText: {
    fontSize: 16,
    color: '#1F2937',
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    color: '#1F2937',
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: '#FCA5A5',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  cancelButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '600',
  },
});