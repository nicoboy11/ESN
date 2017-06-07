import React, { Component } from 'react';
import { View, Image, Alert } from 'react-native';
import { Button, Input, LinkButton } from '../components';
import lang from '../util/lang';

class LogInView extends Component {

    state = { email: '', password: '', status: '', loading: false };

    onLoginResponse(responseData) {
        const { status } = this.state;

        if (status > 399) {
            Alert.alert('Login failed.', responseData.message);
        } else {
            console.log(responseData[0].email);
        }

        this.setState({ loading: false });
    }

    onLoginPress() {
        const { email, password } = this.state;
        this.setState({ loading: true });

        fetch('http://143.167.68.15:3001/loginUser?email=' + email + '&password=' + password, { method: 'GET', body: null })
            .then(this.handleResponse.bind(this))
            .then(this.onLoginResponse.bind(this))
            .catch(this.onError.bind(this));   
    }

    onError(error) {
        console.log(error);
        this.setState({ loading: false });
    }

    handleResponse(response) {
        this.setState({ status: response.status });
        return response.json();
    }

    renderButton() {
        return (
            <Button 
                title="Log In" 
                animating={this.state.loading}
                onPress={this.onLoginPress.bind(this)} 
            />            
        );
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
                            label={lang.email} 
                            placeholder={lang.email_ph} 
                            keyboardType="email-address"
                            source={require('../components/img/email.png')}
                            onChangeText={email => this.setState({ email })}
                            value={this.state.email}
                            keyboardType='email-address'
                        />
                        <Input 
                            label={lang.password} 
                            placeholder={lang.password_ph} 
                            secureTextEntry
                            source={require('../components/img/password.png')}
                            onChangeText={password => this.setState({ password })}
                            value={this.state.password}
                        />
                        {this.renderButton()}
                        <LinkButton 
                            title="Forgot your password?" 
                            onPress={() => console.log('hola')} 
                        />
                    </View>  
                    <View style={bottomInputStyle}>
                        <LinkButton title="Sign Up" onPress={() => console.log(this.state.email)} />
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
    paddingLeft: 5,
    paddingRight: 5,
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

export default LogInView;
