import React, { Component } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { Form, Input } from '../components';
import { Config } from '../settings';

const { texts } = Config;

class EditTextForm extends Component {
    state = { text: this.props.text }

    componentDidMount() {
        this.input.focus();
    }

    onPressLeft() {
        this.props.onClose();
    }

    onPressRight() {
        if (this.input.isValidInput) {
            if (this.input.isValidInput()) {
                this.props.onSave(this.state.text);
            } else {
                Alert.alert(texts.atention, texts.incorrectData);
            }
        } else {
            this.props.onSave(this.state.text);
        }
    }    

    renderTextInput() {
        if (this.props.multiline) {                
            return (
                <TextInput 
                    ref={(input) => { this.input = input; }}
                    onChangeText={(text) => this.setState({ text })}
                    value={this.state.text}
                    onSubmitEditing={this.onPressRight.bind(this)}
                    multiline
                    numberOfLines={10}
                    style={{ justifyContent: 'flex-start' }}
                />           
            ); 
        } 

        return (
            <Input 
                ref={(input) => { this.input = input; }}
                onChangeText={(text) => this.setState({ text })}
                value={this.state.text}
                onSubmitEditing={this.onPressRight.bind(this)}
                label=''
                type={this.props.type}
                style={{ justifyContent: 'flex-start' }}                
            />
        );
    }

    render() {
        return (
            <Form
                leftIcon='cancel'
                rightIcon='ok'
                title={this.props.title}
                onPressLeft={this.onPressLeft.bind(this)}
                onPressRight={this.onPressRight.bind(this)}
            >
                <View>
                    <View>
                        {this.renderTextInput()}
                    </View>
                </View>
            </Form>
        );
    }
}

export { EditTextForm };
