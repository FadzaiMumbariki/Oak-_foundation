import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AttendanceScreen from '@/screens/AttendanceScreen';
import { AttendanceStackParamList } from '@/navigation/types';
import { OAK_BRAND } from '@/theme';

const Stack = createNativeStackNavigator<AttendanceStackParamList>();

export default function AttendanceStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: OAK_BRAND.offWhite },
      }}
    >
      <Stack.Screen name="AttendanceDashboard" component={AttendanceScreen} />
    </Stack.Navigator>
  );
}
