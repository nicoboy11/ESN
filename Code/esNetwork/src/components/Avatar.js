import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Config } from '../settings';

const { colors } = Config;

const Avatar = ({ avatar, color, name, size }) => {
    const sizes = {
        mini: 15,
        small: 20,
        big: 40,
        huge: 120
    };

    const styles = StyleSheet.create({
        avtStyle: {
            width: sizes[size],
            height: sizes[size],
            borderRadius: sizes[size] / 2,
            justifyContent: 'center',
            alignItems: 'center'
        },
        containerStyle: {
            flexDirection: 'row'          
        },
        nameStyle: {
            fontSize: 12,
            marginLeft: 5
        },
        abbrStyle: {
            color: colors.mainText,
            fontSize: sizes[size] / 2  
        }
    });

    const avt = (avatar.length < 3) ?
                (<View style={[styles.avtStyle, { backgroundColor: color }]}>
                    <Text style={styles.abbrStyle}>{avatar}</Text>
                </View>) :
                <Image style={styles.avtStyle} source={{ uri: avatar }} />;

    return (
        <View style={styles.containerStyle}>
            {avt}
            <Text style={styles.nameStyle} >{name}</Text>
        </View>
    );
};

export { Avatar };
