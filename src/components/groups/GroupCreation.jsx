import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  ArrowLeft, 
  Save, 
  Users, 
  Globe, 
  Lock, 
  Tag,
  FileText,
  Loader
} from 'lucide-react';
import { createGroup } from '../../store/slices/groupsSlice';
import { dbService } from '../../services/supabase';

const GroupCreation = ({ onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [saving, setSaving] = useState(false);

  const groupValidation = Yup.object({
    name: Yup.string()
      .min(3, 'Group name must be at least 3 characters')
      .max(100, 'Group name must be less than 100 characters')
      .required('Group name is required'),
    description: Yup.string()
      .min(20, 'Description must be at least 20 characters')
      .max(500, 'Description must be less than 500 characters')
      .required('Description is required'),
    category: Yup.string()
      .required('Category is required'),
  });

  const categories = [
    'Anxiety',
    'Depression',
    'PTSD/Trauma',
    'Bipolar Disorder',
    'Eating Disorders',
    'Addiction',
    'Family Support',
    'Couples/Relationships',
    'Grief & Loss',
    'Wellness',
    'Other',
  ];

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const groupData = {
        name: values.name,
        description: values.description,
        category: values.category,
        is_private: values.is_private,
        creator_id: user.id,
      };

      const { data, error } = await dbService.createGroup(groupData);
      if (error) throw error;
      
      dispatch(createGroup(data));
      
      onClose();
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Support Group</h1>
            <p className="mt-2 text-gray-600">
              Build a community where people can connect and support each other
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <Formik
          initialValues={{
            name: '',
            description: '',
            category: '',
            is_private: false,
          }}
          validationSchema={groupValidation}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting }) => (
            <Form className="space-y-6">
              {/* Group Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    placeholder="e.g., Anxiety Support Circle"
                    className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    as="select"
                    name="category"
                    id="category"
                    className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Field>
                </div>
                <ErrorMessage name="category" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <Field
                    as="textarea"
                    name="description"
                    id="description"
                    rows={4}
                    placeholder="Describe the purpose of your group, what kind of support you'll provide, and what members can expect..."
                    className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  />
                </div>
                <ErrorMessage name="description" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              {/* Privacy Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Privacy Settings
                </label>
                <div className="space-y-4">
                  <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <Field
                      type="radio"
                      name="is_private"
                      value={false}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <Globe className="h-4 w-4 text-green-600 mr-2" />
                        <span className="font-medium text-gray-900">Public Group</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Anyone can find and join this group. All posts are visible to members.
                      </p>
                    </div>
                  </label>
                  
                  <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <Field
                      type="radio"
                      name="is_private"
                      value={true}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <Lock className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="font-medium text-gray-900">Private Group</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Only invited members can join. Group content is not visible to non-members.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Group Guidelines</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Maintain respect and kindness in all interactions</li>
                  <li>• Protect member privacy and confidentiality</li>
                  <li>• No professional medical advice - encourage seeking professional help</li>
                  <li>• Keep discussions relevant to the group's purpose</li>
                  <li>• Report inappropriate content to moderators</li>
                </ul>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || saving}
                  className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Create Group</span>
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default GroupCreation;