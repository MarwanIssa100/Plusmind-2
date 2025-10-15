import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Tag,
  Lock,
  X,
  Loader
} from 'lucide-react';
import { noteValidation } from '../../utils/validation';
import { addNote, updateNote } from '../../store/slices/notesSlice';
import { dbService } from '../../services/supabase';
import { encryptNote } from '../../utils/encryption';

const NoteEditor = ({ note, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isPreview, setIsPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState(note?.tags || []);
  const [newTag, setNewTag] = useState('');
  const contentRef = useRef(null);

  const initialValues = {
    title: note?.title || '',
    content: note?.content || '',
  };

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const encryptedContent = encryptNote(values.content);
      
      const noteData = {
        title: values.title,
        encrypted_content: encryptedContent,
        tags: tags,
        patient_id: user.id,
      };

      if (note) {
        // Update existing note
        noteData.id = note.id;
        const { data, error } = await dbService.updatePrivateNote(noteData);
        if (error) throw error;
        dispatch(updateNote({ ...data, content: values.content }));
      } else {
        // Create new note
        const { data, error } = await dbService.createPrivateNote(noteData);
        if (error) throw error;
        
        dispatch(addNote({ ...data, content: values.content }));
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {note ? 'Edit Note' : 'Create New Note'}
              </h1>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <Lock className="h-4 w-4 mr-1" />
                <span>This note is encrypted and private to you</span>
              </div>
            </div>
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
        validationSchema={noteValidation}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Title */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <Field
                type="text"
                name="title"
                placeholder="Enter note title..."
                className="w-full text-xl font-semibold text-gray-900 placeholder-gray-400 border-none outline-none resize-none"
              />
              <ErrorMessage name="title" component="div" className="mt-2 text-sm text-red-600" />
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Tag className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">Tags</h3>
              </div>
              
              {/* Existing tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add new tag */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                {isPreview ? (
                  <div 
                    className="prose max-w-none min-h-[400px]"
                    dangerouslySetInnerHTML={{ __html: values.content }}
                  />
                ) : (
                  <textarea
                    value={values.content}
                    onChange={(e) => setFieldValue('content', e.target.value)}
                    placeholder="Write your thoughts, reflections, or any notes you want to keep private..."
                    className="w-full min-h-[400px] outline-none resize-none text-gray-900 placeholder-gray-400"
                  />
                )}
              </div>
            </div>

            <ErrorMessage name="content" component="div" className="text-sm text-red-600" />

            {/* Footer Actions */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                All notes are automatically encrypted before being saved
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
                  className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>{note ? 'Update Note' : 'Save Note'}</span>
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

export default NoteEditor;