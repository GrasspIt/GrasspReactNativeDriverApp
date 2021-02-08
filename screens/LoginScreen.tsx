import React, { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { attemptLogin } from '../actions/oauthActions';
import { getLoggedInUser } from '../selectors/userSelectors';
import LoginForm from '../components/LoginForm';

type Props = {
  loggedInUser;
  attemptLogin;
  isLoading;
};

const LoginScreen = ({ loggedInUser, attemptLogin, isLoading }: Props) => {
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
  };

  useEffect(() => {
    if (loggedInUser) {
      setEmail('');
      setPassword('');
    }
  }, [loggedInUser]);

  return (
    <LoginForm
      isLoading={isLoading}
      email={email}
      emailInvalid={emailInvalid}
      password={password}
      passwordInvalid={passwordInvalid}
      handleEmailChange={handleEmailChange}
      handlePasswordChange={handlePasswordChange}
      handleSubmit={handleSubmit}
    />
  );
};

const mapStateToProps = (state) => {
  const isLoading = state.api.isLoading;
  return {
    loggedInUser: getLoggedInUser(state),
    isLoading,
  };
};

const mapDispatchToProps = { attemptLogin };

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
