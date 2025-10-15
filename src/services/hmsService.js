import { HMSReactiveStore } from '@100mslive/hms-video-store';

class HMSService {
  constructor() {
    this.hmsStore = new HMSReactiveStore();
    this.hmsActions = this.hmsStore.getActions();
    this.hmsSelectors = this.hmsStore.getSelectors();
  }

  // Initialize HMS
  async initializeHMS() {
    try {
      await this.hmsActions.init();
      return true;
    } catch (error) {
      console.error('HMS initialization failed:', error);
      return false;
    }
  }

  // Join a room
  async joinRoom(token, userName) {
    try {
      await this.hmsActions.join({
        authToken: token,
        userName: userName,
        settings: {
          isAudioMuted: false,
          isVideoMuted: false,
        },
      });
      return true;
    } catch (error) {
      console.error('Failed to join room:', error);
      throw error;
    }
  }

  // Leave room
  async leaveRoom() {
    try {
      await this.hmsActions.leave();
      return true;
    } catch (error) {
      console.error('Failed to leave room:', error);
      return false;
    }
  }

  // Toggle audio
  async toggleAudio() {
    const isAudioMuted = this.hmsSelectors.getLocalPeer()?.audioTrack?.enabled === false;
    await this.hmsActions.setLocalAudioEnabled(!isAudioMuted);
  }

  // Toggle video
  async toggleVideo() {
    const isVideoMuted = this.hmsSelectors.getLocalPeer()?.videoTrack?.enabled === false;
    await this.hmsActions.setLocalVideoEnabled(!isVideoMuted);
  }

  // Get room state
  getRoomState() {
    return this.hmsSelectors.getRoom();
  }

  // Get peers
  getPeers() {
    return this.hmsSelectors.getPeers();
  }

  // Get local peer
  getLocalPeer() {
    return this.hmsSelectors.getLocalPeer();
  }

  // Get store and actions for components
  getStore() {
    return this.hmsStore;
  }

  getActions() {
    return this.hmsActions;
  }

  getSelectors() {
    return this.hmsSelectors;
  }
}

export const hmsService = new HMSService();