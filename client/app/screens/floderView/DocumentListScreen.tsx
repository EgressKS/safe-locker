import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  SafeAreaView, 
  Modal, 
  Alert,
  Dimensions 
} from 'react-native';
import { 
  ChevronLeft, 
  FileText, 
  FolderPlus, 
  Search, 
  Download, 
  Trash2, 
  Check, 
  X, 
  File, 
  Upload, 
  Eye, 
  Grid2x2 as Grid, 
  List, 
  Plus, 
  FolderIcon, FileIcon 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView, LongPressGestureHandler, State } from 'react-native-gesture-handler';
import CreateFolder from '@/components/CreateFolder';
import FileUploadForm from '@/components/FileUploadForm';

interface Album {
  id: string;
  name: string;
  count: number;
  createdAt: string;
}

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'txt' | 'csv' | 'docx' | 'xlsx';
  date: string;
  size: string;
  url: string;
  createdAt: string;
  lastModified: string;
}

const mockAlbums: Album[] = [
  {
    id: '1',
    name: 'Work Documents',
    count: 24,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Personal Files',
    count: 15,
    createdAt: '2024-01-02'
  },
  {
    id: '3',
    name: 'Project Reports',
    count: 8,
    createdAt: '2024-01-03'
  }
];

const mockDocuments: { [key: string]: Document[] } = {
  'Work Documents': [
    {
      id: '1',
      name: 'Annual Report 2024.pdf',
      type: 'pdf',
      url: 'https://example.com/docs/annual-report.pdf',
      date: '2024-02-15',
      size: '2.4 MB',
      createdAt: '2024-02-15',
      lastModified: '2024-02-15'
    },
    {
      id: '2',
      name: 'Meeting Notes.txt',
      type: 'txt',
      url: 'https://example.com/docs/meeting-notes.txt',
      date: '2024-02-10',
      size: '156 KB',
      createdAt: '2024-02-10',
      lastModified: '2024-02-10'
    }
  ],
  'Personal Files': [
    {
      id: '3',
      name: 'Budget 2024.csv',
      type: 'csv',
      url: 'https://example.com/docs/budget.csv',
      date: '2024-01-20',
      size: '450 KB',
      createdAt: '2024-01-20',
      lastModified: '2024-01-20'
    }
  ]
};

const EmptyAlbumList = () => (
  <View style={styles.emptyContainer}>
    <FolderIcon size={64} color="#D1D5DB" />
    <Text style={styles.emptyStateText}>Create your first folder to organize your documents</Text>
  </View>
);

const EmptyDocumentList = () => (
  <View style={styles.emptyContainer}>
    <FileText size={64} color="#D1D5DB" />
    <Text style={styles.emptyStateTitle}>No Documents Found</Text>
    <Text style={styles.emptyStateText}>Add some photos to this album</Text>
  </View>
);

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText size={24} color="#EF4444" />;
    case 'txt':
      return <FileText size={24} color="#3B82F6" />;
    case 'csv':
      return <FileText size={24} color="#10B981" />;
    default:
      return <FileIcon size={24} color="#6B7280" />;
  }
};

const getDocumentTypeColor = (type: string) => {
  switch (type) {
    case 'pdf': return '#EF4444';
    case 'txt': return '#3B82F6';
    case 'csv': return '#10B981';
    case 'docx': return '#6366F1';
    case 'xlsx': return '#059669';
    default: return '#6B7280';
  }
};

const formatFileSize = (size: string) => {
  const num = parseFloat(size);
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
};

const sortDocuments = (docs: Document[], sortBy: 'name' | 'date' | 'size') => {
  return [...docs].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'size':
        return parseFloat(b.size) - parseFloat(a.size);
      default:
        return 0;
    }
  });
};

const filterDocuments = (docs: Document[], query: string, types: string[]) => {
  return docs.filter(doc => {
    const matchesQuery = doc.name.toLowerCase().includes(query.toLowerCase());
    const matchesType = types.length === 0 || types.includes(doc.type);
    return matchesQuery && matchesType;
  });
};


export default function DocumentListScreen() {
  const [currentFolder, setCurrentFolder] = useState('Documents');
  const [folderHistory, setFolderHistory] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [newFolderModalVisible, setNewFolderModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');

  const router = useRouter();

  const currentFolderData = mockDocuments[currentFolder as keyof typeof mockDocuments] || [];

  const navigateToFolder = (folderName: string) => {
    setFolderHistory([...folderHistory, currentFolder]);
    setCurrentFolder(folderName);
    // Reset multi-select mode when changing folders
    setIsMultiSelectMode(false);
    setSelectedDocuments([]);
  };

  const navigateBack = () => {
    if (folderHistory.length > 0) {
      const previousFolder = folderHistory[folderHistory.length - 1];
      setCurrentFolder(previousFolder);
      setFolderHistory(folderHistory.slice(0, -1));
      // Reset multi-select mode when navigating back
      setIsMultiSelectMode(false);
      setSelectedDocuments([]);
    } else {
      router.back();
    }
  };

  const handleDocumentPress = (document: Document) => {
    if (isMultiSelectMode) {
      toggleDocumentSelection(document.id);
    } else {
      setPreviewDocument(document);
    }
  };

  const handleDocumentLongPress = (document: Document) => {
    if (!isMultiSelectMode) {
      setIsMultiSelectMode(true);
      setSelectedDocuments([document.id]);
    }
  };

  const toggleDocumentSelection = (documentId: string) => {
    if (selectedDocuments.includes(documentId)) {
      setSelectedDocuments(selectedDocuments.filter(id => id !== documentId));
      if (selectedDocuments.length === 1) {
        setIsMultiSelectMode(false);
      }
    } else {
      setSelectedDocuments([...selectedDocuments, documentId]);
    }
  };

  const closePreview = () => {
    setPreviewDocument(null);
  };

  const exitMultiSelectMode = () => {
    setIsMultiSelectMode(false);
    setSelectedDocuments([]);
  };

  const handleDownloadDocument = (documentId: string) => {
    // In a real app, this would trigger the download
    Alert.alert('Download', 'Document download started');
  };

  const handleDeleteDocument = (documentId: string) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In a real app, this would delete the document
            Alert.alert('Success', 'Document deleted successfully');
          }
        }
      ]
    );
  };

  const handleDownloadSelected = () => {
    if (selectedDocuments.length > 0) {
      Alert.alert('Download', `Downloading ${selectedDocuments.length} documents`);
      exitMultiSelectMode();
    }
  };

  const handleDeleteSelected = () => {
    if (selectedDocuments.length > 0) {
      Alert.alert(
        'Delete Documents',
        `Are you sure you want to delete ${selectedDocuments.length} documents?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              // In a real app, this would delete the selected documents
              Alert.alert('Success', `${selectedDocuments.length} documents deleted successfully`);
              exitMultiSelectMode();
            }
          }
        ]
      );
    }
  };

  const handleCreateNewFolder = () => {
    if (newFolderName.trim()) {
      // In a real app, this would create a new folder
      Alert.alert('Success', `Folder "${newFolderName}" created successfully`);
      setNewFolderName('');
      setNewFolderModalVisible(false);
    } else {
      Alert.alert('Error', 'Please enter a folder name');
    }
  };

  const handleUploadDocument = () => {
    if (uploadFileName.trim()) {
      // In a real app, this would upload a document
      Alert.alert('Success', `Document "${uploadFileName}" uploaded successfully`);
      setUploadFileName('');
      setUploadModalVisible(false);
    } else {
      Alert.alert('Error', 'Please enter a file name');
    }
  };

  const filteredDocuments = currentFolderData.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredItems = filteredDocuments.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFolderItem = ({ item }: { item: Album }) => (
    <TouchableOpacity
      style={styles.folderItem}
      onPress={() => navigateToFolder(item.name)}
    >
      <View style={styles.folderIconContainer}>
        <FileText size={24} color="#4F46E5" />
      </View>
      <Text style={styles.folderName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderDocumentItem = ({ item }: { item: Document }) => {
    const isSelected = selectedDocuments.includes(item.id);
    const typeColor = getDocumentTypeColor(item.type);
  
    return (
      <LongPressGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) {
            handleDocumentLongPress(item);
          }
        }}
        minDurationMs={600}
      >
        <TouchableOpacity
          style={[
            styles.documentItem,
            viewMode === 'grid' && styles.documentItemGrid,
            isSelected && styles.selectedDocumentItem
          ]}
          onPress={() => handleDocumentPress(item)}
          activeOpacity={0.7}
        >
          <View style={[
            styles.documentIconContainer,
            viewMode === 'grid' && styles.documentIconContainerGrid,
            { backgroundColor: `${typeColor}10` }
          ]}>
            <FileText size={viewMode === 'grid' ? 32 : 24} color={typeColor} />
          </View>
  
          <View style={[
            styles.documentInfo,
            viewMode === 'grid' && styles.documentInfoGrid
          ]}>
            <Text 
              style={[
                styles.documentName,
                viewMode === 'grid' && styles.documentNameGrid
              ]} 
              numberOfLines={viewMode === 'grid' ? 2 : 1}
            >
              {item.name}
            </Text>
            <Text style={styles.documentMeta}>
              {formatFileSize(item.size)} • {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
  
          {isMultiSelectMode ? (
            <View style={[styles.selectionIndicator, isSelected && styles.selectedIndicator]}>
              {isSelected && <Check size={16} color="#FFFFFF" />}
            </View>
          ) : (
            <View style={[
              styles.documentActions,
              viewMode === 'grid' && styles.documentActionsGrid
            ]}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDownloadDocument(item.id)}
              >
                <Download size={20} color={typeColor} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteActionButton]}
                onPress={() => handleDeleteDocument(item.id)}
              >
                <Trash2 size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </LongPressGestureHandler>
    );
  };

  function handleFileupload(fileName: string, fileType: string): void {
    throw new Error('Function not implemented.');
  }

  const renderAlbumList = () => {
    if (folderHistory.length === 0) {
      return mockAlbums.length > 0 ? (
        <View style={styles.albumsSection}>
         
          <FlatList
            data={mockAlbums}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.folderItem}
                onPress={() => navigateToFolder(item.name)}
              >
                <View style={styles.folderIconContainer}>
                  <FolderIcon size={24} color="#4F46E5" />
                </View>
                <View style={styles.folderInfo}>
                  <Text style={styles.folderName}>{item.name}</Text>
                  <Text style={styles.folderCount}>{item.count} documents</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      ) : (
        <EmptyAlbumList />
      );
    }
    return null;
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
            <ChevronLeft size={24} color="#4F46E5" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{currentFolder}</Text>
            {isMultiSelectMode && (
              <Text style={styles.selectionCount}>
                {selectedDocuments.length} selected
              </Text>
            )}
          </View>
        
          {folderHistory.length === 0 ? (
            // Show only folder creation in album view
            <TouchableOpacity
              style={styles.headerActionButton}
              onPress={() => setNewFolderModalVisible(true)}
            >
              <FolderPlus size={24} color="#4F46E5" />
            </TouchableOpacity>
          ) : (
            // Show upload button in folder view
            !isMultiSelectMode && (
              <TouchableOpacity
                style={styles.headerActionButton}
                onPress={() => setUploadModalVisible(true)}
              >
                <Upload size={24} color="#4F46E5" />
              </TouchableOpacity>
            )
          )}
        </View>

        {isMultiSelectMode && (
          <View style={styles.multiSelectActions}>
            <TouchableOpacity
              style={[styles.multiSelectButton, styles.downloadButton]}
              onPress={handleDownloadSelected}
            >
              <Download size={20} color="#FFFFFF" />
              <Text style={styles.multiSelectButtonText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.multiSelectButton, styles.deleteMultiButton]}
              onPress={handleDeleteSelected}
            >
              <Trash2 size={20} color="#FFFFFF" />
              <Text style={styles.multiSelectButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search documents..."
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {folderHistory.length === 0 ? (
            renderAlbumList()
          ) : (
            currentFolderData.length === 0 ? (
              <EmptyDocumentList />
            ) : (
              <FlatList
                data={sortDocuments(filterDocuments(currentFolderData, searchQuery, selectedTypes), sortBy)}
                renderItem={renderDocumentItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
              />
            )
          )}
        </View>

        {/* Document Preview Modal */}
        {previewDocument && (
          <Modal
            visible={!!previewDocument}
            transparent={true}
            animationType="fade"
            onRequestClose={closePreview}
          >
            <View style={styles.previewOverlay}>
              <View style={styles.previewContainer}>
                <View style={styles.previewHeader}>
                  <Text style={styles.previewTitle}>Document Preview</Text>
                  <TouchableOpacity onPress={closePreview}>
                    <X size={24} color="#4B5563" />
                  </TouchableOpacity>
                </View>

                <View style={styles.previewContent}>
                  <View style={styles.previewIconContainer}>
                    {previewDocument.type === 'pdf' ? (
                      <FileText size={64} color="#EF4444" />
                    ) : previewDocument.type === 'docx' ? (
                      <FileText size={64} color="#3B82F6" />
                    ) : previewDocument.type === 'xlsx' ? (
                      <FileText size={64} color="#10B981" />
                    ) : (
                      <File size={64} color="#6B7280" />
                    )}
                  </View>

                  <View style={styles.previewInfo}>
                    <Text style={styles.previewFileName}>{previewDocument.name}</Text>
                    <Text style={styles.previewFileDetails}>Type: {previewDocument.type.toUpperCase()}</Text>
                    <Text style={styles.previewFileDetails}>Size: {previewDocument.size}</Text>
                    <Text style={styles.previewFileDate}>Date: {previewDocument.date}</Text>
                  </View>

                  <Text style={styles.previewMessage}>
                    Document preview is not available in this version. Please download the file to view its contents.
                  </Text>
                </View>

                <View style={styles.previewActions}>
                  <TouchableOpacity
                    style={styles.previewActionButton}
                    onPress={() => {
                      handleDownloadDocument(previewDocument.id);
                      closePreview();
                    }}
                  >
                    <Download size={20} color="#FFFFFF" />
                    <Text style={styles.previewActionText}>Download</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.previewActionButton, styles.previewDeleteButton]}
                    onPress={() => {
                      closePreview();
                      handleDeleteDocument(previewDocument.id);
                    }}
                  >
                    <Trash2 size={20} color="#FFFFFF" />
                    <Text style={styles.previewActionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        {/* New Folder Modal  */}
       <CreateFolder
        visible={newFolderModalVisible}
        onClose={()=> setNewFolderModalVisible(false)}
        onSubmit={handleCreateNewFolder}
       />

        {/* Upload Document Modal */}
        <FileUploadForm
          visible={uploadModalVisible}
          onClose={() => setUploadModalVisible(false)}
          fileType='Document'
          onSubmit={handleFileupload}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
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
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  selectionCount: {
    fontSize: 14,
    color: '#4F46E5',
    marginTop: 4,
  },
  addButton: {
    padding: 8,
  },
  closeButton: {
    padding: 8,
  },
  pathContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
  },
  pathText: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectionCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  multiSelectActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  multiSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  downloadButton: {
    backgroundColor: '#4F46E5',
  },
  deleteMultiButton: {
    backgroundColor: '#EF4444',
  },
  multiSelectButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
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
  foldersSection: {
    marginBottom: 5,
  },
  folderItem: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    flexDirection: "row",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  folderIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedDocumentItem: {
    borderWidth: 2,
    borderColor: '#4F46E5',
    borderRadius: 12,
  },
  documentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  documentMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  documentActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  deleteActionButton: {
    backgroundColor: '#FEF2F2',
    borderRadius: 20,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicator: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  previewContent: {
    padding: 24,
    alignItems: 'center',
  },
  previewIconContainer: {
    marginBottom: 16,
  },
  previewInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  previewFileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  previewFileDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  previewFileDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  previewMessage: {
    fontSize: 16,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    width: '100%',
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  previewActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 8,
  },
  previewDeleteButton: {
    backgroundColor: '#EF4444',
  },
  previewActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalBody: {
    padding: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  modalInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1F2937',
    // outlineStyle: 'none',
  },
  fileSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderStyle: 'dashed',
    paddingVertical: 16,
  },
  fileSelectText: {
    color: '#4F46E5',
    fontWeight: '600',
    marginLeft: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalCancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  modalCancelText: {
    color: '#4B5563',
    fontWeight: '500',
  },
  modalCreateButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#4F46E5',
  },
  modalCreateText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  listHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sortingControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  activeSortButton: {
    backgroundColor: '#4F46E5',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  activeSortButtonText: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 16,
  },
  albumsSection: {
    flex: 1,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  folderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  folderCount: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  documentItemGrid: {
    width: Dimensions.get('window').width / 2 - 24, // 2 columns with padding
    marginHorizontal: 8,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
  },
  
  documentIconContainerGrid: {
    width: 56,
    height: 56,
    marginBottom: 12,
  },
  
  documentInfoGrid: {
    width: '100%',
    alignItems: 'center',
  },
  
  documentNameGrid: {
    textAlign: 'center',
    marginBottom: 8,
  },
  
  documentActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerActionButton: {
    padding: 8,
    marginLeft: 8,
  },
});