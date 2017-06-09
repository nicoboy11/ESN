import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { LinkButton } from './';
import { colors } from '../config';

class PostCard extends Component {

    render() {

        const { containerStyle, 
                imageStyle,
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
                        <LinkButton style={{ fontSize: 10 }} title='UNFOLLOW' />
                    </View>
                </View>
                <View>
                    <Text style={mainText}>
                        Hoy celebramos el día de nuestra independencia, debemos estar concientes de el cambio.
                    </Text>
                </View>
                <View style={bottomContainerStyle}>
                    <LinkButton style={bottomLinksStyles} title='LIKE' />
                    <Text style={bottomLinksStyles}>|</Text>
                    <LinkButton style={bottomLinksStyles} title='COMMENT' />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    containerStyle: {
        borderWidth: 1,
        borderColor: colors.lightText,
        padding: 10,
        marginTop: 10

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
        fontSize: 14
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
        flex: 1
    },
    mainText: {
        fontSize: 18,
        color: 'black'
    },
    bottomLinksStyles: {
        fontSize: 12,
        marginLeft: 5
    }
});

export { PostCard };
