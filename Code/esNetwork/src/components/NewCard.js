import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Avatar } from './';
import { Config } from '../settings';

const { colors } = Config;

const NewCard = ({ placeholder, name, avatar, color, value, onChangeText, onSubmitEditing }) => {
    return (
        <View style={styles.containerStyle}>
            <Input 
                placeholder={placeholder}
                label=''
                type='text' 
                returnKeyType='done' 
                onChangeText={onChangeText}
                onSubmitEditing={onSubmitEditing}
                value={value}      
                editable={true}
            /> 
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
    }
});

export { NewCard };
