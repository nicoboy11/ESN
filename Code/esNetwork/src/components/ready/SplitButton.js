import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Config } from '../../settings';
const { colors, texts } = Config;

class SplitButton extends Component {

    constructor(props) {
        super(props);
        this.state = { ...props };
    }

    onPress(element) {
        let elements = this.state.elements;

        for (let item of elements) {
            item.isSelected = false;

            if (item.id === element.id) {
                item.isSelected = true;
            }
        }

        this.setState({ elements });

        if (this.props.onSelection) {
            this.props.onSelection(element.id);
        }
    }
    
    rendereElements() {
        const {
            selectedStyle,
            itemStyle,
            selectedTextStyle,
            itemTextStyle,
            textStyle
        } = styles;

        const elements = this.state.elements;

        if (elements === null) {
            return <View />;
        }

        return elements.map(element => 
            (
                <View 
                    key={element.id}
                    style={
                        [
                            itemStyle,
                            (element.isSelected) ? selectedStyle : {},
                            this.props.style
                        ]
                     }
                >
                    <TouchableOpacity
                        onPress={() => this.onPress(element)}
                    >
                        <Text
                            style={
                                [
                                    textStyle,
                                    (element.isSelected) ? selectedTextStyle : itemTextStyle
                                ]
                                
                            }                    
                        >{element.text}</Text>
                    </TouchableOpacity>
                </View>                
            )
        );
    }

    render() {
        const { containerStyle } = styles;

        return (
            <View
                style={containerStyle}
            >
                {this.rendereElements()}
            </View>   
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        flexDirection: 'row', 
        borderWidth: 1,
        borderColor: colors.main,
        justifyContent: 'space-around',
        margin: 5,
        borderRadius: 5,
        alignItems: 'center'
    },
    itemStyle: {
        flex: 1
    },
    textStyle: {
        textAlign: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        fontFamily: 'Roboto'
    },
    itemTextStyle: {
        color: colors.main
    },
    selectedStyle: {
        backgroundColor: colors.main
    },
    selectedTextStyle: {
        color: colors.mainText
    }
});

export { SplitButton };
