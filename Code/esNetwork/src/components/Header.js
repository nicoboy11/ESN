import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { Config } from '../settings';

class Header extends Component{

    render() {
        const { containerStyle } = style;

        return (
            <View style={containerStyle}>
                <TouchableOpacity onPress={this.props.onPress} >
                    <Image source={require('../img/wmnu.png')} />
                </TouchableOpacity>
                <Text style={{ color: Config.colors.mainText }} >
                    Feed
                </Text>
                <TouchableOpacity>
                    <Image source={require('../img/wsearch.png')} />
                </TouchableOpacity>                    
            </View>        
        );
    }

}

const style = StyleSheet.create({

    containerStyle: {
        height: 60,
        backgroundColor: Config.colors.main,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between'
    }

});

export { Header };
