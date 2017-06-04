import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const LinkButton = ({ title, onPress }) => {
    const { touchableStyle, textStyle } = styles;
    return (
        <TouchableOpacity style={touchableStyle} onPress={onPress}>
            <Text style={textStyle} >{title}</Text>
        </TouchableOpacity>
    );
};

const styles = {
    touchableStyle: {
        justifyContent: 'center',
        height: 40,
        borderRadius: 3
    },
    textStyle: {
        textAlign: 'center',
        color: '#2C7BB2'
    }
};


export { LinkButton };
