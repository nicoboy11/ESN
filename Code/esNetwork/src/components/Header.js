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

        if (icon === '' || icon === undefined) {
            return <View />;
        }

        return (
            <Image 
                tintColor={(!color) ? colors.clickable : color} 
                style={[imageStyle, { tintColor: (!color) ? colors.clickable : color }]} 
                source={{ uri: icon }} 
            />
        );
    }

    renderLeft() {
        const { leftIcon, leftColor } = this.props;

        if (this.props.leftIcon === undefined) {
            return <View style={{ paddingLeft: 10 }} />;
        }

        return (
            <TouchableOpacity style={{ width: 44 }} onPress={this.onPressLeft.bind(this)} >
                {this.renderButton(leftIcon, leftColor)}
            </TouchableOpacity>
        );        
    }

    renderRight() {

    }    

    render() {
        const { containerStyle, titleStyle, shadow } = style;
        const { rightIcon, rightColor, title, isVisible, background } = this.props;

        if (!isVisible) {
            return null;
        }

        const hasShadow = (this.props.shadow === undefined) ? true : this.props.shadow;

        return (
            <View 
                style={[
                    containerStyle, 
                    (hasShadow) ? shadow : {},
                    (background) ? { backgroundColor: background } : {}
                ]}
            >
                {this.renderLeft()}
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
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.2 },
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
        fontFamily: font.normal,
        lineHeight: 20
    },
    buttonStyles: {
        flex: 1
    }

});

export { Header };
