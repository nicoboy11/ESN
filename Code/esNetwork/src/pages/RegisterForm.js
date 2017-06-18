import React, { Component } from 'react';
import { ScrollView, StyleSheet, Keyboard, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Input, DatePicker, Button } from '../components';
import { Config, Database } from '../settings';

const { texts } = Config;

class RegisterForm extends Component {
    state = { 
        dateOfBirth: null,
        loading: 0,
        names: '',
        firstLastName: '',
        secondLastName: '',
        email: '',
        password: '',
        genderId: 1
    }

    onChangeDate(dateISO) {
        this.setState({ dateOfBirth: dateISO });
    }

    onRegisterPress() {
        const { dateOfBirth, 
                loading, 
                names, 
                firstLastName,
                secondLastName, 
                email, 
                genderId,
                password } = this.state;

        this.setState({ loading: 1 });  
        Keyboard.dismiss();

        if (password === '') {
            Alert.alert('Incomplete form', 'A password must be provided');
        }
         
        Database.request(
            'POST', 
            'person', 
            { dateOfBirth, 
              loading, 
              names, 
              firstLastName,
              secondLastName, 
              email, 
              password,
              genderId
            }, 
            false,
            this.handleResponse.bind(this), this.onLoginResponse.bind(this), 
            this.onError.bind(this));
    }    

    onLoginResponse(responseData) {
        const { status } = this.state;
        console.log('Response');
        if (status > 399) {
            Alert.alert(texts.loginFailed, responseData.message);
        } else {
            Actions.login();
        }

        this.refresh();
    }    

    onError(error) {
        console.log(error);
        this.refresh();
    }

    handleResponse(response) {
        console.log(response.status);
        this.setState({ status: response.status });
        return response.json();
    }

    refresh() {
        this.setState({ loading: 0 });
    }

    render() {
        const { mainViewStyle } = styles;
        return (
            <ScrollView style={mainViewStyle}>
                <Input 
                    label={texts.names} 
                    type='text' 
                    returnKeyType='next' 
                    onChangeText={(names) => this.setState({ names })}
                    value={this.state.names}
                    autoCapitalize='sentences'
                />
                <Input 
                    label={texts.firstLastName} 
                    type='text' 
                    returnKeyType='next' 
                    onChangeText={(firstLastName) => this.setState({ firstLastName })}
                    value={this.state.firstLastName}
                    autoCapitalize='sentences'
                />
                <Input 
                    label={texts.secondLastName} 
                    type='text' 
                    returnKeyType='next' 
                    onChangeText={(secondLastName) => this.setState({ secondLastName })}
                    value={this.state.secondLastName}
                    autoCapitalize='sentences'
                />
                <Input 
                    label={texts.email} 
                    type='email' 
                    returnKeyType='next' 
                    onChangeText={(email) => this.setState({ email })}
                    value={this.state.email}                    
                />
                <Input 
                    label={texts.password} 
                    type='password' 
                    returnKeyType='next' 
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.password}                    
                />
                <DatePicker 
                    label={texts.dateOfBirth} 
                    onChangeDate={this.onChangeDate.bind(this)}
                />
                <Button 
                    title={texts.signup} 
                    animating={this.state.loading}
                    onPress={this.onRegisterPress.bind(this)} 
                />   
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    mainViewStyle: {
        paddingLeft: 20,
        paddingRight: 20,    
        paddingTop: 60    
    }
});

export { RegisterForm };
