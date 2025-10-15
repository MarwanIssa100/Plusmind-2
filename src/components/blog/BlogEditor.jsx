import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Bold, 
  Italic, 
  List, 
  Quote,
  Type,
  Loader
} from 'lucide-react';
import { blogPostValidation } from '../../utils/validation';
import { addPost, updatePost } from '../../store/slices/blogSlice';
import { dbService } from '../../services/supabase';

const BlogEditor = ({ post, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isPreview, setIsPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const contentRef = useRef(null);

  const initialValues = {
    title: post?.title || '',
    content: post?.content || '',
    status: post?.status || 'published',
  };

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const postData = {
        title: values.title,
        content: values.content,
        status: values.status,
        author_id: user.id,
      };

      if (post) {
        // Update existing post
        postData.id = post.id;
        const { data, error } = await dbService.updateBlogPost(postData);
        if (error) throw error;
        dispatch(updatePost(data));
      } else {
        // Create new post
        
        const { data, error } = await dbService.createBlogPost(postData);
        if (error) throw error;
        
        dispatch(addPost(data));
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setSaving(false);
    }
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    contentRef.current.focus();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {post ? 'Edit Post' : 'Create New Post'}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>{isPreview ? 'Edit' : 'Preview'}</span>
            </button>
          </div>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={blogPostValidation}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Title */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <Field
                type="text"
                name="title"
                placeholder="Enter your post title..."
                className="w-full text-2xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none resize-none"
              />
              <ErrorMessage name="title" component="div" className="mt-2 text-sm text-red-600" />
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {!isPreview && (
                <div className="border-b border-gray-200 p-4">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => formatText('bold')}
                      className="p-2 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Bold className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('italic')}
                      className="p-2 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Italic className="h-4 w-4 text-gray-600" />
                    </button>
                    <div className="w-px h-6 bg-gray-300" />
                    <button
                      type="button"
                      onClick={() => formatText('insertUnorderedList')}
                      className="p-2 rounded hover:bg-gray-100 transition-colors"
                    >
                      <List className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('formatBlock', 'blockquote')}
                      className="p-2 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Quote className="h-4 w-4 text-gray-600" />
                    </button>
                    <div className="w-px h-6 bg-gray-300" />
                    <select
                      onChange={(e) => formatText('formatBlock', e.target.value)}
                      className="text-sm border-none outline-none bg-transparent"
                    >
                      <option value="p">Normal</option>
                      <option value="h1">Heading 1</option>
                      <option value="h2">Heading 2</option>
                      <option value="h3">Heading 3</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="p-6">
                {isPreview ? (
                  <div 
                    className="prose max-w-none min-h-[400px]"
                    dangerouslySetInnerHTML={{ __html: values.content }}
                  />
                ) : (
                  <div
                    ref={contentRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => setFieldValue('content', e.target.innerHTML)}
                    className="min-h-[400px] outline-none prose max-w-none"
                    placeholder="Tell your story, share your insights, or offer support to the community..."
                    dangerouslySetInnerHTML={{ __html: values.content }}
                  />
                )}
              </div>
            </div>

            <ErrorMessage name="content" component="div" className="text-sm text-red-600" />

            {/* Footer Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="status"
                    value="published"
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Publish immediately</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Field
                    type="radio"
                    name="status"
                    value="draft"
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Save as draft</span>
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>{post ? 'Update' : 'Publish'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BlogEditor;