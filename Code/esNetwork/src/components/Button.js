import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Config } from '../settings';

const { colors } = Config;

const Button = ({ title, onPress, animating }) => {
    const { touchableStyle, textStyle, activityStyle } = styles;
    return (
        <TouchableOpacity style={touchableStyle} onPress={onPress} disable={animating}>
            <Text style={textStyle} >{title}</Text>
            <ActivityIndicator style={[activityStyle, { opacity: animating }]} color={colors.mainText} animating />
        </TouchableOpacity>
    );
};

const styles = {
    touchableStyle: {
        backgroundColor: colors.main,
        justifyContent: 'center',
        height: 40,
        borderRadius: 3,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textStyle: {
        textAlign: 'center',
        color: colors.mainText
    },
    activityStyle: {
        position: 'absolute',
        right: 5
    }

};


export { Button };
