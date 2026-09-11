import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { OAK_BRAND } from './src/theme';

const oakTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: OAK_BRAND.green,
    background: OAK_BRAND.offWhite,
    card: OAK_BRAND.white,
    text: OAK_BRAND.navy,
    border: OAK_BRAND.greyLight,
    notification: OAK_BRAND.gold,
  },
  fonts: DefaultTheme.fonts,
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={oakTheme}>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
