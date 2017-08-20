import React, { Component } from 'react';
import { Text } from 'react-native';
import { Config } from '../../settings';

const { font } = Config;

class Label extends Component {
    render() {
        return (
        <Text 
            style={[
                this.props.style, 
                { fontFamily: (this.props.light) ? font.light : font.normal }
            ]}
        >
            {this.props.children}
        </Text>);
    }
}

export { Label };

