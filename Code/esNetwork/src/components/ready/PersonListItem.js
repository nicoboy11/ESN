import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { Avatar } from '../';
import { Config } from '../../settings';

const { colors } = Config;

class PersonListItem extends Component {

    onSelection() {
        this.props.onSelection(this.props.title, this.props.id);
    }

    render() {
        const { 
            avatar,
            title,
            subtitle,
            icon
        } = this.props;

        const { 
            itemStyle, 
            iconStyle, 
            avatarContainer, 
            textContainer, 
            imageContainer,
            titleStyle,
            subtitleStyle
        } = styles;

        return (
            <TouchableNativeFeedback
                onPress={this.onSelection.bind(this)}
            >
                <View style={itemStyle}>
                        <View style={avatarContainer}>
                            <Avatar 
                                avatar={avatar.avatar}
                                color={avatar.color}
                                name={avatar.name}
                                size={avatar.size}
                            />
                        </View>
                        <View style={textContainer}>
                            <Text style={titleStyle}>{title}</Text>
                            <Text style={subtitleStyle}>{subtitle}</Text>
                        </View>
                        <View style={imageContainer}>
                            <Image 
                                tintColor={colors.clickable}
                                style={iconStyle}
                                source={{ uri: icon }}
                            />
                        </View>
                </View>
            </TouchableNativeFeedback>        
        );
    }
}

const styles = new StyleSheet.create({
    itemStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10
    },
    iconStyle: {
        width: 24,
        height: 24
    },
    avatarContainer: {
        flex: 1
    },
    textContainer: {
        flex: 3
    },
    imageContainer: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    titleStyle: {
        fontSize: 18,
        color: colors.mainDark
    },
    subtitleStyle: {
        fontSize: 14,
        color: colors.secondText
    }

    
});

export { PersonListItem };
