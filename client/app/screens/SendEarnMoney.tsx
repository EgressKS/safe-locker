import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { ChevronLeft, User, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function EarnMoney() {
  const router = useRouter();
  
  const [earnOptions, setEarnOptions] = useState([
    {
      id: '1',
      title: 'Refer a Friend',
      description: 'Earn vouchers up to 50% off on Amazon, Myntra, Flipkart, and beauty products when your friend signs up using your code.',
      icon: <User size={24} color="#4F46E5" />,
      backgroundColor: '#EEF2FF',
    },
    {
      id: '2',
      title: 'Complete Your Profile',
      description: 'Earn vouchers up to 20% off on select brands by completing your account details.',
      icon: <User size={24} color="#10B981" />,
      backgroundColor: '#ECFDF5',
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#4F46E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earn Money</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.earnHeader}>
          <Text style={styles.earnTitle}>Ways to Earn Vouchers</Text>
          <Text style={styles.earnSubtitle}>Complete tasks to unlock discount vouchers</Text>
        </View>

        {earnOptions.map((option) => (
          <TouchableOpacity key={option.id} style={styles.earnOption}>
            <View style={[styles.earnIconContainer, { backgroundColor: option.backgroundColor }]}>
              {option.icon}
            </View>
            <View style={styles.earnOptionContent}>
              <Text style={styles.earnOptionTitle}>{option.title}</Text>
              <Text style={styles.earnOptionDescription}>{option.description}</Text>
            </View>
            <ArrowRight size={20} color="#6B7280" />
          </TouchableOpacity>
        ))}

        <View style={styles.referralCard}>
          <Text style={styles.referralTitle}>Your Referral Code</Text>
          <View style={styles.referralCodeContainer}>
            <Text style={styles.referralCode}>SAFE123</Text>
            <TouchableOpacity style={styles.copyButton}>
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.referralDescription}>
            Share your code with friends or complete your profile to unlock vouchers offering discounts up to 50% on top brands.
          </Text>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share Code</Text>
          </TouchableOpacity>
        </View>
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
  earnHeader: {
    marginBottom: 16,
  },
  earnTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  earnSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  earnOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  earnIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  earnOptionContent: {
    flex: 1,
  },
  earnOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  earnOptionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  referralCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  referralTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  referralCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  referralCode: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F46E5',
    letterSpacing: 1,
  },
  copyButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  referralDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  shareButton: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
  },
});
