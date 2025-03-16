import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { ChevronLeft, Camera, Save, Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function AccountSettings() {
  const router = useRouter();
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Validate profile info
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    
    // Validate password change (only if any password field is filled)
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) newErrors.currentPassword = 'Current password is required';
      if (!newPassword) newErrors.newPassword = 'New password is required';
      else if (newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
      
      if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = () => {
    if (validateForm()) {
      // Save profile logic would go here
      console.log('Profile saved');
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#4F46E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          
          {/* Profile Image Section */}
          <View style={styles.profileImageSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80' }}
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.changeProfileButton}>
                <Camera size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Change Password</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, errors.currentPassword && styles.inputError]}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                secureTextEntry={!showCurrentPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
            {errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, errors.newPassword && styles.inputError]}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
            {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, errors.confirmPassword && styles.inputError]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>
        </View>
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Save size={20} color="#FFFFFF" style={styles.saveIcon} />
          <Text style={styles.saveButtonText}>Save Changes</Text>
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
    marginBottom: 16,
  },
  profileImageSection: {
    marginBottom: 16,
    position: 'relative',
  },
  profileImageContainer: {
    position: 'relative',
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:'30%'
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  changeProfileButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#4F46E5',
    borderRadius: 50,
    padding: 6,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    height: 48,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeIcon: {
    position: 'absolute',
    top: '50%',
    right: 12,
    transform: [{ translateY: -12 }],
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 24,
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
