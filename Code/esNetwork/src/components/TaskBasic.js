import React from 'react';
import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { Config, Helper } from '../settings';

const { colors } = Config;

const TaskBasic = ({ name, dueDate, project, taskId }) => {
    const { containerStyle, infoContainerStyle, dateContainerStyle, projectTextStyle, taskTextStyle } = styles;
    return (
        <TouchableNativeFeedback>
            <View key={taskId} style={containerStyle}>
                <View style={infoContainerStyle}>
                    <Text style={projectTextStyle}>{project}</Text>
                    <Text style={taskTextStyle}>{name}</Text>
                </View>
                <View style={dateContainerStyle}>
                    <Text style={{ color: Helper.prettyfyDate(dueDate).color }}>{Helper.prettyfyDate(dueDate).date}</Text>
                </View>
            </View>
        </TouchableNativeFeedback>
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
