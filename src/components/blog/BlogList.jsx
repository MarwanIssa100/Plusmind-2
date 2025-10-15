import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Heart, MessageCircle, Search, Filter, Plus, Calendar, User, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import BlogEditor from './BlogEditor';
import { fetchPostsStart, fetchPostsSuccess, fetchPostsFailure, updateFilters } from '../../store/slices/blogSlice';
import { dbService } from '../../services/supabase';

const BlogList = () => {
  const dispatch = useDispatch();
  const { posts, loading, error, filters } = useSelector((state) => state.blog);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    dispatch(fetchPostsStart());
    try {
      const { data, error } = await dbService.getBlogPosts();
      if (error) throw error;
      dispatch(fetchPostsSuccess(data || []));
    } catch (err) {
      dispatch(fetchPostsFailure(err.message));
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = !filters.searchTerm || 
      post.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesAuthor = !filters.author || 
      post.profiles?.full_name.toLowerCase().includes(filters.author.toLowerCase());
    
    return matchesSearch && matchesAuthor;
  });

  const handleCreatePost = () => {
    setSelectedPost(null);
    setShowEditor(true);
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setSelectedPost(null);
    loadPosts(); // Refresh posts after editor closes
  };

  if (showEditor) {
    return (
      <BlogEditor
        post={selectedPost}
        onClose={handleCloseEditor}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Blog</h1>
            <p className="mt-2 text-gray-600">
              Share your experiences, insights, and support others in their mental health journey
            </p>
          </div>
          <button
            onClick={handleCreatePost}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5 mr-2" />
            Write a Post
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={filters.searchTerm}
                onChange={(e) => dispatch(updateFilters({ searchTerm: e.target.value }))}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <input
              type="text"
              placeholder="Filter by author..."
              value={filters.author}
              onChange={(e) => dispatch(updateFilters({ author: e.target.value }))}
              className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {post.profiles?.full_name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">
                          {post.profiles?.full_name || 'Anonymous'}
                        </p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          post.profiles?.user_type === 'therapist' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {post.profiles?.user_type === 'therapist' ? 'Therapist' : 'Patient'}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(post.created_at), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h2>

                <div 
                  className="text-gray-600 mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ 
                    __html: post.content.length > 200 
                      ? post.content.substring(0, 200) + '...' 
                      : post.content 
                  }}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="h-5 w-5" />
                      <span className="text-sm">{post.likes_count || 0}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm">{post.comments?.length || 0}</span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleEditPost(post)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    Read More
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-6">
              Be the first to share your story and inspire others in the community.
            </p>
            <button
              onClick={handleCreatePost}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="h-5 w-5 mr-2" />
              Write Your First Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;