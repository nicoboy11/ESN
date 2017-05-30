import React, { Component } from 'react';
import { AppRegistry, View, Button, Image } from 'react-native';
import MyTextInput from './Components/MyTextInput';
import lang from './TextLang';

const onLogIn = () => {
        fetch('http://143.167.70.156:3001/loginUser?email=even.sosa@gmail.com&password=password', { method: 'GET', body: null })
            .then((response) => response.json())
            .then((responseData) => console.log(responseData)).done();  
};

class esn extends Component {

  render() {
    const { headerStyle, mainContainerStyle, imageStyle } = styles;
    return (
      <View style={mainContainerStyle}>

          <View style={headerStyle}>
            <Image style={imageStyle} source={{ uri: 'http://www.freeiconspng.com/uploads/data-network-icon-image-gallery-27.png' }} />
          </View>

          <View>
            <MyTextInput placeholder={lang.email} keyboardType="email-address" />
            <MyTextInput placeholder={lang.password} secureTextEntry />
            <Button title={lang.login} onPress={onLogIn} />
            <Button title={lang.forgot} onPress={() => console.log('hola')} />
          </View>

          <View>
            <Button title="Sign Up" onPress={() => console.log('hola')} />
          </View>

      </View>
    );
  }
}

const styles = {
  mainContainerStyle: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'space-between'
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  imageStyle: {
    height: 100,
    width: 100
  }
};

AppRegistry.registerComponent('esn', () => esn);
