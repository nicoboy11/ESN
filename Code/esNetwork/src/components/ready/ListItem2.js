import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinkButton } from '../';
import { Config } from '../../settings';
const { colors } = Config;

class ListItem2 extends Component {
    onPress() {
        this.props.onPress();
    }

    render() {
        const { containerStyle, headStyle, contentStyle, titleStyle } = styles;

        return (
            <View style={containerStyle}>
                <View style={headStyle}>
                    <Text style={titleStyle}>{this.props.title}:</Text>
                    {(this.props.editable) ? 
                    <LinkButton title='Edit' onPress={this.onPress.bind(this)} /> : 
                    <View />}
                </View>
                <View style={[contentStyle, this.props.style]}>
                    {this.props.children}
                </View>
            </View>
        );
    }
}

const styles = new StyleSheet.create({
    headStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5
    },
    contentStyle: {
        padding: 5
    },
    containerStyle: {
        padding: 5,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.secondText,
        paddingBottom: 15
    },
    titleStyle: {
        fontSize: 12,
        color: colors.secondText,
        fontFamily: 'Roboto'
    }
});

export { ListItem2 };
