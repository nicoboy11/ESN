import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import LoginView from './src/views/LogInView';

/*
const onLogIn = () => {
        fetch('http://143.167.70.156:3001/loginUser?email=even.sosa@gmail.com&password=password', { method: 'GET', body: null })
            .then((response) => response.json())
            .then((responseData) => console.log(responseData)).done();  
};
*/
class esn extends Component {
  render() {
    return (
      <LoginView />
    );
  }
}

AppRegistry.registerComponent('esn', () => esn);
