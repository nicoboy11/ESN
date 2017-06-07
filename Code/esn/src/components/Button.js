import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';

const Button = ({ title, onPress, animating }) => {
    const { touchableStyle, textStyle, activityStyle } = styles;
    return (
        <TouchableOpacity style={touchableStyle} onPress={onPress}>
            <Text style={textStyle} disable={!animating} >{title}</Text>
            <ActivityIndicator style={activityStyle} color='#FFF' animating={animating} />
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
