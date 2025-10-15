import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  selectIsConnectedToRoom,
  selectLocalPeer,
  selectPeers,
  selectRoomState,
  useHMSActions,
  useHMSStore,
} from '@100mslive/react-sdk';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  Settings,
  MessageSquare,
  Users,
  Clock,
  X
} from 'lucide-react';
import { format } from 'date-fns';

const VideoSession = ({ appointment, onEndSession }) => {
  const { user } = useSelector((state) => state.auth);
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const localPeer = useHMSStore(selectLocalPeer);
  const peers = useHMSStore(selectPeers);
  const roomState = useHMSStore(selectRoomState);
  
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionStartTime] = useState(new Date());
  const [sessionDuration, setSessionDuration] = useState(0);
  const [joining, setJoining] = useState(true);
  const [error, setError] = useState(null);
  
  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Update session duration every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(Math.floor((new Date() - sessionStartTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  // Join room on component mount
  useEffect(() => {
    const joinRoom = async () => {
      setJoining(true);
      setError(null);
      
      try {
        // Import dbService dynamically to avoid circular imports
        const { dbService } = await import('../../services/supabase');
        
        // Generate HMS token for this appointment
        const tokenData = await dbService.generateHMSToken(
          appointment.id,
          user.id,
          user.user_metadata.full_name || user.email,
          user.user_metadata.user_type
        );
        
        await hmsActions.join({
          authToken: tokenData.token,
          userName: user.user_metadata.full_name || user.email,
          settings: {
            isAudioMuted: false,
            isVideoMuted: false,
          },
        });
        
        setJoining(false);
      } catch (error) {
        console.error('Failed to join video session:', error);
        setError(error.message);
        setJoining(false);
      }
    };

    joinRoom();

    return () => {
      if (isConnected) {
        hmsActions.leave();
      }
    };
  }, [hmsActions, appointment.id, user, isConnected]);

  // Handle audio toggle
  const toggleAudio = async () => {
    try {
      await hmsActions.setLocalAudioEnabled(isAudioMuted);
      setIsAudioMuted(!isAudioMuted);
    } catch (error) {
      console.error('Failed to toggle audio:', error);
    }
  };

  // Handle video toggle
  const toggleVideo = async () => {
    try {
      await hmsActions.setLocalVideoEnabled(isVideoMuted);
      setIsVideoMuted(!isVideoMuted);
    } catch (error) {
      console.error('Failed to toggle video:', error);
    }
  };

  // Handle end session
  const handleEndSession = async () => {
    try {
      await hmsActions.leave();
      onEndSession();
    } catch (error) {
      console.error('Failed to end session:', error);
      onEndSession();
    }
  };

  // Send chat message
  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: user.user_metadata.full_name || user.email,
        text: newMessage.trim(),
        timestamp: new Date(),
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  // Format session duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const remotePeer = peers.find(peer => peer.id !== localPeer?.id);

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-lg font-semibold">
              Therapy Session
            </h2>
            <p className="text-sm text-gray-300">
              {appointment.therapist?.full_name || appointment.patient?.full_name}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(sessionDuration)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
          <button
            onClick={handleEndSession}
            className="p-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-black">
        {/* Remote Video (Main) */}
        <div className="w-full h-full relative">
          {remotePeer?.videoTrack ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              muted={false}
              className="w-full h-full object-cover"
              onLoadedMetadata={() => {
                if (remoteVideoRef.current && remotePeer.videoTrack) {
                  hmsActions.attachVideo(remotePeer.videoTrack.id, remoteVideoRef.current);
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-12 w-12" />
                </div>
                <p className="text-lg">
                  {remotePeer ? 'Camera is off' : 'Waiting for other participant...'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
          {localPeer?.videoTrack && !isVideoMuted ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
              onLoadedMetadata={() => {
                if (videoRef.current && localPeer.videoTrack) {
                  hmsActions.attachVideo(localPeer.videoTrack.id, videoRef.current);
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Connection Status */}
        {(joining || !isConnected) && !error && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg">
                {joining ? 'Joining session...' : 'Connecting to session...'}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8" />
              </div>
              <p className="text-lg mb-2">Failed to join session</p>
              <p className="text-sm text-gray-300 mb-4">{error}</p>
              <button
                onClick={handleEndSession}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Close Session
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-colors ${
              isAudioMuted
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isAudioMuted ? (
              <MicOff className="h-6 w-6 text-white" />
            ) : (
              <Mic className="h-6 w-6 text-white" />
            )}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-colors ${
              isVideoMuted
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {isVideoMuted ? (
              <VideoOff className="h-6 w-6 text-white" />
            ) : (
              <Video className="h-6 w-6 text-white" />
            )}
          </button>

          <button
            onClick={handleEndSession}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
          >
            <PhoneOff className="h-6 w-6 text-white" />
          </button>

          <button className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors">
            <Settings className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>

      {/* Chat Panel */}
      {showChat && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Session Chat</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((message) => (
              <div key={message.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {message.sender}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(message.timestamp, 'HH:mm')}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{message.text}</p>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSession;