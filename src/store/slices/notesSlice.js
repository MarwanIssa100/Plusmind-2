import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notes: [],
  currentNote: null,
  loading: false,
  error: null,
  searchTerm: '',
  selectedTags: [],
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    fetchNotesStart: (state) => {
      state.loading = true;
    },
    fetchNotesSuccess: (state, action) => {
      state.loading = false;
      state.notes = action.payload;
    },
    fetchNotesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentNote: (state, action) => {
      state.currentNote = action.payload;
    },
    addNote: (state, action) => {
      state.notes.unshift(action.payload);
    },
    updateNote: (state, action) => {
      const index = state.notes.findIndex(note => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedTags: (state, action) => {
      state.selectedTags = action.payload;
    },
  },
});

export const {
  fetchNotesStart,
  fetchNotesSuccess,
  fetchNotesFailure,
  setCurrentNote,
  addNote,
  updateNote,
  deleteNote,
  setSearchTerm,
  setSelectedTags,
} = notesSlice.actions;
export default notesSlice.reducer;