import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Platform, Alert, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Config } from '../settings';

const { colors, font } = Config;

class Header extends Component {
    state = { localStyle: {}, isSearching: false };

    componentWillMount() {
        this.setState({ localStyle: styles.localTitleStyle });
    }

    componentWillReceiveProps(newProps) {
        this.setState({ isSearching: newProps.isSearching });
    }

    componentDidUpdate() {
        if (this.input) {
            this.input.focus();
        }
    }

    onPressLeft() {
        if (this.props.leftIcon === 'back' && this.props.onPressLeft === undefined) {
            Actions.pop({ refresh: { dataFromChild: this.props.data } });
        } else {
            this.props.onPressLeft();
        }
    }

    onPressRight(pressedIcon) {
        this.props.onPressRight(pressedIcon);
    }

    onChangeText(text) {
        this.setState({ searchText: text });
        this.props.onSearch(text);
        //console.log(newText);
    }   

    handleTitleLayout(event) {
        if (event.nativeEvent.layout.height > 28) {
            this.setState({ localStyle: styles.localTitleStyleSmall });
        }
    } 

    renderButton(icon, color) {
        const { imageStyle } = styles;

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
        const { rightIcon, rightColor } = this.props;

        if (rightIcon === undefined) {
            return <View style={{ paddingLeft: 10 }} />;
        }

        const iconsArray = rightIcon.split(',');
        let buttonsJSX = [];
        for (let i = 0; i < iconsArray.length; i++) {
            buttonsJSX.push(
                <TouchableOpacity 
                    key={iconsArray[i]}
                    style={{ width: 44 }} 
                    onPress={() => { this.onPressRight(iconsArray[i]); }} 
                >
                    {this.renderButton(iconsArray[i], rightColor)}
                </TouchableOpacity>                   
            );
        }

        return buttonsJSX;
    }    

    renderTitle() {
        if (this.state.isSearching) {
            return (
                <TextInput 
                    placeholder={this.props.searchPlaceholder} 
                    style={styles.localTitleStyle} 
                    autoCorrect={false}
                    value={this.state.searchText}
                    onChangeText={this.onChangeText.bind(this)}
                    ref={(input) => { this.input = input; }}
                />
            );
        }

        return (
            <Text 
                ref={(ref) => { this.txt = ref; }}
                allowFontScaling 
                ellipsizeMode='tail' 
                numberOfLines={2} 
                style={[this.state.localStyle, styles.localTitleStyle]}
                onLayout={this.handleTitleLayout.bind(this)}
            >
                {this.props.title}
            </Text>            
        );
    }

    render() {
        const { containerStyle, shadow } = styles;
        const { isVisible, background } = this.props;

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
                {this.renderTitle()}
                {this.renderRight()}                 
            </View>        
        );
    }
}

const styles = StyleSheet.create({

    containerStyle: {
        height: (Platform.OS === 'ios') ? 60 : 40,
        backgroundColor: Config.colors.background,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        zIndex: 99
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
    localTitleStyle: {
        fontSize: 18,
        lineHeight: 20,
        color: Config.colors.mainDark,
        textAlign: 'left',
        flex: 3,
        fontFamily: font.normal
    },
    localTitleStyleSmall: {
        fontSize: 14,
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
