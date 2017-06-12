import React, { Component } from 'react';
import { 
    Platform, 
    DatePickerAndroid, 
    DatePickerIOS,
    TouchableOpacity,
    Text,
    View,
    StyleSheet
} from 'react-native';
import { Config, helper } from '../settings';

const { colors } = Config;

class DatePicker extends Component {

    state = { date: null, text: '' }

    async showDatePicker() {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                date: new Date()
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                const date = new Date(year, month, day);
                const dateISO = helper.getDateISO(year, month, day);
                this.setState({ date: date.toLocaleDateString() });
                //Back to the parent component
                this.props.onChangeDate(dateISO);
            }
        } catch ({ code, message }) {
            console.log('Could not load date picker');
        }
    }

    renderLabel() {
        if (this.state.text !== '') {
            return this.props.label;
        }
        
        return '';        
    }

    renderSelection() {
        if (this.state.date != null) {
            return <Text style={[styles.validInputStyle, { color: '#333' }]}>{this.state.date}</Text>;
        }

        return <Text style={styles.validInputStyle}>{this.props.label}</Text>;
    }

    renderPicker() {
        if (Platform.OS === 'ios') {
            return <DatePickerIOS />;
        }
        const { 
            labelTextStyle,
            activeLabelStyle,
            inactiveLabelStyle,
            viewStyle
        } = styles;

        return (
                <TouchableOpacity style={viewStyle} onPress={this.showDatePicker.bind(this)}>
                    <Text 
                        style={[labelTextStyle, 
                                this.state.isFocused ? activeLabelStyle : inactiveLabelStyle]}
                    >{this.renderLabel()}
                    </Text>                
                    {this.renderSelection()}
                </TouchableOpacity>
               );
    }

    render() {
        return (
            <View>
                {this.renderPicker()}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    viewStyle: {
        height: 56,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'transparent',
    },
    labelTextStyle: {
        fontSize: 12,
        height: 15,
    },
    activeLabelStyle: {
        color: colors.main,
        fontWeight: '600'
    },
    inactiveLabelStyle: {
        color: colors.inactive
    },
    validInputStyle: {
        borderBottomColor: colors.lightText,
        borderBottomWidth: 1,
        color: colors.lightText,
        fontSize: 18
    }
});

export { DatePicker };
