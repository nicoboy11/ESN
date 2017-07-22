import React, { Component } from 'react';
import { ScrollView, StyleSheet, Keyboard, Alert, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Input, DatePicker, Button, KeyboardSpacer, Form } from '../components';
import { Config, Database } from '../settings';

const { texts, colors } = Config;

class RegisterForm extends Component {
    state = { 
        dateOfBirth: null,
        loading: 0,
        names: '',
        firstLastName: '',
        secondLastName: '',
        email: '',
        password: '',
        password2: '',
        genderId: 1,
        mobile: '',
        phone: '',
        ext: '',
        rightIcon: 'forward',
        currentSection: 1,
        title: texts.register
    }

    onChangeDate(dateISO) {
        this.setState({ dateOfBirth: dateISO });
    }

    onPressLeft() {
        switch (this.state.currentSection) {
            case 1:
                Actions.pop();
                return;
            case 2:
                this.setState({ currentSection: 1, title: texts.register });
                return;
            case 3:
                this.setState({ currentSection: 2, title: texts.personalInfo });
                return;
            case 4:
                this.setState({ currentSection: 3, title: texts.contactInfo, rightIcon: 'forward' });
                return;
            default:
                return;
        }
    }

    onPressRight() {
        switch (this.state.currentSection) {
            case 1:
                this.setState({ currentSection: 2, title: texts.personalInfo });
                return;
            case 2:
                this.setState({ currentSection: 3, title: texts.contactInfo });
                return;
            case 3:
                this.setState({ currentSection: 4, title: texts.securityInfo, rightIcon: '' });
                return;
            case 4:
                return;
            default:
                return;
        }
    }

    onRegisterPress() {
        const { dateOfBirth, 
                loading, 
                names, 
                firstLastName,
                secondLastName, 
                email, 
                genderId,
                password,
                mobile } = this.state;

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
              genderId,
              mobile
            }, 
            false,
            this.handleResponse.bind(this), 
            this.onLoginResponse.bind(this), 
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

    renderSections() {
        const { mainViewStyle } = styles;
        switch (this.state.currentSection) {
            case 1:
                return (
                    <ScrollView 
                        style={[mainViewStyle, { opacity: this.state.section1 }]}
                    >
                        <Input 
                            ref={(ref) => { this.inptName = ref; }}
                            label={texts.names} 
                            type='text' 
                            returnKeyType='next' 
                            onChangeText={(names) => this.setState({ names })}
                            value={this.state.names}
                            autoCapitalize='sentences'
                            onSubmitEditing={() => this.inptLastName.focus()}  
                        />
                        <Input 
                            ref={(ref) => { this.inptLastName = ref; }}
                            label={texts.firstLastName} 
                            type='text' 
                            returnKeyType='next' 
                            onChangeText={(firstLastName) => this.setState({ firstLastName })}
                            value={this.state.firstLastName}
                            autoCapitalize='sentences'
                            onSubmitEditing={() => this.inptSecLastName.focus()}  
                        />
                        <Input 
                            ref={(ref) => { this.inptSecLastName = ref; }}
                            label={texts.secondLastName} 
                            type='text' 
                            returnKeyType='next' 
                            onChangeText={(secondLastName) => this.setState({ secondLastName })}
                            value={this.state.secondLastName}
                            autoCapitalize='sentences'
                            onSubmitEditing={() => this.onPressRight()}  
                        />
                        <KeyboardSpacer /> 
                    </ScrollView>
                );
            case 2:
                return (
                    <ScrollView 
                        style={[mainViewStyle, { opacity: this.state.section2 }]}
                    >
                        <DatePicker 
                            label={texts.dateOfBirth} 
                            onChangeDate={this.onChangeDate.bind(this)}
                            editable
                        />
                        <KeyboardSpacer /> 
                    </ScrollView>
                );
            case 3:
                return (
                    <ScrollView 
                        style={[mainViewStyle, { opacity: this.state.section3 }]}
                    >
                        <Input 
                            label={texts.email} 
                            type='email' 
                            returnKeyType='next' 
                            onChangeText={(email) => this.setState({ email })}
                            value={this.state.email}          
                            onSubmitEditing={() => this.inptPhone.focus()}          
                        />
                        <Input 
                            ref={(ref) => { this.inptPhone = ref; }}
                            label={texts.phone} 
                            type='number' 
                            returnKeyType='next' 
                            onChangeText={(phone) => this.setState({ phone })}
                            value={this.state.phone}          
                            onSubmitEditing={() => this.inptExt.focus()}             
                        />    
                        <Input 
                            ref={(ref) => { this.inptExt = ref; }}
                            label={texts.ext} 
                            type='number' 
                            returnKeyType='next' 
                            onChangeText={(ext) => this.setState({ ext })}
                            value={this.state.ext}       
                            onSubmitEditing={() => this.inptMobile.focus()}                
                        />                                            
                        <Input 
                            ref={(ref) => { this.inptMobile = ref; }}
                            label={texts.mobile} 
                            type='number' 
                            returnKeyType='next' 
                            onChangeText={(mobile) => this.setState({ mobile })}
                            value={this.state.mobile}        
                            onSubmitEditing={() => this.onPressRight()}               
                        />         
                        <KeyboardSpacer />           
                    </ScrollView> 
                );
            case 4:
                return (
                    <ScrollView 
                        style={[mainViewStyle, { opacity: this.state.section4 }]}
                    >
                        <Input 
                            label={texts.password} 
                            type='password' 
                            returnKeyType='next' 
                            onChangeText={(password) => this.setState({ password })}
                            value={this.state.password}                    
                        />
                        <Input 
                            label={texts.password} 
                            type='password' 
                            returnKeyType='next' 
                            onChangeText={(password2) => this.setState({ password2 })}
                            value={this.state.password2}                    
                        />                    
                        <Button 
                            title={texts.signup} 
                            animating={this.state.loading}
                            onPress={this.onRegisterPress.bind(this)} 
                        />   
                        <KeyboardSpacer /> 
                    </ScrollView>                        
                );
            default:
                return <View />;
        }
    }

    render() {
        return (
            <Form
                title={this.state.title}
                leftIcon='back'
                rightIcon={this.state.rightIcon}
                onPressLeft={this.onPressLeft.bind(this)}
                onPressRight={this.onPressRight.bind(this)}
                background={colors.main}
                titleStyle={{ color: colors.elementBackground }}
                rightColor={colors.elementBackground}
                leftColor={colors.elementBackground}
            >
                {this.renderSections()}
            </Form>
            
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
