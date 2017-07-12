import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Config } from '../settings';

const { colors, font } = Config;

class Header extends Component {
    onPressLeft() {
        if (this.props.leftIcon === 'back' && this.props.onPressLeft === undefined) {
            Actions.pop({ refresh: { dataFromChild: this.props.data } });
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
        return (
            <Image 
                tintColor={(!color) ? colors.clickable : color} 
                style={imageStyle} 
                source={{ uri: icon }} 
            />
        );
    }

    render() {
        const { containerStyle, titleStyle, shadow } = style;
        const { rightIcon, rightColor, leftIcon, leftColor, title, isVisible } = this.props;

        if (!isVisible) {
            return null;
        }

        const hasShadow = (this.props.shadow === undefined) ? true : this.props.shadow;

        return (
            <View style={[containerStyle, (hasShadow) ? shadow : {}]}>
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
        height: (Platform.OS === 'ios') ? 60 : 40,
        backgroundColor: Config.colors.background,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 2,
        position: 'relative',
        zIndex: 99
    },
    imageStyle: {
        width: 23,
        height: 23,
        marginLeft: 10,
        marginRight: 10
    },
    titleStyle: {
        fontSize: 18,
        color: Config.colors.mainDark,
        textAlign: 'left',
        flex: 3,
        fontFamily: font.normal
    },
    buttonStyles: {
        flex: 1
    }

});

export { Header };
