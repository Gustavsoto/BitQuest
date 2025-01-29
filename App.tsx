import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from './src/Views/WelcomeScreen';
import HomeScreen from './src/Views/HomeScreen';
import TradingScreen from './src/Views/TradingScreen';
import {SideBar} from './src/Views/Components/sideBar';
import {styles} from './src/Views/Styling/styles';
import {View} from 'react-native';

export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Trading: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [selectedScreen, setSelectedScreen] = useState<string>('Home');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  if (!isLoggedIn) {
    return <WelcomeScreen logIn={() => setIsLoggedIn(true)} />;
  }
  return (
    <>
      <View style={styles.welcomeContainer}>
        <SideBar screenSetter={setSelectedScreen} />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            {selectedScreen === 'Home' && (
              <Stack.Screen name="Home" component={HomeScreen} />
            )}
            {selectedScreen === 'Trading' && (
              <Stack.Screen name="Trading" component={TradingScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </>
  );
}
