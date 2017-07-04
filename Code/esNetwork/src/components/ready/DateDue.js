import React, { Component } from 'react';
import { View, Text, TouchableOpacity, DatePickerAndroid, StyleSheet } from 'react-native';
import { Helper, Config } from '../../settings';

const { colors } = Config;

class DateDue extends Component {
    state = {
        date: this.props.date,
        updating: false
    }

    async showDatePicker() {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                date: (this.state.date === null || this.state.date === undefined) ? 
                        new Date() :
                        Helper.toDate(this.state.date)
            });

            if (action !== DatePickerAndroid.dismissedAction) {
                const dateISO = Helper.getDateISO(year, month, day);
                this.setState({ date: dateISO, updating: true });
                if (this.props.selectedDate !== undefined) {
                    this.props.selectedDate();
                }
            }
        } catch ({ code, message }) {
            console.log('Could not load date picker');
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({ updating: newProps.updating });
    }

    render() {
        return (
            <View 
                style={{ opacity: 
                        (this.state.updating) ? 
                        0.3 :
                        1
                }}
            >
                <TouchableOpacity onPress={this.showDatePicker.bind(this)}>
                    <Text
                        style={{
                            color: (this.state.date !== null) ? 
                                    Helper.prettyfyDate(this.state.date).color :
                                    colors.clickable,
                            fontFamily: 'Roboto'
                        }}
                    >
                        {(this.state.date !== null) ? 
                        Helper.prettyfyDate(this.state.date).date : 
                        'Set date'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = new StyleSheet.create({
    
});

export { DateDue };
