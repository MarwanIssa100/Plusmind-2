import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Users, 
  Plus, 
  Search, 
  UserPlus, 
  MessageSquare, 
  Calendar,
  Crown,
  Lock,
  Globe
} from 'lucide-react';
import { format } from 'date-fns';
import GroupCreation from './GroupCreation';
import GroupDetail from './GroupDetail';
import { 
  fetchGroupsStart, 
  fetchGroupsSuccess, 
  fetchGroupsFailure,
  setCurrentGroup,
  setUserGroups 
} from '../../store/slices/groupsSlice';
import { dbService } from '../../services/supabase';

const GroupsList = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { groups, userGroups, loading, error } = useSelector((state) => state.groups);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showGroupDetail, setShowGroupDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'my-groups', 'available'

  // Mock data for demonstration
  const mockGroups = [
    {
      id: 1,
      name: 'Anxiety Support Circle',
      description: 'A safe space for individuals dealing with anxiety disorders to share experiences and coping strategies.',
      creator_id: 1,
      created_at: '2024-01-15T10:00:00Z',
      members: [1, 2, 3, 5, 8],
      member_count: 5,
      is_private: false,
      category: 'Anxiety',
      posts: [
        {
          id: 1,
          author: 'Sarah M.',
          content: 'Had a great breakthrough this week using the breathing techniques we discussed.',
          timestamp: '2024-01-20T14:30:00Z',
          likes: 8
        }
      ],
      profiles: {
        full_name: 'Dr. Sarah Johnson'
      }
    },
    {
      id: 2,
      name: 'Depression Recovery Warriors',
      description: 'Supporting each other through depression recovery with shared stories, resources, and encouragement.',
      creator_id: 2,
      created_at: '2024-01-10T15:30:00Z',
      members: [1, 2, 4, 6, 7, 9, 10],
      member_count: 7,
      is_private: false,
      category: 'Depression',
      posts: [
        {
          id: 2,
          author: 'Mike D.',
          content: 'Celebrating small wins - got out of bed early today and went for a walk!',
          timestamp: '2024-01-19T09:15:00Z',
          likes: 12
        }
      ],
      profiles: {
        full_name: 'Dr. Michael Chen'
      }
    },
    {
      id: 3,
      name: 'PTSD Support Network',
      description: 'A community for trauma survivors to connect, heal, and support each other in a judgment-free environment.',
      creator_id: 3,
      created_at: '2024-01-05T12:00:00Z',
      members: [3, 5, 11, 12],
      member_count: 4,
      is_private: true,
      category: 'PTSD/Trauma',
      posts: [],
      profiles: {
        full_name: 'Dr. Emily Rodriguez'
      }
    },
    {
      id: 4,
      name: 'Mindfulness & Meditation',
      description: 'Exploring mindfulness practices, meditation techniques, and living in the present moment.',
      creator_id: 4,
      created_at: '2024-01-12T16:45:00Z',
      members: [1, 4, 6, 8, 13, 14, 15, 16],
      member_count: 8,
      is_private: false,
      category: 'Wellness',
      posts: [
        {
          id: 3,
          author: 'Jennifer L.',
          content: 'Today\'s 10-minute morning meditation was exactly what I needed. Thank you for the guided session link!',
          timestamp: '2024-01-21T08:00:00Z',
          likes: 6
        }
      ],
      profiles: {
        full_name: 'Dr. James Wilson'
      }
    },
  ];

  const mockUserGroups = [1, 2, 4]; // Groups the current user is a member of

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    dispatch(fetchGroupsStart());
    try {
      const { data, error } = await dbService.getGroups();
      if (error) throw error;
      
      // Get user's groups
      const { data: userGroupsData, error: userGroupsError } = await dbService.getUserGroups(user.id);
      if (userGroupsError) throw userGroupsError;
      
      // If no real data, use mock data for demo
      const allGroups = data && data.length > 0 ? data : mockGroups;
      const userGroupIds = userGroupsData ? userGroupsData.map(g => g.id) : mockUserGroups;
      
      dispatch(fetchGroupsSuccess(allGroups));
      dispatch(setUserGroups(userGroupIds));
    } catch (err) {
      dispatch(fetchGroupsFailure(err.message));
    }
  };

  const handleGroupSelect = (group) => {
    dispatch(setCurrentGroup(group));
    setShowGroupDetail(true);
  };

  const handleCloseGroupDetail = () => {
    setShowGroupDetail(false);
    dispatch(setCurrentGroup(null));
  };

  const handleCloseCreateGroup = () => {
    setShowCreateGroup(false);
    loadGroups(); // Refresh groups after creation
  };

  const isUserMember = (groupId) => {
    return userGroups.includes(groupId);
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = !searchTerm || 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' ||
      (filter === 'my-groups' && isUserMember(group.id)) ||
      (filter === 'available' && !isUserMember(group.id));
    
    return matchesSearch && matchesFilter;
  });

  if (showCreateGroup) {
    return <GroupCreation onClose={handleCloseCreateGroup} />;
  }

  if (showGroupDetail) {
    return <GroupDetail onClose={handleCloseGroupDetail} />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support Groups</h1>
            <p className="mt-2 text-gray-600">
              Connect with others who understand your journey and find community support
            </p>
          </div>
          <button
            onClick={() => setShowCreateGroup(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Group
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Groups
            </button>
            <button
              onClick={() => setFilter('my-groups')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'my-groups'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              My Groups
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'available'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Available
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleGroupSelect(group)}
          >
            <div className="p-6">
              {/* Group Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {group.name}
                  </h3>
                  {group.is_private ? (
                    <Lock className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Globe className="h-4 w-4 text-green-500" />
                  )}
                </div>
                {isUserMember(group.id) && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                    Member
                  </span>
                )}
              </div>

              {/* Category */}
              <div className="mb-3">
                <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  {group.category}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {group.description}
              </p>

              {/* Group Stats */}
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{group.member_count} members</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{group.posts?.length || 0} posts</span>
                  </div>
                </div>
              </div>

              {/* Creator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <Crown className="h-3 w-3 mr-1" />
                  <span>Created by {group.creator?.full_name || 'Unknown'}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {format(new Date(group.created_at), 'MMM dd')}
                </span>
              </div>

              {/* Latest Activity */}
              {group.posts && group.posts.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Latest activity:</p>
                    <p className="text-sm text-gray-800 line-clamp-2">
                      "{group.posts[0].content}"
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        by {group.posts[0].author}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(group.posts[0].timestamp), 'MMM dd')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-4">
                {isUserMember(group.id) ? (
                  <button className="w-full bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 transition-colors">
                    View Group
                  </button>
                ) : (
                  <button className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    <UserPlus className="h-4 w-4" />
                    <span>Join Group</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredGroups.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <Users className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'my-groups' 
              ? "You haven't joined any groups yet"
              : searchTerm 
              ? 'No groups found'
              : 'No groups available'
            }
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'my-groups'
              ? 'Join some groups to connect with others who share similar experiences.'
              : searchTerm
              ? 'Try adjusting your search terms to find what you\'re looking for.'
              : 'Be the first to create a support group and build a community.'
            }
          </p>
          <button
            onClick={() => setShowCreateGroup(true)}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Group
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupsList;