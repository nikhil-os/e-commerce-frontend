'use client';
import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { apiFetch, buildApiUrl } from '../utils/apiClient';

const ImageUploadModal = ({
  isOpen,
  onClose,
  categorySlug,
  categoryName,
  currentImage,
  onImageUpdate,
}) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const toast = useToast();

  const compressImage = (file, maxWidth = 400, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = (width * maxWidth) / height;
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (10MB limit before compression)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
        return;
      }

      try {
        // Compress the image
        const compressedFile = await compressImage(file);
        setUploadedFile(compressedFile);

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target.result);
        reader.readAsDataURL(compressedFile);

        toast.info('📏 Image optimized for upload');
      } catch (error) {
        console.error('Image compression error:', error);
        // Fallback to original file if compression fails
        setUploadedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    if (url && isValidUrl(url)) {
      setPreviewUrl(url);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const uploadToCloudinary = async (file) => {
    // Check if Cloudinary is configured
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset =
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
      'ecommerce_categories';
    const uploadFolder =
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER ||
      'ecommerce/categories';

    if (!cloudName) {
      // Fallback: Convert to base64 for demo purposes
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset); // Ensure this preset exists in Cloudinary
    formData.append('folder', uploadFolder);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      // Fallback to base64 if Cloudinary fails
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSave = async () => {
    setUploading(true);
    try {
      let finalImageUrl = '';

      if (activeTab === 'upload' && uploadedFile) {
        // Upload to Cloudinary
        finalImageUrl = await uploadToCloudinary(uploadedFile);
      } else if (activeTab === 'url' && imageUrl) {
        if (!isValidUrl(imageUrl)) {
          toast.error('Please enter a valid image URL');
          setUploading(false);
          return;
        }
        finalImageUrl = imageUrl;
      } else {
        toast.error('Please select an image or enter a URL');
        setUploading(false);
        return;
      }

      // Update category image via API
      const response = await apiFetch(
        buildApiUrl(`api/admin/categories/${categorySlug}/image`),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl: finalImageUrl }),
        }
      );

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error(
            'Image file is too large. Please try a smaller image or use an image URL instead.'
          );
        } else if (response.status === 401) {
          throw new Error(
            'You must be logged in as an admin to update images.'
          );
        } else if (response.status === 403) {
          throw new Error(
            "You don't have permission to update category images."
          );
        }
        throw new Error(`Failed to update category image (${response.status})`);
      }

      const data = await response.json();

      // Update parent component
      onImageUpdate(categorySlug, finalImageUrl);

      // Show success toast
      toast.success(`✨ ${categoryName} image updated successfully!`);

      // Close modal
      onClose();
    } catch (error) {
      console.error('Error updating image:', error);

      // Provide specific error messages based on error content
      if (error.message.includes('too large')) {
        toast.error('📏 ' + error.message);
      } else if (
        error.message.includes('permission') ||
        error.message.includes('admin')
      ) {
        toast.error('🔒 ' + error.message);
      } else if (
        error.message.includes('network') ||
        error.name === 'NetworkError'
      ) {
        toast.error(
          '🌐 Network error. Please check your connection and try again.'
        );
      } else {
        toast.error(
          '❌ ' + (error.message || 'Failed to update image. Please try again.')
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const resetModal = () => {
    setActiveTab('upload');
    setImageUrl('');
    setUploadedFile(null);
    setPreviewUrl(currentImage);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8f6690] to-[#b278a8] text-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Update Category Image</h3>
            <button
              onClick={() => {
                resetModal();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              ×
            </button>
          </div>
          <p className="text-white/90 text-sm mt-1">{categoryName}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Preview */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
            <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto flex items-center justify-center overflow-hidden border-4 border-gray-200">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <svg
                    className="w-8 h-8 mx-auto mb-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs">No image</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📁 Upload File
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'url'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🔗 Image URL
            </button>
          </div>

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Image File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-gray-400 mb-2">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">
                    {uploadedFile
                      ? uploadedFile.name
                      : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, JPEG up to 5MB
                  </p>
                </label>
              </div>
            </div>
          )}

          {/* URL Tab */}
          {activeTab === 'url' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={handleUrlChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a direct link to an image file
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3">
          <button
            onClick={() => {
              resetModal();
              onClose();
            }}
            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={uploading || (!uploadedFile && !imageUrl)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#8f6690] to-[#b278a8] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              'Save Image'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
