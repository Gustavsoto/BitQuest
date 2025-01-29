import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from './Styling/styles';
import {IWelcomeScreenProps} from './Constants/constants';

export default function WelcomeScreen(props: IWelcomeScreenProps) {
  const {logIn} = props;
  return (
    <View style={styles.welcomeContainer}>
      <View style={styles.homeBox}>
        <Text style={styles.title}>Welcome Screen</Text>
        <TouchableOpacity style={styles.button} onPress={logIn}>
          <Text>Enter App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
