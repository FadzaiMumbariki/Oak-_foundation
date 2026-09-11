import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '@/screens/RegisterScreen';
import RegistrationSuccessScreen from '@/screens/RegistrationSuccessScreen';
import { RegisterStackParamList } from '@/navigation/types';
import { OAK_BRAND } from '@/theme';

const Stack = createNativeStackNavigator<RegisterStackParamList>();

export default function RegisterStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: OAK_BRAND.offWhite },
      }}
    >
      <Stack.Screen name="RegisterForm" component={RegisterScreen} />
      <Stack.Screen
        name="RegistrationSuccess"
        component={RegistrationSuccessScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerBackTitle: 'Register',
          headerTintColor: OAK_BRAND.navy,
        }}
      />
    </Stack.Navigator>
  );
}
