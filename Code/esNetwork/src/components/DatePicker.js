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
import { LinkButton } from './';
import { Config, Helper } from '../settings';

const { colors } = Config;

class DatePicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: null, 
            borderLine: 1,
            editable: true,
            showPickerIOS: false
        };
    }

    componentWillMount() {
        this.loadPicker(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.loadPicker(nextProps);
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

    async showDatePicker() {
        try {
            if (!this.props.editable) {
                return;
            }

            if (Platform.OS === 'ios') {            
                this.setState({ showPickerIOS: true });
            } else {
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
                    {Platform.OS === 'ios' ? 
                    <Modal transparent visible={this.state.showPickerIOS}>
                        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                            <View 
                                style={{ flex: 3, backgroundColor: colors.mainDark, opacity: 0.4 }}
                            />
                            <View
                                style={{ flex: 2, backgroundColor: colors.background, justifyContent: 'flex-end' }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 40, marginRight: 40 }}>
                                    <LinkButton title='CANCEL' />
                                    <LinkButton 
                                        title='OK' 
                                        onPress={() => {
                                            this.props.onChangeDate(this.state.date);
                                            this.setState({ showPickerIOS: false });
                                        }} 
                                    />
                                </View>
                                <DatePickerIOS 
                                    date={this.state.date} 
                                    onDateChange={(date) => this.setState({ date })}
                                    mode='date'
                                    minimumDate={new Date(1900, 0, 1)}
                                />
                            </View>
                        </View>
                    </Modal> : <View />                    
                    }
        
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
