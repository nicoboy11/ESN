import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Header } from '../components';

export default class AccountForm extends Component {

    render() {
        return (
            <View>
                <Header leftIcon='back' title='Account Settings' />
                <Text>Login form</Text>
            </View>
        );
    }
}

