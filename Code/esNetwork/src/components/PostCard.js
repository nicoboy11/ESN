import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinkButton } from './';
import { Config } from '../settings';

const { colors } = Config;

class PostCard extends Component {

    render() {
        const { containerStyle, 
                imageStyle,
                menuImageStyle,
                topContainerStyle,
                bottomContainerStyle,
                titleViewStyle,
                imageViewStyle,
                unfollowViewStyle,
                titleStyle,
                dateStyle,
                mainText,
                bottomLinksStyles
            } = styles;

        return (
            <View style={containerStyle} >
                <View style={topContainerStyle} >
                    <View style={imageViewStyle} >
                        <Image style={imageStyle} source={require('../img/12.jpg')} />
                    </View>
                    <View style={titleViewStyle} >
                        <LinkButton style={titleStyle} title='Even Sosa' />
                        <Text style={dateStyle} >Today</Text>
                    </View>
                    <View style={unfollowViewStyle} >
                        <TouchableOpacity>
                            <Image style={menuImageStyle} source={require('../img/chevronDown.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Text style={mainText}>
                        Hoy celebramos el día de nuestra independencia, debemos estar concientes de el cambio.
                    </Text>
                </View>
                <View style={bottomContainerStyle}>
                    <LinkButton style={bottomLinksStyles} title='Like' />
                    <Text style={bottomLinksStyles}>|</Text>
                    <LinkButton style={bottomLinksStyles} title='Comment' />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    containerStyle: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.lightText,
        padding: 10,
        marginTop: 5,
        backgroundColor: colors.elementBackground
    },
    imageStyle: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    topContainerStyle: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between'
    },
    bottomContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    titleStyle: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    dateStyle: {
        fontSize: 12
    },
    imageViewStyle: {
        flex: 1
    },
    titleViewStyle: {
        flex: 4
    },
    unfollowViewStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    mainText: {
        fontSize: 18,
        color: 'black'
    },
    bottomLinksStyles: {
        fontSize: 12,
        marginLeft: 5
    },
    menuImageStyle: {
        height: 14,
        width: 14
    }
});

export { PostCard };
