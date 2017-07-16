import React, { Component } from 'react';
import { View, Text, TouchableOpacity, DatePickerAndroid, DatePickerIOS, StyleSheet, Platform, Modal } from 'react-native';
import { LinkButton, Label } from '../';
import { Helper, Config } from '../../settings';

const { colors, font } = Config;

class DateDue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: null,
            updating: false,
            showPickerIOS: false,
            newDate: null
        };
    }    

    componentWillMount() {
        this.loadPicker(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.loadPicker(newProps);
    }

    loadPicker(props) {
        if (props.date !== undefined && props.date !== null) {
            this.setState({ date: props.date, newDate: props.date, updating: (props.updating ? props.updating : false) });
        }   
    }

    showDatePicker() {
        if (Platform.OS === 'ios') {
            this.setState({ showPickerIOS: true });
            if (this.state.newDate === null) {
                this.setState({ newDate: new Date() });
            }
        } else {
            this.showDatePickerAndroid();
        }
    }

    async showDatePickerAndroid() {
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
                    this.props.selectedDate(dateISO);
                }
            }
        } catch ({ code, message }) {
            console.log('Could not load date picker');
        }
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
                                    Helper.prettyfyDate(Helper.getDateISOfromDate(this.state.date)).color :
                                    colors.clickable,
                            fontFamily: font.normal
                        }}
                    >
                        {(this.state.date !== null) ? 
                        Helper.prettyfyDate(Helper.getDateISOfromDate(this.state.date)).date : 
                        'Set date'}
                    </Text>
                </TouchableOpacity>
                {Platform.OS === 'ios' ? 
                    <Modal transparent visible={this.state.showPickerIOS}>
                        <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
                            <View 
                                style={{ 
                                    position: 'absolute', 
                                    top: 0, 
                                    bottom: 0, 
                                    left: 0, 
                                    right: 0, 
                                    backgroundColor: colors.mainDark, 
                                    opacity: 0.4 
                                }}
                            />
                            <View
                                style={{ backgroundColor: colors.background, justifyContent: 'flex-end', margin: 10, borderRadius: 5 }}
                            >
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }} >
                                    <Label 
                                        style={{ fontSize: 18, fontWeight: '500' }} 
                                    >
                                        {(this.props.title) ? this.props.title : 'Select a date'}
                                    </Label>
                                </View>
                                <DatePickerIOS 
                                    date={(this.state.newDate === null) ? new Date() : this.state.newDate} 
                                    onDateChange={(date) => this.setState({ newDate: date })}
                                    mode='date'
                                    minimumDate={new Date(1900, 0, 1)}
                                />
                                <View
                                    style={{ 
                                        flexDirection: 'row', 
                                        justifyContent: 'space-between', 
                                        marginLeft: 40, 
                                        marginRight: 40,
                                        marginBottom: 20
                                    }}
                                >
                                    <LinkButton 
                                        title='Cancel' 
                                        style={{ fontWeight: '500' }} 
                                        onPress={() => this.setState({ showPickerIOS: false, newDate: this.state.date })}
                                    />
                                    <LinkButton 
                                        title='Done' 
                                        style={{ fontWeight: '500' }} 
                                        onPress={() => {
                                            this.props.onChangeDate(this.state.newDate);
                                            this.setState({ showPickerIOS: false, date: this.state.newDate, updating: true });
                                        }} 
                                    />
                                </View>                                
                            </View>
                        </View>
                    </Modal> : <View />                    
                }                
            </View>
        );
    }
}

export { DateDue };
