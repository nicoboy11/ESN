import React, { Component } from 'react';
import { Text } from 'react-native';
import { Chat, Form } from '../components';

class TaskMessageForm extends Component {

    render() {
        return (
            <Form
                leftIcon='back'
                title={this.props.name}
            >
                <Chat taskId={this.props.taskId} />
            </Form>
        );
    }
}

export { TaskMessageForm };
