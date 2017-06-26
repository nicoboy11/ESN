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
import { Config, Helper } from '../settings';

const { colors } = Config;

class DatePicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: null, 
            borderLine: 1,
            editable: true
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
            this.setState({ date: props.date.toLocaleDateString() });
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

            const { action, year, month, day } = await DatePickerAndroid.open({
                date: (this.props.date === null) ? new Date() : this.props.date
            });
            if (action !== DatePickerAndroid.dismissedAction) {
                const date = new Date(year, month, day);
                const dateISO = Helper.getDateISO(year, month, day);
                this.setState({ date: date.toLocaleDateString() });
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
                <Text 
                    style={
                        [
                            styles.validInputStyle, 
                            { color: '#444', borderBottomWidth: this.state.borderLine }
                        ]}
                >
                    {this.state.date}
                </Text>);
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
        color: colors.inactive
    },
    validInputStyle: {
        borderBottomColor: colors.lightText,
        color: colors.lightText,
        fontSize: 18
    }
});

export { DatePicker };
