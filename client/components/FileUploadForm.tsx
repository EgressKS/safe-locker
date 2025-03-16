import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import { X, Upload, File, FileText } from 'lucide-react-native';

interface FileUploadFormProps {
  visible: boolean;
  onClose: () => void;
  fileType: string;
  onSubmit: (fileName: string, fileType: string) => void;
}

export default function FileUploadForm({ visible, onClose, fileType, onSubmit }: FileUploadFormProps) {
  const [fileName, setFileName] = useState('');
  const [fileDescription, setFileDescription] = useState('');

  const getButtonLabel = () => {
    switch (fileType.toLowerCase()) {
      case 'photos':
        return 'Upload Photo';
      case 'videos':
        return 'Upload Video';
      case 'documents':
        return 'Upload Document';
      case 'secret notes':
        return 'Save Note';
      default:
        return 'Upload File';
    }
  };

  const getIcon = () => {
    switch (fileType.toLowerCase()) {
      case 'secret notes':
        return <FileText size={48} color="#4F46E5" />;
      default:
        return <File size={48} color="#4F46E5" />;
    }
  };

  const handleSubmit = () => {
    if (fileName.trim()) {
      onSubmit(fileName, fileType);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setFileName('');
    setFileDescription('');
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{`Upload ${fileType}`}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.iconContainer}>
              {getIcon()}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>File Name</Text>
              <TextInput
                style={styles.input}
                value={fileName}
                onChangeText={setFileName}
                placeholder="Enter file name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description (optional)</Text>
              <TextInput
                style={styles.textArea}
                value={fileDescription}
                onChangeText={setFileDescription}
                placeholder="Enter file description"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={handleSubmit}
              >
                <Upload size={16} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.saveButtonText}>{getButtonLabel()}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#4F46E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 16,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});