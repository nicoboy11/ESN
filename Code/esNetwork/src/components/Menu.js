import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class Menu extends Component {

    render() {
        const { containerStyle, listContainerStyle, fadeContainerStyle } = styles;

        return (
            <View style={containerStyle}>
                <View style={listContainerStyle}>
                    <Text>Hola</Text>
                </View>   
                <View style={fadeContainerStyle} />   
            </View>

        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        position: 'absolute',
        backgroundColor: 'transparent',
        left: 0,
        right: 0,
        bottom: 0,
        top: 60,
        flexDirection: 'row',
    },
    listContainerStyle: {
        flex: 4,
        backgroundColor: 'red'
    },
    fadeContainerStyle: {
        flex: 1,
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: 'black',
        opacity: 0.5
    }    
});

export { Menu };
