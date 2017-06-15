import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Config } from '../settings';

class Header extends Component{

    renderButton(icon) {
        const { imageStyle } = style;

        switch (icon) {
            case 'menu':
                return <Image style={imageStyle} source={require('../img/wmnu.png')} />;
            case 'search':
                return <Image style={imageStyle} source={require('../img/wsearch.png')} />;
            case 'back':
                return <Image style={imageStyle} source={require('../img/wback.png')} />;
            default:
        }
    }

    onPress() {
        if (this.props.leftIcon === 'back') {
            Actions.pop();
        } else {
            this.props.onPress();
        }
    }

    render() {
        const { containerStyle, titleStyle } = style;
        const { rightIcon, leftIcon, title, onPress } = this.props;

        return (
            <View style={containerStyle}>
                <TouchableOpacity onPress={this.onPress.bind(this)} >
                    {this.renderButton(leftIcon)}
                </TouchableOpacity>
                <Text allowFontScaling ellipsizeMode='tail' numberOfLines={2} style={titleStyle} >
                    {title}
                </Text>
                <TouchableOpacity>
                    {this.renderButton(rightIcon)}
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
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    imageStyle: {
        width: 24,
        height: 24,
        marginLeft: 10,
        marginRight: 10
    },
    titleStyle: {
        fontSize: 23,
        color: Config.colors.mainText,
        textAlign: 'center',
        flex: 3
    },
    buttonStyles: {
        flex: 1
    }

});

export { Header };
