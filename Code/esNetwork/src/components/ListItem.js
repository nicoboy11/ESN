import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Config } from '../settings';

const { colors } = Config;

const ListItem = ({ text, value, isSelected, onPress }) => {
    const { 
        itemContainerStyle,
        textStyle
    } = styles;

    return (
            <TouchableOpacity onPress={() => onPress(text, value)}>
                <View 
                    style={itemContainerStyle}
                >
                    <Text 
                        style={[textStyle, { color: isSelected ? colors.main : colors.inactive }]}
                    >
                        {text}
                    </Text>
                </View>  
            </TouchableOpacity>                      
    );
};

const styles = StyleSheet.create({
    itemContainerStyle: {
        borderBottomColor: colors.lightText,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginLeft: 20,
        marginRight: 20,
        paddingTop: 10,
        paddingBottom: 10
    },
    textStyle: {
        fontSize: 18,
        textAlign: 'center'
    }
});

export { ListItem };
