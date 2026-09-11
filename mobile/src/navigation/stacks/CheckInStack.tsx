import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CheckInScreen from '@/screens/CheckInScreen';
import CheckInSuccessScreen from '@/screens/CheckInSuccessScreen';
import CheckInErrorScreen from '@/screens/CheckInErrorScreen';
import { CheckInStackParamList } from '@/navigation/types';
import { OAK_BRAND } from '@/theme';

const Stack = createNativeStackNavigator<CheckInStackParamList>();

export default function CheckInStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: OAK_BRAND.offWhite },
      }}
    >
      <Stack.Screen name="CheckInScanner" component={CheckInScreen} />
      <Stack.Screen
        name="CheckInSuccess"
        component={CheckInSuccessScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerBackTitle: 'Check In',
          headerTintColor: OAK_BRAND.navy,
        }}
      />
      <Stack.Screen
        name="CheckInError"
        component={CheckInErrorScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerBackTitle: 'Check In',
          headerTintColor: OAK_BRAND.navy,
        }}
      />
    </Stack.Navigator>
  );
}
