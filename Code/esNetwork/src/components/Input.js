import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { regex, colors, texts } from '../config';

class Input extends Component {

    state = { isError: false, 
              errorText: '', 
              text: '', 
              isFocused: false, 
              keyboardType: 'default', 
              secureTextEntry: false 
            };

    componentWillMount() {
        this.setInputConfig();
    }

    onTextChanged(text) {
        this.setState({ text });
        this.validateInput(text);
    }

    onFocus() {
        this.setState({ isFocused: true });
        console.log(this.state.isFocused);
    }

    onBlur() {
        this.setState({ isFocused: false });
        console.log(this.state.isFocused);
    }

    setInputConfig() {
        switch (this.props.type) {
            case 'email':
                this.setState({ keyboardType: 'email-address' });
                break;
            case 'password':
                this.setState({ secureTextEntry: true });
                break;
            default:
                this.setState({ keyboardType: 'default' });
        }
    }

    isValidText(text) {
        const re = regex.textOnly;
        return !re.test(text);
    }

    isValidEmail(email) {
        const re = regex.email;
        return !re.test(email);
    }

    validateInput(text) {
        switch (this.props.type) {
            case 'email':
                this.setState({ isError: this.isValidEmail(text) });
                this.setState({ errorText: texts.invalidEmail });
                break;
            case 'text':
                if (!this.isValidText(text)) {
                    this.setState({ text: text.replace(regex.textOnly, '') });
                }
                break;
            default:
                this.setState({ keyboardType: 'default' });
        }        
    }

    renderLabel() {
        if (this.state.text !== '') {
            return this.props.label;
        }
        
        return '';        
    }

    renderError() {
        if (this.state.isError) {
            return this.state.errorText;
        }
        
        return '';
    }

    render() {
        const { 
            viewStyle, 
            labelTextStyle, 
            inputStyle, 
            activeLabelStyle, 
            inactiveLabelStyle,
            validInputStyle,
            invalidInputStyle
        } = styles;

        return (
            <View style={viewStyle}>
                <Text 
                    style={[labelTextStyle, this.state.isFocused ? activeLabelStyle : inactiveLabelStyle]}
                >{this.renderLabel()}
                </Text>
                <TextInput 
                    style={[inputStyle, !this.state.isError ? validInputStyle : invalidInputStyle]}
                    autoCorrect={false}                  
                    underlineColorAndroid='transparent'                       
                    placeholderTextColor={colors.lightText}
                    value={this.state.text}
                    keyboardType={this.state.keyboardType}
                    secureTextEntry={this.state.secureTextEntry}                    
                    onChangeText={this.onTextChanged.bind(this)}
                    onBlur={this.onBlur.bind(this)}
                    onFocus={this.onFocus.bind(this)}
                    autoCapitalize={this.props.autoCapitalize}
                    returnKeyType={this.props.returnKeyType}
                    placeholder={this.props.label}                     
                />
                <Text style={styles.errorTextStyle} >{this.renderError()}</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    viewStyle: {
        height: 54,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'transparent',
    },
    labelTextStyle: {
        fontSize: 10,
        height: 12,
    },
    activeLabelStyle: {
        color: colors.main,
        fontWeight: '600'
    },
    inactiveLabelStyle: {
        color: colors.inactive
    },    
    errorTextStyle: {
        color: colors.error,
        fontSize: 10,
        height: 12
    },
    inputStyle: {
        height: 24,
        lineHeight: 24,
        padding: 0
    },
    validInputStyle: {
        borderBottomColor: colors.lightText,
        borderBottomWidth: 1,
    },
    invalidInputStyle: {
        borderBottomColor: colors.error,
        borderBottomWidth: 2,
    }
});

export { Input };
