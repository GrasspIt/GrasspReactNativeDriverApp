import React, { useState } from 'react';
import { KeyboardAvoidingView, View, StyleSheet, Image, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Input, Button, Card } from 'react-native-elements';
import Colors from '../constants/Colors';

interface LoginProps {
  handleLogin: (username: string, password: string) => any;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginProps> = (props) => {
  const { handleLogin, isLoading } = props;

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
      setEmail('');
      setPassword('');
    }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Image source={require('../assets/grassp_health.png')} style={styles.image}/>
          <Card title='LOGIN' containerStyle={styles.card}>
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
            {isLoading ? (
              <Button buttonStyle={styles.button} loading />
            ) : (
              <Button buttonStyle={styles.button} title='Login' onPress={handleSubmit} />
            )}
          </Card>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  image: {
    height: 60,
    width: 230
  },
  card: {
    width: '80%'
  },
  input: {
      marginVertical: 10,
  },
  button: {
      backgroundColor: Colors.primary
  }
});

export default LoginForm;