import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Touchable } from '../';
import { Config, Helper } from '../settings';

const { colors } = Config;

const TaskBasic = (props) => {
    const { title, date, subtitle, id, onPress } = props;

    const { 
        containerStyle, 
        infoContainerStyle, 
        dateContainerStyle, 
        projectTextStyle, 
        taskTextStyle 
    } = styles;

    return (
        <Touchable key={id} onPress={() => onPress(props)}>
            <View style={containerStyle}>
                <View style={infoContainerStyle}>
                    <Text style={projectTextStyle}>{subtitle}</Text>
                    <Text style={taskTextStyle}>{title}</Text>
                </View>
                <View style={dateContainerStyle}>
                    <Text 
                        style={{ color: Helper.prettyfyDate(date).color }}
                    >
                        {Helper.prettyfyDate(date).date}
                    </Text>
                </View>
            </View>
        </Touchable>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colors.lightText,
        padding: 10,
        paddingTop: 5,
        backgroundColor: colors.elementBackground,
        flexDirection: 'row'
    },
    taskTextStyle: {
        fontSize: 18,
        color: colors.mainDark
    },
    projectTextStyle: {
        fontSize: 12,
        color: colors.secondText
    },
    dateContainerStyle: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        flex: 1
    },
    infoContainerStyle: {
        flex: 3
    }
});

export { TaskBasic };
