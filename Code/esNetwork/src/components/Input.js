import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Config, Helper } from '../settings';

const { colors, texts, regex } = Config;

class Input extends Component {

    state = { isError: false, 
              errorText: '', 
              value: this.props.value, 
              isFocused: false, 
              keyboardType: 'default', 
              secureTextEntry: false,
              editable: true
            };

    componentWillMount() {
        console.log(Helper);
        this.setInputConfig(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(...this.state, nextProps);
        
        this.setInputConfig(nextProps);        
    }    

    onTextChanged(text) {
        const newText = this.validateInput(text);
        this.setState({ value: newText });
        this.props.onChangeText(newText);
        //console.log(newText);
    }

    onFocus() {
        this.setState({ isFocused: true });
    }

    onBlur() {
        this.setState({ isFocused: false });
    }

    onSubmitEditing() {
        this.props.onSubmitEditing();
    }

    setInputConfig(props) {
        switch (props.type) {
            case 'email':
                this.setState({ keyboardType: 'email-address' });
                break;
            case 'password':
                this.setState({ secureTextEntry: true });
                break;
            case 'number':
                this.setState({ keyboardType: 'phone-pad' });
                break;
            default:
                this.setState({ keyboardType: 'default' });
        }
/*
        if (props.editable !== undefined) {
            this.setState({ editable: props.editable });
        }*/
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
            case 'number':
                break;
            default:
                this.setState({ keyboardType: 'default' });
        }
        return newText;
    }

    renderLabel() {
        if (this.state.value !== '' || !this.state.editable) {
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
            return <Text style={inputStyle}>{this.state.value}</Text>;
        }
        return (
            <View style={{ flex: 1 }}>
                <TextInput 
                    style={[inputStyle, { height: this.props.height }, !this.state.isError ? validInputStyle : invalidInputStyle]}
                    autoCorrect={false}                  
                    underlineColorAndroid='transparent'                       
                    placeholderTextColor={colors.lightText}
                    value={this.props.value}
                    keyboardType={this.state.keyboardType}
                    secureTextEntry={this.state.secureTextEntry}
                    onChangeText={this.onTextChanged.bind(this)}
                    onContentSizeChange={this.props.onContentSizeChange}
                    onBlur={this.onBlur.bind(this)}
                    onFocus={this.onFocus.bind(this)}
                    onSubmitEditing={this.onSubmitEditing.bind(this)}
                    autoCapitalize={this.props.autoCapitalize}
                    returnKeyType={this.props.returnKeyType}
                    placeholder={this.props.label}
                    multiline={this.props.multiline}
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
        fontFamily: 'Roboto-Light',
        height: 15,
    },
    activeLabelStyle: {
        color: colors.main,
        fontWeight: '600'
    },
    inactiveLabelStyle: {
        color: colors.main,
        fontWeight: '200'
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
        color: colors.mainDark,
        fontFamily: 'Roboto-Light',
        fontWeight: '200'
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
