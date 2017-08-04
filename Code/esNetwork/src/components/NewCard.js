import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Input, Avatar, LinkButton } from './';
import { Config } from '../settings';

const { colors } = Config;

const NewCard = ({ placeholder, name, avatar, color, value, attachment, post, onChangeText, onSubmitEditing }) => {
    return (
        <View style={styles.containerStyle}>
            <Input 
                placeholder={placeholder}
                label=''
                type='extendedText' 
                returnKeyType='done' 
                onChangeText={onChangeText}
                onSubmitEditing={onSubmitEditing}
                value={value}      
                editable={true}
            /> 
            <View>
                {(post) ? <LinkButton title='POST' style={{ position: 'absolute', right: -5, bottom: -5 }} /> : <View />}
                {(attachment) ? <Image source={{ uri: 'attach' }} style={styles.attachStyle} /> : <View />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.lightText,
        padding: 10,
        marginTop: 5,
        backgroundColor: colors.elementBackground
    },
    attachStyle: {
        position: 'absolute', 
        width: 20, 
        height: 20,
        left: -5,
        bottom: -5,
        tintColor: colors.clickable
    }
});

export { NewCard };
