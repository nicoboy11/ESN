import React, { Component } from 'react';
import { View, Image, Alert, Keyboard } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Input, LinkButton, Button } from '../components';
import { Config, Database } from '../settings';

const { texts } = Config;

export default class LoginForm extends Component {

    state = { loading: 0, email: '', password: '' }

    onLoginResponse(responseData) {
        const { status } = this.state;
        console.log('Response');
        if (status > 399) {
            Alert.alert(texts.loginFailed, responseData.message);
        } else {
            /**
             * Create DataBase object for user
             */
             const token = Database.realm('Session', { token: responseData[0].token }, 'create', '');
            /** Go to main screen */
            Actions.main();
        }

        this.refresh();
    }

    onError(error) {
        console.log(error);
        this.refresh();
    }

    onLoginPress() {
        const { email, password } = this.state;
        this.setState({ loading: 1 });  
        Keyboard.dismiss();
         
        Database.request('POST', 'loginUser', { email, password }, 
            this.handleResponse.bind(this), this.onLoginResponse.bind(this), 
            this.onError.bind(this));
    }

    refresh() {
        this.setState({ loading: 0 });
        this.setState({ password: '' });
    }    

    handleResponse(response) {
        console.log(response.status);
        this.setState({ status: response.status });
        return response.json();
    }    

    render() {
        const { mainContainerStyle, logoContainerStyle, inputContainerStyle, imageStyle,
                topInputStyle, bottomInputStyle } = styles;
        
        return (
            <View style={mainContainerStyle}>
                    <View style={logoContainerStyle}>
                    <Image 
                            style={imageStyle} 
                            source={{ uri: 'http://www.freeiconspng.com/uploads/data-network-icon-image-gallery-27.png' }} 
                    />
                    </View>
                    <View style={inputContainerStyle}>
                        <View style={topInputStyle}>
                            <Input 
                                label={texts.email}
                                returnKeyType='next' 
                                type='email' 
                                onChangeText={(text) => this.setState({ email: text })}
                                value={this.state.email}
                            />
                            <Input 
                                label={texts.password} 
                                returnKeyType='next' 
                                type='password' 
                                onChangeText={(text) => this.setState({ password: text })}
                                value={this.state.password}
                            />
                            <Button 
                                title={texts.login} 
                                animating={this.state.loading}
                                onPress={this.onLoginPress.bind(this)} 
                            />                  
                        </View>  
                        <View style={bottomInputStyle}>
                            <LinkButton 
                                style={{ textAlign: 'center', marginBottom: 10 }} 
                                title={texts.signup} 
                                onPress={() => Actions.register()} 
                            />
                        </View>                              
                    </View>            
            </View>
        );
    }
}


const styles = {
  mainContainerStyle: {
    flex: 1,
    flexDirection: 'column'
  },
  logoContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  inputContainerStyle: {
    flex: 3,
    justifyContent: 'space-between'
  },
  topInputStyle: {
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'space-between',
    flex: 3
  },
  bottomInputStyle: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingLeft: 5,
    paddingRight: 5,
    flex: 4
  },
  imageStyle: {
    height: 50,
    width: 50
  }
};
