import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  doctors: [],
  selectedDoctor: null,
  appointments: [],
  loading: false,
  error: null,
  filters: {
    specialization: '',
    minRating: 0,
    availability: '',
  },
};

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    fetchDoctorsStart: (state) => {
      state.loading = true;
    },
    fetchDoctorsSuccess: (state, action) => {
      state.loading = false;
      state.doctors = action.payload;
    },
    fetchDoctorsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    bookAppointment: (state, action) => {
      state.appointments.push(action.payload);
    },
    fetchAppointmentsSuccess: (state, action) => {
      state.appointments = action.payload;
    },
  },
});

export const {
  fetchDoctorsStart,
  fetchDoctorsSuccess,
  fetchDoctorsFailure,
  setSelectedDoctor,
  updateFilters,
  bookAppointment,
  fetchAppointmentsSuccess,
} = doctorsSlice.actions;
export default doctorsSlice.reducer;