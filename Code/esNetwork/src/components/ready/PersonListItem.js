import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Avatar, Touchable } from '../';
import { Config, Database } from '../../settings';
const session = Database.realm('Session', { }, 'select', '');

const { colors, font } = Config;
const space = 38;

class PersonListItem extends Component {
    state = { chevron: this.props.chevron, isOpen: this.props.isOpen };
    onPress() {
        this.props.onPress(this.props.title, this.props.id, this.props);
    }

    renderChevron() {
        const {
            chevronOpen,
            chevronClosed,
            chevronContainer            
        } = styles;

        if (this.state.chevron && this.props.isParent) {
            return (
                    <View style={chevronContainer}>
                        <Image 
                            source={{ uri: 'chevron' }}
                            tintColor={colors.secondText}
                            style={(this.props.isOpen) ? chevronOpen : chevronClosed}
                        />
                    </View>
            );
        }

        return <View />;
    }

    render() {
        const { 
            avatar,
            title,
            subtitle,
            icon
        } = this.props;

        const level = this.props.rawData.levelKey.split('-').length - 1;
        const sessionLevel = session[0].levelKey.split('-').length - 1;

        const { 
            itemStyle, 
            iconStyle, 
            avatarContainer, 
            textContainer, 
            imageContainer,
            titleStyle,
            subtitleStyle,
            miniIconStyle          
        } = styles;

        return (
            <Touchable
                onPress={this.onPress.bind(this)}
            >
                <View 
                    style={
                    [
                        itemStyle, 
                        { 
                            paddingLeft: (this.props.chevron) ? 10 + (space * (level - (sessionLevel + 1))) : 10 
                        }
                    ]}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        {this.renderChevron()}
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
                    </View>
                    {(!this.props.rawData.isSync) ? 
                        <View style={imageContainer}>
                            <Image 
                                tintColor={colors.secondText}
                                style={miniIconStyle}
                                source={{ uri: 'time' }}
                            />
                        </View> : 
                        <View />
                    }
                    {(icon) ? <View style={imageContainer}>
                        <Touchable
                            forceOpacity
                            onPress={() => this.props.onIconPress(this.props.rawData)}
                        >
                            <Image 
                                tintColor={colors.clickable}
                                style={iconStyle}
                                source={{ uri: icon }}
                            />
                        </Touchable>
                    </View> : <View />}
                </View>
            </Touchable>        
        );
    }
}

const styles = new StyleSheet.create({
    itemStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: colors.elementBackground
    },
    iconStyle: {
        width: 24,
        height: 24
    },
    miniIconStyle: {
        width: 12,
        height: 12
    },    
    avatarContainer: {
        /*flex: 1*/
        marginRight: 10
    },
    textContainer: {
        /*flex: 3*/
    },
    imageContainer: {
        /*flex: 1,*/
        alignItems: 'flex-end',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    chevronContainer: {
        /*flex: 0.5,*/
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleStyle: {
        fontSize: 18,
        color: colors.mainDark,
        fontFamily: font.light
    },
    subtitleStyle: {
        fontSize: 14,
        color: colors.secondText
    },
    chevronClosed: {
        width: 18,
        height: 18,
        marginRight: 10,
        transform: [{ rotate: '-90deg' }]
    },
    chevronOpen: {
        width: 18,
        height: 18,
        marginRight: 10
    }
});

export { PersonListItem };
