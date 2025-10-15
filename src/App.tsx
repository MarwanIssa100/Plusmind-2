import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store/store';
import { loginSuccess } from './store/slices/authSlice';
import { authService } from './services/supabase';

// Components
import Landing from './pages/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import BlogList from './components/blog/BlogList';
import PrivateNotes from './components/notes/PrivateNotes';
import DoctorsList from './components/doctors/DoctorsList';
import AIChatbot from './components/chatbot/AIChatbot';
import GroupsList from './components/groups/GroupsList';
import AppointmentsList from './components/appointments/AppointmentsList';
import TherapistProfile from './components/therapist/TherapistProfile';
import { HMSRoomProvider } from '@100mslive/react-sdk';

const queryClient = new QueryClient();

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          dispatch(loginSuccess({
            user,
            userType: user.user_metadata.user_type
          }));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuthState();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="profile" element={<TherapistProfile />} />
          <Route path="notes" element={<PrivateNotes />} />
          <Route path="doctors" element={<DoctorsList />} />
          <Route path="chatbot" element={<AIChatbot />} />
          <Route path="groups" element={<GroupsList />} />
          <Route path="appointments" element={
            <HMSRoomProvider>
              <AppointmentsList />
            </HMSRoomProvider>
          } />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;