import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth services
export const authService = {
  async signUp(userData) {
    // First create the auth user
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });
    
    if (error) return { data, error };
    
    // Then create the profile
    if (data.user) {
      const profileData = {
        id: data.user.id,
        full_name: userData.full_name,
        phone: userData.phone,
        user_type: userData.user_type,
        date_of_birth: userData.date_of_birth,
        primary_concern: userData.primary_concern,
      };
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([profileData]);
      
      if (profileError) {
        console.error('Profile creation error:', profileError);
      }
      
      // If therapist, create therapist profile
      if (userData.user_type === 'therapist') {
        const therapistData = {
          user_id: data.user.id,
          specializations: [userData.specialization],
          license_number: userData.license_number,
          years_experience: parseInt(userData.years_experience),
          bio: userData.bio,
        };
        
        const { error: therapistError } = await supabase
          .from('therapist_profiles')
          .insert([therapistData]);
        
        if (therapistError) {
          console.error('Therapist profile creation error:', therapistError);
        }
      }
    }
    
    return { data, error };
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (data.user && !error) {
      // Get user profile to determine user type
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type, full_name')
        .eq('id', data.user.id)
        .single();
      
      if (profile) {
        data.user.user_metadata = {
          ...data.user.user_metadata,
          user_type: profile.user_type,
          full_name: profile.full_name,
        };
      }
    }
    
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (user && !error) {
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type, full_name')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        user.user_metadata = {
          ...user.user_metadata,
          user_type: profile.user_type,
          full_name: profile.full_name,
        };
      }
    }
    
    return user;
  },
};

// Database services
export const dbService = {
  // Blog posts
  async createBlogPost(post) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select();
    return { data: data?.[0], error };
  },

  async getBlogPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        profiles!blog_posts_author_id_fkey (
          full_name,
          user_type
        )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async updateBlogPost(post) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(post)
      .eq('id', post.id)
      .select();
    return { data: data?.[0], error };
  },

  async deleteBlogPost(postId) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', postId);
    return { error };
  },
  // Private notes (encrypted)
  async createPrivateNote(note) {
    const { data, error } = await supabase
      .from('private_notes')
      .insert([note])
      .select();
    return { data: data?.[0], error };
  },

  async getPrivateNotes(patientId) {
    const { data, error } = await supabase
      .from('private_notes')
      .select('*')
      .eq('patient_id', patientId)
      .order('updated_at', { ascending: false });
    return { data, error };
  },

  async updatePrivateNote(note) {
    const { data, error } = await supabase
      .from('private_notes')
      .update(note)
      .eq('id', note.id)
      .select();
    return { data: data?.[0], error };
  },

  async deletePrivateNote(noteId) {
    const { error } = await supabase
      .from('private_notes')
      .delete()
      .eq('id', noteId);
    return { error };
  },
  // Therapist profiles
  async getTherapistProfile(userId) {
    const { data, error } = await supabase
      .from('therapist_profiles')
      .select(`
        *,
        user_profile:profiles!user_id (
          full_name
        )
      `)
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  async createTherapistProfile(profile) {
    const { data, error } = await supabase
      .from('therapist_profiles')
      .insert([profile])
      .select();
    return { data: data?.[0], error };
  },

  async getTherapistProfiles() {
    const { data, error } = await supabase
      .from('therapist_profiles')
      .select(`
        *,
        profiles!therapist_profiles_profile_id_fkey (
          full_name
        ),
        user_profile:profiles!user_id (
          full_name
        )
      `)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async updateTherapistProfile(profile) {
    const { data, error } = await supabase
      .from('therapist_profiles')
      .update(profile)
      .eq('id', profile.id)
      .select();
    return { data: data?.[0], error };
  },
  // Groups
  async createGroup(group) {
    const { data: groupData, error } = await supabase
      .from('groups')
      .insert([group])
      .select();
    
    if (groupData && !error) {
      // Add creator as first member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert([{
          group_id: groupData[0].id,
          user_id: group.creator_id
        }]);
      
      if (memberError) {
        console.error('Error adding creator to group:', memberError);
      }
    }
    
    return { data: groupData?.[0], error };
  },

  async getGroups() {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        creator:profiles!groups_creator_id_fkey (
          full_name
        )
      `)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getUserGroups(userId) {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        group_id,
        groups (
          *,
          creator:profiles!groups_creator_id_fkey (
            full_name
          )
        )
      `)
      .eq('user_id', userId);
    return { data: data?.map(item => item.groups), error };
  },

  async joinGroup(groupId, userId) {
    const { data, error } = await supabase
      .from('group_members')
      .insert([{
        group_id: groupId,
        user_id: userId
      }]);
    return { data, error };
  },

  async leaveGroup(groupId, userId) {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);
    return { error };
  },

  async getGroupPosts(groupId) {
    const { data, error } = await supabase
      .from('group_posts')
      .select(`
        *,
        profiles!group_posts_author_id_fkey (
          full_name
        )
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createGroupPost(post) {
    const { data, error } = await supabase
      .from('group_posts')
      .insert([post])
      .select();
    return { data: data?.[0], error };
  },

  // Appointments
  async createAppointment(appointment) {
    // Check HMS credentials before attempting room creation
    const hmsAccessKey = import.meta.env.VITE_HMS_ACCESS_KEY;
    const hmsSecretKey = import.meta.env.VITE_HMS_SECRET_KEY;
    const hmsTemplateId = import.meta.env.VITE_HMS_TEMPLATE_ID;
    
    const hasValidHMSCredentials = hmsAccessKey && 
      hmsSecretKey && 
      hmsTemplateId && 
      hmsAccessKey !== 'your_100ms_access_key_here' &&
      hmsSecretKey !== 'your_100ms_secret_key_here' &&
      hmsTemplateId !== 'your_100ms_template_id_here';
    
    if (hasValidHMSCredentials) {
      // Only attempt HMS room creation if credentials are properly configured
      try {
        const { hmsTokenService } = await import('./hmsTokenService');
        const room = await hmsTokenService.createRoom(
          `temp-${Date.now()}`, // temporary ID, will be replaced with actual appointment ID
          appointment
        );
        appointment.hms_room_id = room.id;
      } catch (error) {
        console.warn('HMS room creation failed, continuing without video room:', error.message);
        // Don't throw error - allow appointment creation to continue
      }
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select();
    
    // Update with actual appointment ID if HMS room was created
    if (data?.[0] && appointment.hms_room_id && hasValidHMSCredentials) {
      try {
        const { hmsTokenService } = await import('./hmsTokenService');
        await hmsTokenService.createRoom(data[0].id, {
          ...appointment,
          id: data[0].id
        });
      } catch (error) {
        console.warn('Failed to update HMS room with appointment ID:', error.message);
      }
    }
    
    return { data: data?.[0], error };
  },

  async getAppointments(userId, userType) {
    const column = userType === 'patient' ? 'patient_id' : 'therapist_id';
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:profiles!appointments_patient_id_fkey (
          full_name
        ),
        therapist:profiles!appointments_therapist_id_fkey (
          full_name
        )
      `)
      .eq(column, userId)
      .order('appointment_date', { ascending: true });
    return { data, error };
  },

  async updateAppointment(appointment) {
    const { data, error } = await supabase
      .from('appointments')
      .update(appointment)
      .eq('id', appointment.id)
      .select();
    return { data: data?.[0], error };
  },

  // HMS Room management
  async getOrCreateHMSRoom(appointmentId, appointmentData) {
    try {
      const { hmsTokenService } = await import('./hmsTokenService');
      
      // Check if room already exists in appointment
      if (appointmentData.hms_room_id) {
        const roomDetails = await hmsTokenService.getRoomDetails(appointmentData.hms_room_id);
        return roomDetails;
      }
      
      // Create new room
      const room = await hmsTokenService.createRoom(appointmentId, appointmentData);
      
      // Update appointment with room ID
      await this.updateAppointment({
        id: appointmentId,
        hms_room_id: room.id
      });
      
      return room;
    } catch (error) {
      console.error('Error managing HMS room:', error);
      throw error;
    }
  },

  async generateHMSToken(appointmentId, userId, userName, userType) {
    const hmsAccessKey = import.meta.env.VITE_HMS_ACCESS_KEY;
    const hmsSecretKey = import.meta.env.VITE_HMS_SECRET_KEY;
    const hmsTemplateId = import.meta.env.VITE_HMS_TEMPLATE_ID;
    
    if (!hmsAccessKey || !hmsSecretKey || !hmsTemplateId ||
        hmsAccessKey === 'your_100ms_access_key_here' ||
        hmsSecretKey === 'your_100ms_secret_key_here' ||
        hmsTemplateId === 'your_100ms_template_id_here') {
      throw new Error('HMS credentials not configured. Please set up your 100ms credentials in the .env file.');
    }
    
    try {
      const { hmsTokenService } = await import('./hmsTokenService');
      
      // Get appointment details
      const { data: appointment } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();
      
      if (!appointment) {
        throw new Error('Appointment not found');
      }
      
      // Get or create HMS room
      const room = await this.getOrCreateHMSRoom(appointmentId, appointment);
      
      // Determine role based on user type
      const role = userType === 'therapist' ? 'host' : 'guest';
      
      // Generate auth token
      const authToken = await hmsTokenService.generateAuthToken(
        room.id,
        userId,
        role,
        userName
      );
      
      return {
        token: authToken,
        roomId: room.id,
        role: role
      };
    } catch (error) {
      console.error('Error generating HMS token:', error);
      throw error;
    }
  },
};