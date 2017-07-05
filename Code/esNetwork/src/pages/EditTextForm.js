import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { Form } from '../components';

class EditTextForm extends Component {
    state = { text: this.props.text }

    componentDidMount() {
        this.input.focus();
    }

    onPressLeft() {
        this.props.onClose();
    }

    onPressRight() {
        this.props.onSave(this.state.text);
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
                        <TextInput 
                            ref={(input) => { this.input = input; }}
                            onChangeText={(text) => this.setState({ text })}
                            value={this.state.text}
                            onSubmitEditing={this.onPressRight.bind(this)}
                            multiline
                            numberOfLines={10}
                            style={{ justifyContent: 'flex-start' }}
                        />
                    </View>
                </View>
            </Form>
        );
    }
}

export { EditTextForm };
