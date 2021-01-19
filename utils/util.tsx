import { Alert, Platform } from 'react-native';
import * as Linking from 'expo-linking';

export const formatPhone = (phonenum) => {
  var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (regexObj.test(phonenum)) {
    var parts = phonenum.match(regexObj);
    var phone = '';
    if (parts[1]) {
      phone += '(' + parts[1] + ') ';
    }
    phone += parts[2] + '-' + parts[3];
    return phone;
  } else {
    //invalid phone number
    return phonenum;
  }
};

export const handleMap = (address) => {
  let daddr = encodeURIComponent(`${address.street} ${address.zipCode}`);
  if (Platform.OS === 'ios') {
    Linking.openURL(`http://maps.apple.com/?daddr=${daddr}`);
  } else {
    Linking.openURL(`http://maps.google.com/?daddr=${daddr}`);
  }
};

export const handlePhone = (user) => {
  Alert.alert(
    'Contact Customer',
    `How would you like to contact ${formatPhone(user.phoneNumber)}`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => Linking.openURL(`tel:${user.phoneNumber}`) },
      { text: 'Text', onPress: () => Linking.openURL(`sms:${user.phoneNumber}`) },
    ]
  );
};
