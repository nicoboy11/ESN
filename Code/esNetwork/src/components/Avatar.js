import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Label } from './';
import { Config } from '../settings';

const { colors, network } = Config;

const Avatar = ({ avatar, color, name, size, nameColor, flexDirection = 'row', textStyle }) => {

    if (avatar === undefined) {
        return <View />;
    }

    const sizes = {
        mini: 15,
        small: 20,
        medium: 30,
        big: 40,
        veryBig: 60,
        huge: 120
    };

    const styles = StyleSheet.create({
        avtStyle: {
            width: sizes[size],
            height: sizes[size],
            borderRadius: sizes[size] / 2,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.mainDark,
            backgroundColor: 'transparent'
        },
        containerStyle: {
            flexDirection,
            alignItems: 'center'
        },
        nameStyle: {
            fontSize: (sizes[size] - (sizes[size] / 2)),
            color: nameColor
        },
        abbrStyle: {
            color: colors.mainText,
            fontSize: (sizes[size] / 2) - 2  
        }
    });

    const avt = (avatar.length < 3) ?
                (<View style={[styles.avtStyle, { backgroundColor: color }]}>
                    <Label style={styles.abbrStyle}>{avatar}</Label>
                </View>) :
                <Image style={[styles.avtStyle]} source={{ uri: network.server + 'thumbs/small/' + avatar }} />;

    return (
        <View style={styles.containerStyle}>
            {avt}
            <Label style={[styles.nameStyle, textStyle]} >{name}</Label>
        </View>
    );
};

export { Avatar };
