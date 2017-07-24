import React, { Component } from 'react';
import { View, Picker, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { Label, LinkButton } from '../';
import { Config } from '../../settings';

const { colors, texts } = Config;

class MyPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFocused: false,
            selectedValue: null,
            selectedText: null,
            showPicker: false,
            newSelectedValue: null,
            newSelectedText: null,
            elements: this.props.elements
        };
    }    

    componentWillMount() {
        this.loadPicker(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.loadPicker(newProps);
    }

    onSelection(itemValue, itemIndex) {     
        const newText = this.state.elements.filter((element) => {
            return element.value === itemValue;
        });

        this.setState({ newSelectedText: newText[0].text, newSelectedValue: itemValue });
    }

    loadPicker(props) {
        if (props.selectedValue !== undefined && props.selectedValue !== null) {
            const text = this.state.elements.filter((element) => {
                return element.value === props.selectedValue;
            });            
            this.setState({ selectedValue: props.selectedValue, selectedText: text[0].text });
        } 
    }

    showPicker() {
        if (this.props.editable) {
            this.setState({ showPicker: true });       
            if (this.state.newSelectedValue === null) {
                this.setState({ 
                    newSelectedValue: this.state.elements[0].value, 
                    newSelectedText: this.state.elements[0].text 
                });
            }   
        }      
    }

    renderOptions() {
        return this.state.elements.map(element => (
            <Picker.Item key={element.value} label={element.text} value={element.value} />            
        ));
    }

    renderPicker() {
        const { 
            labelTextStyle,
            activeLabelStyle,
            inactiveLabelStyle,
            viewStyle
        } = styles;

        return (
                <TouchableOpacity style={viewStyle} onPress={this.showPicker.bind(this)}>
                    <Label 
                        style={[labelTextStyle, 
                                this.state.isFocused ? activeLabelStyle : inactiveLabelStyle]}
                    >
                        {this.renderLabel()}
                    </Label>                
                    {this.renderSelection()}
                </TouchableOpacity>     
            );
    }

    renderLabel() {
        if (this.state.selectedValue !== null) {
            return this.props.label;
        }
        
        return '';        
    }

    renderSelection() {
        if (this.state.selectedValue !== null) {
            return (
                <View>
                    <Label 
                        style={
                            [
                                styles.validInputStyle, 
                                { color: colors.mainDark, borderBottomWidth: this.state.borderLine }
                            ]}
                    >
                        {this.state.selectedText}
                    </Label>
                </View>                  
            );
        }

        return (
            <Label 
                style={
                    [
                        styles.validInputStyle, 
                        { borderBottomWidth: this.state.borderLine }
                    ]}
            >
                        {this.props.label}
            </Label>
        );
    }    

    render() {
        return (
            <View>
                {this.renderPicker()}
                    <Modal transparent visible={this.state.showPicker}>
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
                                        {(this.props.title) ? this.props.title : texts.pickerTitle}
                                    </Label>
                                </View>
                                <Picker
                                    selectedValue={this.state.newSelectedValue}
                                    onValueChange={this.onSelection.bind(this)}
                                >
                                    {this.renderOptions()}                                  
                                </Picker>
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
                                        onPress={() => this.setState({ 
                                                            showPicker: false, 
                                                            newSelectedValue: this.state.selectedValue,
                                                            newSelectedText: this.state.selectedText
                                        })}
                                    />
                                    <LinkButton 
                                        title='Done' 
                                        style={{ fontWeight: '500' }} 
                                        onPress={() => {
                                            this.props.onChangeSelection(this.state.newSelectedValue);
                                            this.setState({ 
                                                showPicker: false, 
                                                selectedValue: this.state.newSelectedValue, 
                                                updating: true,
                                                selectedText: this.state.newSelectedText
                                            });
                                        }} 
                                    />
                                </View>                                
                            </View>
                        </View>
                    </Modal>     
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

export { MyPicker };
