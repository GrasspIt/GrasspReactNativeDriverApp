import React, { useState, useEffect } from 'react';
import {
    KeyboardAvoidingView, StyleSheet, Alert
} from 'react-native';
import { Input, Button, Card } from 'react-native-elements';
import Colors from '../constants/Colors';

const Login = () => {

  const [ passwordInvalid, setPasswordInvalid ] = useState(false);
  const [ emailInvalid, setEmailInvalid ] = useState(false);
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleEmailChange = (text) => {
      if (emailInvalid) setEmailInvalid(false);
      setEmail(text);
  }

  const handlePasswordChange = (text) => {
      if (passwordInvalid) setPasswordInvalid(false);
      setPassword(text);
  }

  // useEffect(() => {
  //     if ( error ) Alert.alert(error);
  //     // if a token is in state, navigate to home screen
  //     if ( token ) navigation.navigate('Home');
  // }, [error, token])

  const handleLogin = () => {
      if (email.trim().length === 0) {
          setEmailInvalid(true);
          return;
      }
      if (password.trim().length === 0) {
          setPasswordInvalid(true);
          return;
      }
      // login({ email, password });
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior='padding'
    >
      <Card title='LOGIN'>
        <Input
          containerStyle={styles.input}
          placeholder="Email"
          label='Email'
          labelStyle={{color: Colors.black}}
          keyboardType='email-address'
          autoCapitalize='none'
          leftIcon={{ type: 'font-awesome', color: Colors.black, name: 'envelope' }}
          errorStyle={{ color: 'red' }}
          // errorMessage={emailInvalid ? 'ENTER EMAIL' : null}
          onChangeText={text => handleEmailChange(text)}
          value={email}
        />
        <Input
          containerStyle={styles.input}                    
          placeholder="Password"
          label='Password'
          labelStyle={{color: Colors.black}}
          autoCapitalize='none'
          leftIcon={{ type: 'font-awesome', color: Colors.black, name: 'lock' }}
          secureTextEntry={true}
          errorStyle={{ color: 'red' }}
          // errorMessage={passwordInvalid ? 'ENTER PASSWORD' : null}
          onChangeText={text => handlePasswordChange(text)}
          value={password}
        />
        {/* {isLoading ? (
          <Button loading />
        ) : (
          <Button title='Login' onPress={handleLogin} />
        )} */}
        <Button title='Login' onPress={handleLogin} />
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.medium,
    justifyContent: 'center'
  },
  input: {
      marginVertical: 10,
  },
  button: {
      backgroundColor: Colors.green
  }
});

export default Login;