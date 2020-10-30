import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  View,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Input, Button, Card } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import { attemptLogin } from '../actions/oauthActions';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../navigation/AuthNavigator';
import { getLoggedInUser } from '../selectors/userSelectors';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Login'>;
type Props = {
  navigation: LoginScreenNavigationProp;
  loggedInUser;
  errorMessage;
  attemptLogin;
  isLoading;
};

const LoginScreen = ({
  navigation,
  loggedInUser,
  errorMessage,
  attemptLogin,
  isLoading,
}: Props) => {
  const { colors } = useTheme();

  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!loggedInUser && errorMessage) {
      Alert.alert(errorMessage);
    }
  }, [loggedInUser, errorMessage]);

  const handleEmailChange = (text) => {
    if (emailInvalid) setEmailInvalid(false);
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    if (passwordInvalid) setPasswordInvalid(false);
    setPassword(text);
  };

  const handleSubmit = () => {
    if (email.trim().length === 0) {
      setEmailInvalid(true);
      return;
    }
    if (password.trim().length === 0) {
      setPasswordInvalid(true);
      return;
    }
    Keyboard.dismiss();
    attemptLogin(email, password);
    setEmail('');
    setPassword('');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.background }}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <Image
              source={require('../assets/grassp_health.png')}
              style={{
                height: 60,
                width: 230,
              }}
            />
            <Card containerStyle={{ width: '80%' }}>
              <Card.Title>LOGIN</Card.Title>
              <Card.Divider />
              <Input
                containerStyle={{ marginVertical: 10 }}
                placeholder='Email'
                label='Email'
                labelStyle={{ color: colors.onSurface }}
                keyboardType='email-address'
                autoCapitalize='none'
                leftIcon={{
                  type: 'font-awesome',
                  color: colors.onSurface,
                  name: 'envelope',
                }}
                errorStyle={{ color: 'red' }}
                errorMessage={emailInvalid ? 'ENTER EMAIL' : undefined}
                onChangeText={(text) => handleEmailChange(text)}
                value={email}
              />
              <Input
                containerStyle={{ marginVertical: 10 }}
                placeholder='Password'
                label='Password'
                labelStyle={{ color: colors.onSurface }}
                autoCapitalize='none'
                leftIcon={{
                  type: 'font-awesome',
                  color: colors.onSurface,
                  name: 'lock',
                }}
                secureTextEntry={true}
                errorStyle={{ color: colors.error }}
                errorMessage={passwordInvalid ? 'ENTER PASSWORD' : undefined}
                onChangeText={(text) => handlePasswordChange(text)}
                value={password}
              />
              {isLoading ? (
                <Button buttonStyle={{ backgroundColor: colors.primary }} loading />
              ) : (
                <Button
                  buttonStyle={{ backgroundColor: colors.primary }}
                  title='Login'
                  titleStyle={{ color: colors.surface }}
                  onPress={handleSubmit}
                />
              )}
            </Card>
          </View>
        </TouchableWithoutFeedback>
        <StatusBar style='dark' />
      </KeyboardAvoidingView>
      <StatusBar style='dark' />
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  const errorMessage = state.api.errorMessage;
  const isLoading = state.api.isLoading;
  return {
    loggedInUser: getLoggedInUser(state),
    errorMessage,
    isLoading,
  };
};

const mapDispatchToProps = { attemptLogin };

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
