import type { AttendeeAdmin, Partner } from '@/types';

export type RegisterStackParamList = {
  RegisterForm: undefined;
  RegistrationSuccess: { attendee: AttendeeAdmin };
};

export type CheckInStackParamList = {
  CheckInScanner: undefined;
  CheckInSuccess: {
    attendee: AttendeeAdmin;
    checkedInAt: string;
    nextSession?: string;
    venue?: string;
  };
  CheckInError: { error?: string };
};

export type ProgrammeStackParamList = {
  ProgrammeMain: undefined;
};

export type PartnersStackParamList = {
  PartnersList: undefined;
  PartnerDetail: { partner: Partner };
};

export type AttendanceStackParamList = {
  AttendanceDashboard: undefined;
};

export type BottomTabParamList = {
  RegisterStack: undefined;
  CheckInStack: undefined;
  ProgrammeStack: undefined;
  PartnersStack: undefined;
  AttendanceStack: undefined;
};

export type RootStackParamList = BottomTabParamList;
