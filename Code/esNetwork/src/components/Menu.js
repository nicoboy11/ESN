import React, { Component } from 'react';
import { Animated, View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Config } from '../settings';

const screen = Dimensions.get('screen');
const { texts } = Config;

class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: new Animated.Value(0)
        };
    }

    componentDidMount() {
        Animated.spring(this.state.width, {
            toValue: screen.width
        }).start();
    }

    hide() {
        this.state.width.setValue(screen.width);
        Animated.spring(this.state.width, {
            toValue: 0
        }).start();        
        this.props.closeMenu();
    }

    render() {
        const { 
            containerStyle, 
            listContainerStyle, 
            fadeContainerStyle, 
            listItemStyle,
            listItemContainerStyle
        } = styles;

        return (
            <Animated.View style={[containerStyle, { width: this.state.width }]}>
                <View style={listContainerStyle}>
                    <TouchableOpacity onPress={() => { this.hide(); Actions.account(); }} style={listItemContainerStyle}>
                        <Text style={listItemStyle}>{texts.accountSettings}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.hide(); Actions.profileImage(); }} style={listItemContainerStyle}>
                        <Text style={listItemStyle}>{texts.profileImage}</Text>                        
                    </TouchableOpacity>
                    <TouchableOpacity style={listItemContainerStyle}>
                        <Text style={listItemStyle}>{texts.logout}</Text>                        
                    </TouchableOpacity>                                        
                </View>   
                <View style={fadeContainerStyle} />   
            </Animated.View>

        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        position: 'absolute',
        backgroundColor: 'transparent',
        bottom: 0,
        top: 60,
        flexDirection: 'row',
    },
    listContainerStyle: {
        flex: 4,
        backgroundColor: Config.colors.main,
    },
    fadeContainerStyle: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    listItemStyle: {
        color: Config.colors.mainText,
        fontSize: 18
    },
    listItemContainerStyle: {
        marginTop: 10,
        marginLeft: 10
    }
});

export { Menu };
