import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dbService } from '../../services/supabase';
import { 
  ArrowLeft, 
  Users, 
  Plus, 
  MessageSquare, 
  Heart,
  Crown,
  Globe,
  Lock,
  Send,
  MoreHorizontal,
  UserPlus,
  UserMinus,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { joinGroup, leaveGroup } from '../../store/slices/groupsSlice';

const GroupDetail = ({ onClose }) => {
  const dispatch = useDispatch();
  const { currentGroup, userGroups } = useSelector((state) => state.groups);
  const { user } = useSelector((state) => state.auth);
  const [newPost, setNewPost] = useState('');
  const [showMembers, setShowMembers] = useState(false);

  if (!currentGroup) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No group selected</p>
      </div>
    );
  }

  const isUserMember = userGroups.includes(currentGroup.id);
  const isCreator = currentGroup.creator_id === user.id;

  // Mock posts data
  const posts = [
    {
      id: 1,
      author: 'Sarah M.',
      author_id: 2,
      content: 'Had a great breakthrough this week using the breathing techniques we discussed. Thank you all for your support!',
      timestamp: '2024-01-20T14:30:00Z',
      likes: 8,
      replies: 3
    },
    {
      id: 2,
      author: 'Mike D.',
      content: 'Celebrating small wins - got out of bed early today and went for a walk! These daily check-ins really help motivate me.',
      timestamp: '2024-01-19T09:15:00Z',
      likes: 12,
      replies: 5
    },
    {
      id: 3,
      author: 'Dr. Sarah Johnson',
      author_id: 1,
      content: 'Remember everyone, progress isn\'t always linear. Be patient with yourselves and celebrate every small step forward. ❤️',
      timestamp: '2024-01-18T16:45:00Z',
      likes: 15,
      replies: 7
    }
  ];

  const handleJoinGroup = () => {
    const joinGroupAsync = async () => {
      try {
        const { error } = await dbService.joinGroup(currentGroup.id, user.id);
        if (error) throw error;
        
        dispatch(joinGroup(currentGroup));
      } catch (error) {
        console.error('Error joining group:', error);
      }
    };
    
    joinGroupAsync();
  };

  const handleLeaveGroup = () => {
    if (window.confirm('Are you sure you want to leave this group?')) {
      const leaveGroupAsync = async () => {
        try {
          const { error } = await dbService.leaveGroup(currentGroup.id, user.id);
          if (error) throw error;
          
          dispatch(leaveGroup(currentGroup.id));
        } catch (error) {
          console.error('Error leaving group:', error);
        }
      };
      
      leaveGroupAsync();
    }
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      const createPost = async () => {
        try {
          const postData = {
            group_id: currentGroup.id,
            author_id: user.id,
            content: newPost.trim()
          };
          
          const { data, error } = await dbService.createGroupPost(postData);
          if (error) throw error;
          
          setNewPost('');
          // You might want to refresh posts here or add to local state
        } catch (error) {
          console.error('Error creating post:', error);
        }
      };
      
      createPost();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onClose}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to groups</span>
        </button>
      </div>

      {/* Group Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{currentGroup.name}</h1>
                {currentGroup.is_private ? (
                  <Lock className="h-6 w-6 text-gray-400" />
                ) : (
                  <Globe className="h-6 w-6 text-green-500" />
                )}
              </div>
              
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {currentGroup.category}
                </span>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{currentGroup.member_count} members</span>
                </div>
                <div className="flex items-center">
                  <Crown className="h-4 w-4 mr-1" />
                  <span>Created by {currentGroup.creator?.full_name || 'Unknown'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{format(new Date(currentGroup.created_at), 'MMM dd, yyyy')}</span>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                {currentGroup.description}
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              {isUserMember ? (
                <>
                  <button
                    onClick={handleLeaveGroup}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <UserMinus className="h-4 w-4" />
                    <span>Leave Group</span>
                  </button>
                  <button
                    onClick={() => setShowMembers(!showMembers)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Users className="h-4 w-4" />
                    <span>View Members</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleJoinGroup}
                  className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Join Group</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Members Panel */}
      {showMembers && isUserMember && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Members</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Mock member data */}
            {['Dr. Sarah Johnson', 'Sarah M.', 'Mike D.', 'Jennifer L.', 'Alex R.'].map((member, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {member.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{member}</p>
                  {index === 0 && (
                    <p className="text-xs text-gray-500">Group Creator</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Post Form */}
      {isUserMember && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <form onSubmit={handlePostSubmit}>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {user.user_metadata.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your thoughts, experiences, or offer support..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-gray-500">
                    Remember to be respectful and supportive
                  </p>
                  <button
                    type="submit"
                    disabled={!newPost.trim()}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Posts */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(post.timestamp), 'MMM dd, yyyy • h:mm a')}
                  </p>
                </div>
              </div>
              <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            
            <p className="text-gray-800 mb-4 leading-relaxed">
              {post.content}
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <button className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                <Heart className="h-4 w-4" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                <MessageSquare className="h-4 w-4" />
                <span>{post.replies} replies</span>
              </button>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <MessageSquare className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600">
              {isUserMember
                ? 'Be the first to share something with the group!'
                : 'Join the group to see posts and participate in discussions.'
              }
            </p>
          </div>
        )}
      </div>

      {!isUserMember && (
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">
            Join the conversation
          </h3>
          <p className="text-purple-700 mb-4">
            Become a member to participate in discussions and connect with others in this community.
          </p>
          <button
            onClick={handleJoinGroup}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Join Group</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupDetail;