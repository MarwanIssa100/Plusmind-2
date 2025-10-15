// 100ms Token Management Service
class HMSTokenService {
  constructor() {
    this.managementToken = null;
    this.baseURL = 'https://api.100ms.live/v2';
  }

  // Get management token for API calls
  async getManagementToken() {
    if (this.managementToken) {
      return this.managementToken;
    }

    const accessKey = import.meta.env.VITE_HMS_ACCESS_KEY;
    const secretKey = import.meta.env.VITE_HMS_SECRET_KEY;

    if (!accessKey || !secretKey) {
      throw new Error('HMS credentials not found in environment variables');
    }

    try {
      const response = await fetch(`${this.baseURL}/management-tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          secret: secretKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get management token: ${response.statusText}`);
      }

      const data = await response.json();
      this.managementToken = data.token;
      return this.managementToken;
    } catch (error) {
      console.error('Error getting management token:', error);
      throw error;
    }
  }

  // Create a room for the appointment
  async createRoom(appointmentId, appointmentData) {
    try {
      const token = await this.getManagementToken();
      
      const roomData = {
        name: `therapy-session-${appointmentId}`,
        description: `Therapy session between ${appointmentData.patient?.full_name} and ${appointmentData.therapist?.full_name}`,
        template_id: import.meta.env.VITE_HMS_TEMPLATE_ID, // You'll need to create this in HMS dashboard
        region: 'us', // or your preferred region
      };

      const response = await fetch(`${this.baseURL}/rooms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create room: ${response.statusText}`);
      }

      const room = await response.json();
      return room;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  // Generate auth token for joining a room
  async generateAuthToken(roomId, userId, role = 'guest', userName = 'User') {
    try {
      const token = await this.getManagementToken();
      
      const authTokenData = {
        room_id: roomId,
        user_id: userId,
        role: role, // 'guest', 'host', etc.
        type: 'app',
        user_metadata: {
          name: userName,
        },
      };

      const response = await fetch(`${this.baseURL}/auth-tokens`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authTokenData),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate auth token: ${response.statusText}`);
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Error generating auth token:', error);
      throw error;
    }
  }

  // Get room details
  async getRoomDetails(roomId) {
    try {
      const token = await this.getManagementToken();
      
      const response = await fetch(`${this.baseURL}/rooms/${roomId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get room details: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting room details:', error);
      throw error;
    }
  }

  // End a room session
  async endRoom(roomId) {
    try {
      const token = await this.getManagementToken();
      
      const response = await fetch(`${this.baseURL}/rooms/${roomId}/end-room`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to end room: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error ending room:', error);
      throw error;
    }
  }
}

export const hmsTokenService = new HMSTokenService();