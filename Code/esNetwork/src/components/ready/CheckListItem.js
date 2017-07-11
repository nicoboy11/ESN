import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Touchable } from '../settings';

class CheckListItem extends Component {
    state = { 
                updating: (this.props.updating) ? false : this.props.updating,
                isChecked: this.props.isChecked
             };

    componentWillReceiveProps(newProps) {
        this.setState({ updating: newProps.updating });
    }

    onPress() {
        if (this.props.waitUpdate) {
            this.setState({ updating: true, isChecked: !this.state.isChecked });
        }

        if (this.props.onPress) {
            this.props.onPress(this.props.data);
        }
    }

    render() {
        const { checkBoxStyle, contStyle, textStyle, mainStyle } = styles;
        return (
            <View 
                style={
                    [contStyle, 
                     mainStyle, 
                     { opacity: (this.state.isChecked) ? 0.5 : 1 },
                     { opacity: (this.state.updating) ? 0.2 : (this.state.isChecked) ? 0.5 : 1 }
                    ]
                }
            >
                <View style={{ flex: 3 }}>
                    <Touchable
                        onPress={this.onPress.bind(this)}
                    >
                        <View 
                            style={contStyle}
                        >
                            <Image 
                                style={checkBoxStyle} 
                                source={{ uri: (this.state.isChecked) ? 'checked' : 'unchecked' }} 
                            />
                            <Text 
                                allowFontScaling 
                                ellipsizeMode='tail' 
                                numberOfLines={2}
                                style={
                                    [
                                        textStyle, 
                                        { textDecorationLine: (this.state.isChecked) ? 
                                            'line-through' : 
                                            'none' 
                                        }
                                    ]
                                }
                            >
                                {this.props.item}
                            </Text>
                        </View>
                    </Touchable>
                </View>
            </View>
        );
    }
}

const styles = new StyleSheet.create({
    mainStyle: {
        justifyContent: 'space-between',
        flex: 1,
        padding: 10
    },
    contStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    checkBoxStyle: {
        width: 24,
        height: 24
    },
    textStyle: {
        paddingLeft: 5,
        flex: 1
    }
});

export { CheckListItem };
