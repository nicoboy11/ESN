import React, { Component } from 'react';
import { View, Image, Alert, Keyboard, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import OneSignal from 'react-native-onesignal';
import { Input, LinkButton, Button, KeyboardSpacer } from '../components';
import { Config, Database, Helper } from '../settings';

const { texts } = Config;

class LoginForm extends Component {

    state = { loading: 0, email: '', password: '', message: '' }

    componentWillMount() {
        const data = Database.realm('Session', { }, 'select', '');
        if (data[0] !== undefined && data.length > 0) {
            Actions.tabbar();
        }
    }

    componentDidMount() {
        const self = this;
        OneSignal.addEventListener('ids', (device) => {
            this.setState({ playerId: device.userId });
        });          
    }

    componentWillReceiveProps() {
        this.setState({ loading: 0, email: '', password: '', message: '' });
    }

    onLoginResponse(responseData) {
        const { status } = this.state;
        console.log('Response');

        if (status > 399 || status === undefined) {
            if (status === 422) {
                Alert.alert(texts.loginFailed, responseData.message);                
            } else {
                Alert.alert(texts.loginFailed, responseData.message);
            }
            this.setState({ loading: 0 });
        } else {
            /**
             * Create DataBase object for user
             */                             

             const data = [{
                token: responseData[0].token,
                personId: responseData[0].personId,
                names: responseData[0].names,
                firstLastName: responseData[0].firstLastName,
                secondLastName: responseData[0].secondLastName,
                dateOfBirth: Helper.toDate(responseData[0].dateOfBirth),
                email: responseData[0].email,
                mobile: responseData[0].mobile,
                phone: responseData[0].phone,
                ext: responseData[0].ext,
                genderId: responseData[0].genderId,
                avatar: responseData[0].avatar,
                abbr: responseData[0].abbr,  
                levelKey: responseData[0].levelKey,
                theme: responseData[0].theme,
                isSync: true
            }];

            Database.realm('Session', data, 'create', '');

            const officeData = [{
                companyId: 1,
                officeId: 1,
                name: 'Matriz',
                address1: 'string',
                address2: 'string',
                postCode: 'string',
                cityId: 1,
                northLatitude: '53.3846',
                westLongitude: '-1.4793',
                southLatitude: '53.3840,',
                eastLongitude: '-1.4787',
            }];

            Database.realm('Office', officeData, 'create', '');

            Helper.loadRealms(responseData[0].personId);
            let dataOS = {};

            if(Platform.OS == 'ios') {
                dataOS = { os_ios: this.state.playerId };
            } else {
                dataOS = { os_android: this.state.playerId };
            }

            //update push notification token
            Database.request2('PUT', `person/${responseData[0].personId}`, dataOS, 1, (err, response) => {
                if (err) {
                    Alert.alert('Error', response.message);
                } else {
                    /** Go to main screen */
                    Actions.tabbar({ personId: responseData[0].personId });
                }
            });              
        }
    }

    onError(error) {
        console.log(error);
        Alert.alert('Error', error.message);
        this.setState({ password: '' });
        this.setState({ loading: 0 });
    }

    onLoginPress() {
        const { email, password } = this.state;
        this.setState({ loading: 1 });  
        Keyboard.dismiss();
         
        Database.request('POST', 'loginUser', { email, password }, 0,
            this.handleResponse.bind(this), 
            this.onLoginResponse.bind(this), 
            this.onError.bind(this));
    }

    handleResponse(response) {
        console.log(response.status);
        this.setState({ status: response.status });        
        return response.json();
    }    

    render() {
        const { mainContainerStyle, logoContainerStyle, inputContainerStyle,
                topInputStyle, bottomInputStyle } = styles;
        
        return (
            <View style={mainContainerStyle}>
                    <View style={logoContainerStyle}>
                    {/*<Image 
                            style={imageStyle} 
                            source={{ uri: 'http://www.freeiconspng.com/uploads/data-network-icon-image-gallery-27.png' }} 
                    />*/}
                    </View>
                    <View style={inputContainerStyle}>
                        <View style={topInputStyle}>
                            <Input 
                                label={texts.email}
                                returnKeyType='next' 
                                type='email' 
                                onChangeText={(text) => this.setState({ email: text })}
                                value={this.state.email}
                                onSubmitEditing={() => this.inptPassword.focus()}
                            />
                            <Input 
                                ref={(ref) => { this.inptPassword = ref; }}
                                label={texts.password} 
                                returnKeyType='next' 
                                type='password' 
                                onChangeText={(text) => this.setState({ password: text })}
                                value={this.state.password}
                                onSubmitEditing={this.onLoginPress.bind(this)}
                            />
                            <Button 
                                title={texts.login} 
                                animating={this.state.loading}
                                message={this.state.message}
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
                        {(Platform.OS === 'ios') ? <KeyboardSpacer /> : <View />}
                                                   
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

export { LoginForm };
