import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  UserPlus,
  ScanLine,
  Calendar,
  Globe2,
  LayoutGrid,
} from 'lucide-react-native';
import { OAK_BRAND, RADIUS } from '@/theme';
import RegisterStack from './stacks/RegisterStack';
import CheckInStack from './stacks/CheckInStack';
import ProgrammeStack from './stacks/ProgrammeStack';
import PartnersStack from './stacks/PartnersStack';
import AttendanceStack from './stacks/AttendanceStack';
import type { BottomTabParamList } from './types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

type IconProps = { color: string; size: number; focused: boolean };

function RegisterIcon({ color, focused }: IconProps) {
  return (
    <View style={focused && styles.focusedWrap}>
      <UserPlus size={24} color={color} strokeWidth={focused ? 2.4 : 2} />
    </View>
  );
}

function CheckInIcon({ color, focused }: IconProps) {
  return (
    <View style={focused && styles.focusedWrap}>
      <ScanLine size={24} color={color} strokeWidth={focused ? 2.4 : 2} />
    </View>
  );
}

function ProgrammeIcon({ color, focused }: IconProps) {
  return (
    <View style={focused && styles.focusedWrap}>
      <Calendar size={24} color={color} strokeWidth={focused ? 2.4 : 2} />
    </View>
  );
}

function PartnersIcon({ color, focused }: IconProps) {
  return (
    <View style={focused && styles.focusedWrap}>
      <Globe2 size={24} color={color} strokeWidth={focused ? 2.4 : 2} />
    </View>
  );
}

function AttendanceIcon({ color, focused }: IconProps) {
  return (
    <View style={focused && styles.focusedWrap}>
      <LayoutGrid size={24} color={color} strokeWidth={focused ? 2.4 : 2} />
    </View>
  );
}

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: OAK_BRAND.navy,
        tabBarInactiveTintColor: OAK_BRAND.grey,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
      }}
    >
      <Tab.Screen
        name="RegisterStack"
        component={RegisterStack}
        options={{
          tabBarLabel: 'Register',
          tabBarIcon: ({ color, size, focused }) => (
            <RegisterIcon color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="CheckInStack"
        component={CheckInStack}
        options={{
          tabBarLabel: 'Check In',
          tabBarIcon: ({ color, size, focused }) => (
            <CheckInIcon color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="ProgrammeStack"
        component={ProgrammeStack}
        options={{
          tabBarLabel: 'Programme',
          tabBarIcon: ({ color, size, focused }) => (
            <ProgrammeIcon color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="PartnersStack"
        component={PartnersStack}
        options={{
          tabBarLabel: 'Partners',
          tabBarIcon: ({ color, size, focused }) => (
            <PartnersIcon color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="AttendanceStack"
        component={AttendanceStack}
        options={{
          tabBarLabel: 'Attendance',
          tabBarIcon: ({ color, size, focused }) => (
            <AttendanceIcon color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 92 : 76,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    paddingHorizontal: 4,
    borderTopWidth: 0,
    backgroundColor: OAK_BRAND.white,
    shadowColor: OAK_BRAND.navy,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  item: {
    paddingTop: 6,
    paddingBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.1,
  },
  focusedWrap: {
    backgroundColor: 'rgba(27,43,75,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.xl,
  },
});
