import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Config } from '../settings';

const { colors } = Config;

const LinkButton = ({ title, onPress, style }) => {
    const { touchableStyle, textStyle } = styles;
    return (
        <TouchableOpacity style={touchableStyle} onPress={onPress}>
            <Text style={[textStyle, style]} >{title}</Text>
        </TouchableOpacity>
    );
};

const styles = {
    textStyle: {
        color: colors.clickable,
        fontFamily: 'Roboto'
    }
};


export { LinkButton };
