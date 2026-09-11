import type { Attendee, AttendeeAdmin, CheckIn, Partner, ProgrammeSession, DailyPost } from '@/types';
import { supabase } from '@/services/supabase';

export const attendeeApi = {
  async lookupByToken(token: string): Promise<Attendee | null> {
    const { data, error } = await supabase
      .from('attendees')
      .select('id, full_name, organization, sub_partner, role_title, qr_token')
      .eq('qr_token', token)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async list(): Promise<AttendeeAdmin[]> {
    const { data, error } = await supabase
      .from('attendees')
      .select('*')
      .order('full_name');
    if (error) throw error;
    return data ?? [];
  },

  async register(payload: {
    full_name: string;
    email: string;
    phone: string;
    organization: string;
    sub_partner: string;
    role_title: string;
    dietary_needs?: string;
    accessibility_needs?: string;
    travel_needs?: string;
    consent_given: boolean;
  }): Promise<AttendeeAdmin> {
    const { data, error } = await supabase
      .from('attendees')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },
};

export const checkInApi = {
  async create(attendee_id: string): Promise<CheckIn> {
    const { data, error } = await supabase
      .rpc('create_checkin', { attendee_id_in: attendee_id });
    if (error) throw error;
    if (!data) throw new Error('No check-in returned');
    return data as CheckIn;
  },

  async listByDate(date: string): Promise<(CheckIn & { attendee: Attendee })[]> {
    const { data, error } = await supabase
      .from('checkins')
      .select('*, attendee:attendees(id, full_name, organization, sub_partner, role_title, qr_token)')
      .eq('check_in_date', date)
      .order('checked_in_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as any;
  },

  async statsByDate(date: string): Promise<{ total: number; checked_in: number }> {
    const attendees = await attendeeApi.list();
    const checkedIn = await this.listByDate(date);
    return { total: attendees.length, checked_in: checkedIn.length };
  },
};

export const partnerApi = {
  async list(): Promise<Partner[]> {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('sort_order');
    if (error) throw error;
    return data ?? [];
  },
};

export const programmeApi = {
  async list(): Promise<ProgrammeSession[]> {
    const { data, error } = await supabase
      .from('programme_sessions')
      .select('*')
      .order('session_date')
      .order('sort_order');
    if (error) throw error;
    return data ?? [];
  },

  async byDate(date: string): Promise<ProgrammeSession[]> {
    const { data, error } = await supabase
      .from('programme_sessions')
      .select('*')
      .eq('session_date', date)
      .order('sort_order');
    if (error) throw error;
    return data ?? [];
  },
};

export const contentApi = {
  async dailyPosts(): Promise<DailyPost[]> {
    const { data, error } = await supabase
      .from('daily_posts')
      .select('*')
      .eq('published', true)
      .order('post_date', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
};
