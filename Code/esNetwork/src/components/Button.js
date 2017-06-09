import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';

const Button = ({ title, onPress, animating }) => {
    const { touchableStyle, textStyle, activityStyle } = styles;
    return (
        <TouchableOpacity style={touchableStyle} onPress={onPress} disable={animating}>
            <Text style={textStyle} >{title}</Text>
            <ActivityIndicator style={[activityStyle, { opacity: animating }]} color='#FFF' animating />
        </TouchableOpacity>
    );
};

const styles = {
    touchableStyle: {
        backgroundColor: '#2C7BB2',
        justifyContent: 'center',
        height: 40,
        borderRadius: 3,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textStyle: {
        textAlign: 'center',
        color: '#FFF'
    },
    activityStyle: {
        position: 'absolute',
        right: 5
    }

};


export { Button };
