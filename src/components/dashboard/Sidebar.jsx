import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Heart, 
  BookOpen, 
  StickyNote, 
  UserCheck, 
  Bot, 
  Users, 
  LogOut,
  Menu,
  X,
  Calendar as CalendarIcon
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { authService } from '../../services/supabase';

const Sidebar = ({ isOpen, setIsOpen }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userType } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await authService.signOut();
    dispatch(logout());
    navigate('/');
  };
  
  const menuItems = [
    {
      icon: BookOpen,
      label: 'Blog',
      path: '/dashboard/blog',
      accessible: true,
    },
    {
      icon: UserCheck,
      label: 'My Profile',
      path: '/dashboard/profile',
      accessible: userType === 'therapist',
    },
    {
      icon: StickyNote,
      label: 'Private Notes',
      path: '/dashboard/notes',
      accessible: userType === 'patient',
    },
    {
      icon: UserCheck,
      label: 'Doctors',
      path: '/dashboard/doctors',
      accessible: true,
    },
    {
      icon: CalendarIcon,
      label: 'Appointments',
      path: '/dashboard/appointments',
      accessible: true,
    },
    {
      icon: Bot,
      label: 'AI Chatbot',
      path: '/dashboard/chatbot',
      accessible: true,
    },
    {
      icon: Users,
      label: 'Groups',
      path: '/dashboard/groups',
      accessible: true,
    },
  ].filter(item => item.accessible);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-xl border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-64
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">MindCare</h1>
                <p className="text-xs text-gray-500 capitalize">{userType}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-medium">
              {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                  ${active 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;