import React from 'react';
import {View, Text} from 'react-native';
import {styles} from './Styling/styles';

export default function TradingScreen() {
  return (
    <View style={styles.welcomeContainer}>
      <View style={styles.homeBox}>
        <Text style={styles.title}>Trading Screen</Text>
        <Text>Enter App</Text>
      </View>
    </View>
  );
}
