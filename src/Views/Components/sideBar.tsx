import {View} from 'react-native-windows';
import React, {TouchableOpacity} from 'react-native';
import {styles} from '../Styling/styles';
import {ISideBar} from '../Constants/constants';

export const SideBar = (props: ISideBar): JSX.Element => {
  const {screenSetter} = props;
  return (
    <View style={styles.sideBar}>
      <TouchableOpacity
        style={styles.sideBarIcon}
        onPress={() => screenSetter('Home')}
      />
      <TouchableOpacity
        style={styles.sideBarIcon}
        onPress={() => screenSetter('Trading')}
      />
      <View style={styles.sideBarIcon} />
      <View style={styles.sideBarIcon} />
      <View style={styles.sideBarIcon} />
    </View>
  );
};
