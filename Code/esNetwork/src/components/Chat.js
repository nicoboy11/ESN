import React, { Component } from 'react';
import { View, TextInput, Image, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { CardList } from './';
import { Config } from '../settings';

const { colors } = Config;

class Chat extends Component {

    state = { elements: [{ category: 'Chat', message: 'Bienvenidos', personId: 1 },
                         { category: 'Chat', message: 'Hola!', personId: 2 }], 
              input: '' }

    onTextChanged(text) {
        this.setState({ input: text });
    }

    sendMessage() {
        const newMessage = { category: 'Chat', message: this.state.input, personId: 1 };
        this.setState({ elements: [...this.state.elements, newMessage] });
    }

    render() {
        const { 
            containerStyle,
            chatStyle,
            typingContainerStyle,
            typingStyle,
            imageStyle
        } = styles;

        return (
            <View style={containerStyle}>
                <CardList 
                    elements={this.state.elements} 
                    style={chatStyle} 
                />
                <View style={typingContainerStyle}>
                    <TextInput 
                        placeholder='Type your message' 
                        style={typingStyle} 
                        value={this.state.input}
                        onChangeText={this.onTextChanged.bind(this)}
                    />
                    <TouchableOpacity style={imageStyle}>
                        <Image />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={imageStyle}
                        onPress={this.sendMessage.bind(this)}
                    >
                        <Text>Send</Text>
                    </TouchableOpacity>                    
                </View>
            </View>
        );
    }
}

const styles = new StyleSheet.create({
    containerStyle: {
        flex: 1
    },
    chatStyle: {
        flex: 1
    },
    typingContainerStyle: {
        flexDirection: 'row',
        height: 50,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.lightText
    },
    typingStyle: {
        flex: 4,
        paddingLeft: 15
    },
    imageStyle: {
        flex: 1
    }
});

export { Chat };
