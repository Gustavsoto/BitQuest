import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from './Styling/styles';

export default function HomeScreen() {
  const [panelStatus, setPanelStatus] = useState(false);

  const changePanelStatus = () => {
    setPanelStatus(prevStatus => !prevStatus);
    console.log('Panel status:', !panelStatus);
  };
  return (
    <View style={styles.HomeContainer}>
      <View style={styles.homeBox}>
        <Text style={styles.title}>Home Screen {panelStatus}</Text>
        <TouchableOpacity style={styles.button} onPress={changePanelStatus}>
          <Text style={styles.buttonText}>
            {panelStatus ? 'Active' : 'Inactive'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
