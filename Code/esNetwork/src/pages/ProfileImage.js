import React, { Component } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { Header, Form } from '../components';
import { Config } from '../settings';
import { Actions } from 'react-native-router-flux';

const { texts } = Config;

class ProfileImage extends Component {

    render() {
        return (
            <Form 
                leftIcon='menu'
                rightIcon='search'
                title='Profile'
                menuList={ 
                    [{ name: 'Profile', form: 'account' }]
                }
                isVisible={false}
            >
                <Text>Contenido desde afuera</Text>
            </Form>
        );
    }
}

export { ProfileImage };
