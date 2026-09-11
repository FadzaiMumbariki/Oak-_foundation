import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PartnersScreen from '@/screens/PartnersScreen';
import PartnerDetailScreen from '@/screens/PartnerDetailScreen';
import { PartnersStackParamList } from '@/navigation/types';
import { OAK_BRAND } from '@/theme';

const Stack = createNativeStackNavigator<PartnersStackParamList>();

export default function PartnersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: OAK_BRAND.offWhite },
      }}
    >
      <Stack.Screen name="PartnersList" component={PartnersScreen} />
      <Stack.Screen
        name="PartnerDetail"
        component={PartnerDetailScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerBackTitle: 'Partners',
          headerTintColor: OAK_BRAND.navy,
          contentStyle: { backgroundColor: OAK_BRAND.offWhite },
        }}
      />
    </Stack.Navigator>
  );
}
