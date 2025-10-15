import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Search, Tag, Lock, CreditCard as Edit3, Trash2, Calendar, StickyNote, Filter } from 'lucide-react';
import { format } from 'date-fns';
import NoteEditor from './NoteEditor';
import { 
  fetchNotesStart, 
  fetchNotesSuccess, 
  fetchNotesFailure,
  setSearchTerm,
  setSelectedTags,
  deleteNote
} from '../../store/slices/notesSlice';
import { dbService } from '../../services/supabase';
import { decryptNote } from '../../utils/encryption';

const PrivateNotes = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notes, loading, error, searchTerm, selectedTags } = useSelector((state) => state.notes);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    dispatch(fetchNotesStart());
    try {
      const { data, error } = await dbService.getPrivateNotes(user.id);
      if (error) throw error;
      
      // Decrypt note content
      const decryptedNotes = (data || []).map(note => ({
        ...note,
        content: decryptNote(note.encrypted_content),
      }));
      
      dispatch(fetchNotesSuccess(decryptedNotes));
    } catch (err) {
      dispatch(fetchNotesFailure(err.message));
    }
  };

  const handleCreateNote = () => {
    setSelectedNote(null);
    setShowEditor(true);
  };

  const handleEditNote = (note) => {
    setSelectedNote(note);
    setShowEditor(true);
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      try {
        const { error } = await dbService.deletePrivateNote(noteId);
        if (error) throw error;
        dispatch(deleteNote(noteId));
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setSelectedNote(null);
    loadNotes(); // Refresh notes after editor closes
  };

  // Get all unique tags
  const allTags = [...new Set(notes.flatMap(note => note.tags || []))];

  // Filter notes based on search term and selected tags
  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchTerm || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => note.tags?.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  if (showEditor) {
    return (
      <NoteEditor
        note={selectedNote}
        onClose={handleCloseEditor}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Private Notes</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <Lock className="h-4 w-4 mr-2" />
              <p>Your notes are encrypted and completely private to you</p>
            </div>
          </div>
          <button
            onClick={handleCreateNote}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Note
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your notes..."
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Tag Filters */}
        {showFilters && allTags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      dispatch(setSelectedTags(selectedTags.filter(t => t !== tag)));
                    } else {
                      dispatch(setSelectedTags([...selectedTags, tag]));
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <button
                onClick={() => dispatch(setSelectedTags([]))}
                className="mt-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                    {note.title}
                  </h3>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div 
                  className="text-gray-600 text-sm mb-4 line-clamp-4"
                  dangerouslySetInnerHTML={{ 
                    __html: note.content.length > 150 
                      ? note.content.substring(0, 150) + '...' 
                      : note.content 
                  }}
                />

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{note.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(note.updated_at), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center">
                    <Lock className="h-3 w-3 mr-1" />
                    <span>Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <StickyNote className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedTags.length > 0 ? 'No matching notes' : 'No notes yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedTags.length > 0 
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Start writing your first private note to track your thoughts and progress.'
              }
            </p>
            {(!searchTerm && selectedTags.length === 0) && (
              <button
                onClick={handleCreateNote}
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Note
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateNotes;