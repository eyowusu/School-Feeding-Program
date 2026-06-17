import React, { useState, useEffect } from 'react';
import { X, Upload, Save, AlertCircle } from 'lucide-react';

const ContentForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingItem = null, 
  uploading = false 
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, file?: any) => void;
  editingItem?: any;
  uploading?: boolean;
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'news',
    category: '',
    description: '',
    content: '',
    status: 'draft',
    tags: '',
    sourceUrl: '',
    featuredSections: [] // Add featuredSections array
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || '',
        type: editingItem.type || 'news',
        category: editingItem.category || '',
        description: editingItem.excerpt || editingItem.description || '',
        content: editingItem.content || '',
        status: editingItem.status || 'draft',
        tags: editingItem.tags ? editingItem.tags.join(', ') : '',
        sourceUrl: editingItem.sourceUrl || '',
        featuredSections: editingItem.featuredSections || [] // Add featuredSections population
      });
      setFilePreview(editingItem.mediaUrl || editingItem.image);
    } else {
      // Reset form for new content
      setFormData({
        title: '',
        type: 'news',
        category: '',
        description: '',
        content: '',
        status: 'draft',
        tags: '',
        sourceUrl: '',
        featuredSections: [] // Reset featuredSections
      });
      setSelectedFile(null);
      setFilePreview(null);
    }
    setErrors({});
  }, [editingItem, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (section) => {
    setFormData(prev => ({
      ...prev,
      featuredSections: prev.featuredSections.includes(section)
        ? prev.featuredSections.filter(s => s !== section)
        : [...prev.featuredSections, section]
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.type === 'news' && !formData.content.trim()) {
      newErrors.content = 'Content is required for news articles';
    }
    if (!formData.category.trim()) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      excerpt: formData.description,
      image: filePreview
    };

    onSubmit(submitData, selectedFile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {editingItem ? 'Edit Content' : 'Create New Content'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter content title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Education, Health, Events"
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.category}
                </p>
              )}
            </div>
          </div>

          {/* Type and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="news">News Article</option>
                <option value="gallery">Gallery Image</option>
                <option value="video">Video</option>
                <option value="event">Event</option>
                <option value="document">Document</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description/Summary *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Brief description or summary of the content"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Content (for news articles) */}
          {formData.type === 'news' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={8}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.content ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Write the full article content here..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.content}
                </p>
              )}
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (optional)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="school, education, health (comma separated)"
            />
          </div>

          {/* Source URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source URL (optional)
            </label>
            <input
              type="url"
              name="sourceUrl"
              value={formData.sourceUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/original-article"
            />
            <p className="mt-1 text-xs text-gray-500">
              Link to the original source article if this content is from an external source
            </p>
          </div>

          {/* Featured Sections */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Feature in Sections (optional)
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Select sections where you want this content to be featured (in addition to its primary section)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featuredSections.includes('hero')}
                  onChange={() => handleCheckboxChange('hero')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Hero Section</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featuredSections.includes('gallery')}
                  onChange={() => handleCheckboxChange('gallery')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Gallery Section</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featuredSections.includes('articles')}
                  onChange={() => handleCheckboxChange('articles')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Articles Section</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featuredSections.includes('videos')}
                  onChange={() => handleCheckboxChange('videos')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Videos Section</span>
              </label>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-500">
                  Images, videos, or documents (max 10MB)
                </p>
              </label>
            </div>

            {/* File Preview */}
            {filePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                {selectedFile?.type.startsWith('image/') || (!selectedFile && filePreview) ? (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-w-full h-48 object-cover rounded-lg"
                  />
                ) : selectedFile?.type.startsWith('video/') ? (
                  <video
                    src={URL.createObjectURL(selectedFile)}
                    controls
                    className="max-w-full h-48 rounded-lg"
                  />
                ) : (
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-600">{selectedFile?.name || 'File uploaded'}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingItem ? 'Update Content' : 'Create Content'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentForm;
