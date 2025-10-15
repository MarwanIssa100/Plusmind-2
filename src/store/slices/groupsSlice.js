import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  groups: [],
  currentGroup: null,
  userGroups: [],
  loading: false,
  error: null,
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    fetchGroupsStart: (state) => {
      state.loading = true;
    },
    fetchGroupsSuccess: (state, action) => {
      state.loading = false;
      state.groups = action.payload;
    },
    fetchGroupsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentGroup: (state, action) => {
      state.currentGroup = action.payload;
    },
    createGroup: (state, action) => {
      state.groups.push(action.payload);
      state.userGroups.push(action.payload);
    },
    joinGroup: (state, action) => {
      state.userGroups.push(action.payload);
    },
    leaveGroup: (state, action) => {
      state.userGroups = state.userGroups.filter(group => group.id !== action.payload);
    },
    setUserGroups: (state, action) => {
      state.userGroups = action.payload;
    },
  },
});

export const {
  fetchGroupsStart,
  fetchGroupsSuccess,
  fetchGroupsFailure,
  setCurrentGroup,
  createGroup,
  joinGroup,
  leaveGroup,
  setUserGroups,
} = groupsSlice.actions;
export default groupsSlice.reducer;