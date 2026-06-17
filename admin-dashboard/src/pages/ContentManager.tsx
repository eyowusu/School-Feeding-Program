import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  FileText,
  Image,
  Video,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirebaseServices } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import ContentForm from '../components/ContentForm';

const ContentManager = () => {
  const { user } = useAuth();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [notification, setNotification] = useState(null);

  // Filter content based on search and type
  const filteredContent = content.filter((item: any) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const { db } = getFirebaseServices();
      const contentQuery = query(
        collection(db, 'content'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(contentQuery);
      const contentData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContent(contentData);
    } catch (error) {
      console.error('Error fetching content:', error);
      showNotification('Error loading content', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };


  const handleFileUpload = async (file) => {
    if (!file) return null;

    const { storage } = getFirebaseServices();
    const fileRef = ref(storage, `content/${Date.now()}_${file.name}`);
    try {
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      showNotification('Error uploading file', 'error');
      return null;
    }
  };

  const handleCreateContent = async (contentData, file = null) => {
    try {
      const { db } = getFirebaseServices();
      let mediaUrl = null;
      if (file) {
        mediaUrl = await handleFileUpload(file);
        if (!mediaUrl) return;
      }

      const newContent = {
        ...contentData,
        mediaUrl,
        author: user.name || user.email,
        authorId: user.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        featuredSections: contentData.featuredSections || [] // Add featuredSections
      };

      await addDoc(collection(db, 'content'), newContent);
      showNotification('Content created successfully');
      setShowAddModal(false);
      fetchContent();
    } catch (error) {
      console.error('Error creating content:', error);
      showNotification('Error creating content', 'error');
    }
  };

  const handleUpdateContent = async (id, updates) => {
    try {
      const { db } = getFirebaseServices();
      await updateDoc(doc(db, 'content', id), updates);
      showNotification('Content updated successfully');
      setEditingItem(null);
      fetchContent();
    } catch (error) {
      console.error('Error updating content:', error);
      showNotification('Error updating content', 'error');
    }
  };

  const handleDeleteContent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;

    try {
      const { db, storage } = getFirebaseServices();
      // Get content to check for media file
      const contentItem = content.find(item => item.id === id);

      // Delete from Firestore
      await deleteDoc(doc(db, 'content', id));

      // Delete media file if exists
      if (contentItem?.mediaUrl) {
        try {
          const fileRef = ref(storage, contentItem.mediaUrl);
          await deleteObject(fileRef);
        } catch (error) {
          console.warn('Could not delete media file:', error);
        }
      }

      showNotification('Content deleted successfully');
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      showNotification('Error deleting content', 'error');
    }
  };

  const handleBulkPublish = async () => {
    try {
      const { db } = getFirebaseServices();
      const promises = selectedItems.map(id =>
        updateDoc(doc(db, 'content', id), {
          status: 'published',
          updatedAt: serverTimestamp()
        })
      );
      await Promise.all(promises);
      showNotification(`${selectedItems.length} items published successfully`);
      setSelectedItems([]);
      fetchContent();
    } catch (error) {
      console.error('Error publishing content:', error);
      showNotification('Error publishing content', 'error');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) return;

    try {
      const { db, storage } = getFirebaseServices();
      const promises = selectedItems.map(id => {
        const contentItem = content.find(item => item.id === id);
        const deletePromises = [deleteDoc(doc(db, 'content', id))];

        // Delete media files
        if (contentItem?.mediaUrl) {
          try {
            const fileRef = ref(storage, contentItem.mediaUrl);
            deletePromises.push(deleteObject(fileRef));
          } catch (error) {
            console.warn('Could not delete media file:', error);
          }
        }

        return Promise.all(deletePromises);
      });

      await Promise.all(promises);
      showNotification(`${selectedItems.length} items deleted successfully`);
      setSelectedItems([]);
      fetchContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      showNotification('Error deleting content', 'error');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'news':
        return FileText;
      case 'gallery':
        return Image;
      case 'video':
        return Video;
      case 'event':
        return Calendar;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleDelete = (id) => {
    handleDeleteContent(id);
  };

  const handleBulkPublishClick = () => {
    if (selectedItems.length === 0) return;
    handleBulkPublish();
  };

  const handleBulkDeleteClick = () => {
    if (selectedItems.length === 0) return;
    handleBulkDelete();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div 
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 max-w-md cursor-pointer ${
            notification.type === 'error'
              ? 'bg-red-100 border border-red-400 text-red-700'
              : 'bg-green-100 border border-green-400 text-green-700'
          }`}
          onClick={() => setNotification(null)}
          role="alert"
          aria-label="Notification"
        >
          {notification.type === 'error' ? <AlertCircle className="h-5 w-5 flex-shrink-0" /> : <CheckCircle className="h-5 w-5 flex-shrink-0" />}
          <span className="flex-1">{notification.message}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setNotification(null);
            }}
            className="ml-2 text-gray-500 hover:text-gray-700 font-bold text-xl leading-none flex-shrink-0"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Content Manager</h1>
          <p className="text-gray-600">Create, edit, and manage website content</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
className="btn-primary flex items-center"
          >
          <Plus className="h-5 w-5 mr-2" />
          Add Content
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ghana-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-ghana-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="news">News</option>
              <option value="gallery">Gallery</option>
              <option value="video">Video</option>
              <option value="event">Event</option>
              <option value="document">Document</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-ghana-primary-50 border border-ghana-primary-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ghana-primary-700">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkPublishClick}
                disabled={selectedItems.length === 0}
className="btn-primary text-sm px-3 py-1"
              >
                Publish
              </button>
              <button
                onClick={handleBulkDeleteClick}
                disabled={selectedItems.length === 0}
className="btn-danger text-sm px-3 py-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(filteredContent.map(item => item.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContent.map((item) => {
                const IconComponent = getTypeIcon(item.type);
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
className="rounded border-gray-300 text-ghana-primary-600 focus:ring-ghana-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <IconComponent className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                          <div className="text-sm text-gray-500">{item.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize text-sm text-gray-900">{item.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {item.featuredSections && item.featuredSections.length > 0 ? (
                          item.featuredSections.map(section => (
                            <span
                              key={section}
className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-ghana-primary-100 text-ghana-primary-800 capitalize"
                            >
                              {section}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingItem(item)}
className="text-ghana-warning-600 hover:text-ghana-warning-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
className="text-ghana-error-600 hover:text-ghana-error-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
      </div>

      {/* Content Form Modal */}
      <ContentForm
        isOpen={showAddModal || !!editingItem}
        onClose={() => {
          setShowAddModal(false);
          setEditingItem(null);
        }}
        onSubmit={async (data, file) => {
          if (editingItem) {
            // Handle file upload if provided
            if (file) {
              const mediaUrl = await handleFileUpload(file);
              if (mediaUrl) {
                data.mediaUrl = mediaUrl;
              }
            }
            handleUpdateContent(editingItem.id, data);
          } else {
            handleCreateContent(data, file);
          }
        }}
        editingItem={editingItem}
      />
    </div>
  );
};

export default ContentManager;
