import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { LinkButton } from './';
import { Config, Helper } from '../settings';

const { colors } = Config;

class PostCard extends Component {

    personPress() {
        Actions.profile({ personId: this.props.personId });
    }

    renderAvatar() {
        const { avatarStyle, avatarTextStyle } = styles;
        const { avatar, theme } = this.props;

        if (avatar.length === 2) {
            return (
                <View style={[avatarStyle, { backgroundColor: theme }]} >
                    <Text style={avatarTextStyle}>{avatar}</Text>
                </View>
            );
        }
        
        return <Image style={avatarStyle} source={{ uri: Config.network.server + 'thumbs/small/' + avatar }} />;
    }

    render() {
        const { containerStyle, 
                menuImageStyle,
                topContainerStyle,
                bottomContainerStyle,
                titleViewStyle,
                imageViewStyle,
                unfollowViewStyle,
                titleStyle,
                dateStyle,
                mainText,
                bottomLinksStyles,
                middleContainerStyle
            } = styles;

            const { person, 
                    creationDate,
                    message } = this.props;

        return (
            <View style={containerStyle} >
                <View style={topContainerStyle} >
                    <View style={imageViewStyle} >
                        {this.renderAvatar()}
                    </View>
                    <View style={titleViewStyle} >
                        <LinkButton 
                            style={titleStyle} 
                            title={person} 
                            onPress={this.personPress.bind(this)}
                        />
                        <Text style={dateStyle} >{Helper.prettyfyDate(creationDate).date}</Text>
                    </View>
                    <View style={unfollowViewStyle} >
                        <TouchableOpacity>
                            <Image style={menuImageStyle} source={require('../img/chevronDown.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={middleContainerStyle}>
                    <Text style={mainText}>
                        {message}
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
    avatarTextStyle: {
        color: colors.mainText,
        fontSize: 18
    },
    avatarStyle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'    
    },
    topContainerStyle: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between'
    },
    middleContainerStyle: {
        marginTop: 10,
        marginBottom: 5
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
