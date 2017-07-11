import React, { Component } from 'react';
import { TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';

class Touchable extends Component {
    render() {
        if (Platform.OS === 'ios' || this.props.forceOpacity) {
            return (
                <TouchableOpacity
                    onPress={() => this.props.onPress()}
                >
                    {this.props.children}
                </TouchableOpacity>
            );
        }

        return (
            <TouchableNativeFeedback
                    onPress={() => this.props.onPress()}
            >
                {this.props.children}
            </TouchableNativeFeedback>
        );
    }
} 

export { Touchable };
