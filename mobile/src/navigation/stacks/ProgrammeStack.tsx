import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProgrammeScreen from '@/screens/ProgrammeScreen';
import { ProgrammeStackParamList } from '@/navigation/types';
import { OAK_BRAND } from '@/theme';

const Stack = createNativeStackNavigator<ProgrammeStackParamList>();

export default function ProgrammeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: OAK_BRAND.offWhite },
      }}
    >
      <Stack.Screen name="ProgrammeMain" component={ProgrammeScreen} />
    </Stack.Navigator>
  );
}
