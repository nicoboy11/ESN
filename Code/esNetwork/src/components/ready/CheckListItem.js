import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Touchable } from '../';
import { Config } from '../../settings';

const { colors } = Config;

class CheckListItem extends Component {
    state = { 
                processing: (this.props.processing) ? this.props.processing : false,
                isChecked: this.props.isChecked
             };

    componentWillReceiveProps(newProps) {
        this.setState({ processing: newProps.processing });
    }

    onPress() {
        if (this.props.waitUpdate) {
            this.setState({ processing: true, isChecked: !this.state.isChecked });
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
                     { opacity: (this.state.processing) ? 0.2 : (this.state.isChecked) ? 0.5 : 1 }
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
                                tintColor={colors.mainDark}
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
        height: 24,
        tintColor: colors.mainDark
    },
    textStyle: {
        paddingLeft: 5,
        flex: 1,
        color: colors.mainDark
    }
});

export { CheckListItem };
