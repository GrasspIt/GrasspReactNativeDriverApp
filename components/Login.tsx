import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Alert } from 'react-native';
import { Input, Button, Card } from 'react-native-elements';
import Colors from '../constants/Colors';

interface LoginProps {
  handleLogin: (username: string, password: string) => any;
}

const Login: React.FC<LoginProps> = (props) => {
  const { handleLogin } = props;

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

  const handleSubmit = () => {
      if (email.trim().length === 0) {
          setEmailInvalid(true);
          return;
      }
      if (password.trim().length === 0) {
          setPasswordInvalid(true);
          return;
      }
      handleLogin(email, password);
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
          errorMessage={emailInvalid ? 'ENTER EMAIL' : undefined}
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
          errorMessage={passwordInvalid ? 'ENTER PASSWORD' : undefined}
          onChangeText={text => handlePasswordChange(text)}
          value={password}
        />
        {/* {isLoading ? (
          <Button loading />
        ) : (
          <Button title='Login' onPress={handleSubmit} />
        )} */}
        <Button buttonStyle={styles.button} title='Login' onPress={handleSubmit} />
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