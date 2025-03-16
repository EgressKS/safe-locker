import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, SafeAreaView } from 'react-native';
import { ChevronLeft, CircleHelp as HelpCircle, MessageSquare, Star, ChevronRight, Send } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function HelpFeedback() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('help');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [rating, setRating] = useState(0);
  
  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the login screen and tap on "Forgot Password". Enter your email address and follow the instructions sent to your email to create a new password.'
    },
    {
      id: '2',
      question: 'Is my data secure in Safe-Locker?',
      answer: 'Yes, all your data in Safe-Locker is encrypted using industry-standard encryption protocols. We use end-to-end encryption to ensure that only you can access your sensitive information. Your passwords and files are never stored in plain text.'
    },
    {
      id: '3',
      question: 'How do I add a new password folder?',
      answer: 'To add a new password folder, go to the Password Manager tab and tap on the "Create New Password Folder" button at the bottom of the screen. Enter a name for your folder and tap "Create Folder".'
    },
    {
      id: '4',
      question: 'Can I access my data on multiple devices?',
      answer: 'Yes, you can access your Safe-Locker data on multiple devices. Simply log in with the same account credentials on each device, and your data will be synchronized across all your devices.'
    },
    {
      id: '5',
      question: 'How do I delete my account?',
      answer: 'To delete your account, go to Account Settings > Close Account. You will need to provide a reason for closing your account and confirm your decision. Please note that account deletion is permanent and all your data will be removed.'
    },
  ];

  const toggleFAQ = (id: string) => {
    if (expandedFAQ === id) {
      setExpandedFAQ(null);
    } else {
      setExpandedFAQ(id);
    }
  };

  const handleSubmitFeedback = () => {
    if (feedbackMessage.trim() === '' || rating === 0) return;
    
    // Submit feedback logic would go here
    console.log(`Feedback submitted: Rating ${rating}, Message: ${feedbackMessage}`);
    
    // Reset form
    setFeedbackMessage('');
    setRating(0);
    
    // Show success message or navigate back
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#4F46E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Feedback</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'help' && styles.activeTab]} 
          onPress={() => setActiveTab('help')}
        >
          <HelpCircle size={16} color={activeTab === 'help' ? '#4F46E5' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'help' && styles.activeTabText]}>Help Center</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'feedback' && styles.activeTab]} 
          onPress={() => setActiveTab('feedback')}
        >
          <MessageSquare size={16} color={activeTab === 'feedback' ? '#4F46E5' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'feedback' && styles.activeTabText]}>Send Feedback</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'help' ? (
        <ScrollView style={styles.content}>
          <View style={styles.helpHeader}>
            <Text style={styles.helpTitle}>Frequently Asked Questions</Text>
            <Text style={styles.helpSubtitle}>Find answers to common questions about Safe-Locker</Text>
          </View>
          
          {faqItems.map((item) => (
            <View key={item.id} style={styles.faqItem}>
              <TouchableOpacity 
                style={styles.faqQuestion}
                onPress={() => toggleFAQ(item.id)}
              >
                <Text style={styles.questionText}>{item.question}</Text>
                <ChevronRight 
                  size={20} 
                  color="#6B7280" 
                  style={[
                    styles.chevron, 
                    expandedFAQ === item.id && styles.chevronExpanded
                  ]} 
                />
              </TouchableOpacity>
              
              {expandedFAQ === item.id && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.answerText}>{item.answer}</Text>
                </View>
              )}
            </View>
          ))}
          
          <View style={styles.contactSupport}>
            <Text style={styles.contactTitle}>Still need help?</Text>
            <Text style={styles.contactDescription}>
              If you couldn't find the answer to your question, please contact our support team.
            </Text>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.feedbackHeader}>
            <Text style={styles.feedbackTitle}>We Value Your Feedback</Text>
            <Text style={styles.feedbackSubtitle}>Help us improve Safe-Locker by sharing your thoughts</Text>
          </View>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Rate your experience:</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity 
                  key={star} 
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Star 
                    size={32} 
                    color={star <= rating ? '#F59E0B' : '#D1D5DB'} 
                    fill={star <= rating ? '#F59E0B' : 'none'} 
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.ratingText}>
              {rating === 0 ? 'Tap to rate' : 
               rating === 1 ? 'Poor' :
               rating === 2 ? 'Fair' :
               rating === 3 ? 'Good' :
               rating === 4 ? 'Very Good' : 'Excellent'}
            </Text>
          </View>
          
          <View style={styles.feedbackForm}>
            <Text style={styles.feedbackLabel}>Your feedback:</Text>
            <TextInput
              style={styles.feedbackInput}
              value={feedbackMessage}
              onChangeText={setFeedbackMessage}
              placeholder="Tell us what you think about Safe-Locker..."
              multiline
              textAlignVertical="top"
            />
          </View>
          
          <TouchableOpacity 
            style={[
              styles.submitButton, 
              (feedbackMessage.trim() === '' || rating === 0) && styles.disabledButton
            ]} 
            onPress={handleSubmitFeedback}
            disabled={feedbackMessage.trim() === '' || rating === 0}
          >
            <Send size={20} color="#FFFFFF" style={styles.submitIcon} />
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
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
  tabContainer: {
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#EEF2FF',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#4F46E5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  helpHeader: {
    marginBottom: 16,
  },
  helpTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  helpSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  answerText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  contactSupport: {
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
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  feedbackHeader: {
    marginBottom: 16,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  feedbackSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  ratingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  feedbackForm: {
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
  feedbackLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 12,
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
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: '#A5B4FC',
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});