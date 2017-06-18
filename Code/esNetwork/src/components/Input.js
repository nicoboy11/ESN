import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Config, Helper } from '../settings';

const { colors, texts, regex } = Config;

class Input extends Component {

    state = { isError: false, 
              errorText: '', 
              text: this.props.value, 
              isFocused: false, 
              keyboardType: 'default', 
              secureTextEntry: false,
              editable: true
            };

    componentWillMount() {
        console.log(Helper);
        this.setInputConfig();
    }

    onTextChanged(text) {
        const newText = this.validateInput(text);
        this.setState({ text: newText });
        this.props.onChangeText(newText);
        console.log(newText);
    }

    onFocus() {
        this.setState({ isFocused: true });
    }

    onBlur() {
        this.setState({ isFocused: false });
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

        if (this.props.editable !== undefined) {
            this.setState({ editable: this.props.editable });
        }
    }

    validateInput(text) {
        let newText = text;
        switch (this.props.type) {
            case 'email':
                this.setState({ isError: Helper.isValidEmail(text) });
                this.setState({ errorText: texts.invalidEmail });
                break;
            case 'text':
                if (!Helper.isValidText(text)) {
                    newText = text.replace(regex.textOnly, '');
                }
                break;
            default:
                this.setState({ keyboardType: 'default' });
        }
        return newText;
    }

    renderLabel() {
        if (this.state.text !== '') {
            return this.props.label;
        }
        
        return '';        
    }

    renderInput() {
        const {            
            inputStyle, 
            validInputStyle,
            invalidInputStyle   
        } = styles;

        if (!this.state.editable) {
            return <Text style={inputStyle}>{this.state.text}</Text>;
        }
        return (
            <View style={{ flex: 1 }}>
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
            activeLabelStyle, 
            inactiveLabelStyle,
        } = styles;

        return (
            <View style={viewStyle}>
                <Text 
                    style={[labelTextStyle, 
                            this.state.isFocused ? activeLabelStyle : inactiveLabelStyle]}
                >{this.renderLabel()}
                </Text>
                {this.renderInput()}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    viewStyle: {
        height: 56,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'transparent',
    },
    labelTextStyle: {
        fontSize: 12,
        height: 15,
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
        fontSize: 12,
        height: 15
    },
    inputStyle: {
        height: 24,
        lineHeight: 24,
        padding: 0,
        fontSize: 18,
        color: '#444'
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
