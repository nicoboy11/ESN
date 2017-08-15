import React, { Component } from 'react';
import { 
    Platform, 
    DatePickerAndroid, 
    DatePickerIOS,
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    Alert,
    Modal
} from 'react-native';
import { LinkButton, Label } from './';
import { Config, Helper } from '../settings';

const { colors, texts } = Config;

class DatePicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: null, 
            borderLine: 1,
            editable: this.props.editable,
            showPickerIOS: false,
            newDate: null
        };
    }

    componentWillMount() {
        this.loadPicker(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.loadPicker(nextProps);
    }

    showDatePicker() {
        if (this.state.editable) {
            if (Platform.OS === 'ios') {
                this.setState({ showPickerIOS: true });
                if (this.state.newDate === null) {
                    this.setState({ newDate: new Date() });
                }
            } else {
                this.showDatePickerAndroid();
            }
        }
    }    

    loadPicker(props) {
        if (props.date !== undefined && props.date !== null) {
            this.setState({ date: props.date });
        }

        if (props.editable !== undefined) {
            if (props.editable === false) {
                this.setState({ borderLine: 0 });
            }
            this.setState({ editable: props.editable });
        }      
    }

    async showDatePickerAndroid() {
        try {
            if (!this.props.editable) {
                return;
            }

            const { action, year, month, day } = await DatePickerAndroid.open({
                date: (this.props.date === null) ? new Date() : this.props.date
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                const date = new Date(year, month, day);
                const dateISO = Helper.getDateISO(year, month, day);
                this.setState({ date });
                //Back to the parent component
                this.props.onChangeDate(dateISO);
            }
        } catch ({ code, message }) {
            console.log('Could not load date picker');
        }
    }

    renderLabel() {
        if (this.state.date !== null) {
            return this.props.label;
        }
        
        return '';        
    }

    renderSelection() {
        if (this.state.date != null) {
            return (
                <View>
                    <Text 
                        style={
                            [
                                styles.validInputStyle, 
                                { color: colors.mainDark, borderBottomWidth: this.state.borderLine }
                            ]}
                    >
                        {Helper.prettyfyDate(Helper.getDateISOfromDate(this.state.date)).date}
                    </Text>
                </View>                  
            );
        }

        return (
            <Text 
                style={
                    [
                        styles.validInputStyle, 
                        { borderBottomWidth: this.state.borderLine }
                    ]}
            >
                        {this.props.label}
            </Text>
        );
    }

    renderPicker() {
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
                    >
                        {this.renderLabel()}
                    </Text>                
                    {this.renderSelection()}
                </TouchableOpacity>     
            );
    }

    render() {
        return (
            <View>
                {this.renderPicker()}
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
                                        {(this.props.title) ? this.props.title : texts.selectADate}
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
        color: colors.main
    },
    validInputStyle: {
        borderBottomColor: colors.lightText,
        color: colors.lightText,
        fontSize: 18
    }
});

export { DatePicker };
