import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Config } from '../settings';

const { colors } = Config;

class Header extends Component{
    onPressLeft() {
        if (this.props.leftIcon === 'back') {
            Actions.pop();
        } else {
            this.props.onPressLeft();
        }
    }

    onPressRight() {
        this.props.onPressRight();
    }

    renderButton(icon, color) {
        const { imageStyle } = style;

        /*switch (icon) {
            case 'menu':
                return <Image tintColor={colors.clickable} style={imageStyle} source={{ uri: 'cancel' }} />;
            case 'edit':
                return <Image tintColor={colors.clickable} style={imageStyle} source={{ uri: 'edit' }} />;                
            case 'search':
                return <Image tintColor={colors.clickable} style={imageStyle} source={require('../img/wsearch.png')} />;
            case 'back':
                return <Image tintColor={colors.clickable} style={imageStyle} source={require('../img/wback.png')} />;
            default:
                return <Text style={{ color: colors.mainText }}>{icon}</Text>;
        }*/
        return <Image tintColor={(!color) ? colors.clickable : color} style={imageStyle} source={{ uri: icon }} />;
    }

    render() {
        const { containerStyle, titleStyle } = style;
        const { rightIcon, rightColor, leftIcon, leftColor, title, onPress, isVisible } = this.props;

        if (!isVisible) {
            return null;
        }

        return (
            <View style={[containerStyle]}>
                <TouchableOpacity style={{ width: 44 }} onPress={this.onPressLeft.bind(this)} >
                    {this.renderButton(leftIcon, leftColor)}
                </TouchableOpacity>
                <Text allowFontScaling ellipsizeMode='tail' numberOfLines={2} style={titleStyle} >
                    {title}
                </Text>
                <TouchableOpacity style={{ width: 44 }} onPress={this.onPressRight.bind(this)} >
                    {this.renderButton(rightIcon, rightColor)}
                </TouchableOpacity>                    
            </View>        
        );
    }
}

const style = StyleSheet.create({

    containerStyle: {
        height: 40,
        backgroundColor: Config.colors.background,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'flex-start'
    },
    imageStyle: {
        width: 23,
        height: 23,
        marginLeft: 10,
        marginRight: 10
    },
    titleStyle: {
        fontSize: 23,
        color: Config.colors.mainDark,
        textAlign: 'center',
        flex: 3
    },
    buttonStyles: {
        flex: 1
    }

});

export { Header };
