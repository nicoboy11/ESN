import React, { Component } from 'react';
import { TextInput } from 'react-native';
import { Kaede } from 'react-native-textinput-effects';

const MyTextInput = (props) => {
    return (
        <Kaede 
            label={props.placeholder} 
            secureTextEntry={props.secureTextEntry} 
            keyboardType={props.keyboardType} 
        />
    );
};

export default MyTextInput;
