import React, { Component } from 'react';
import { View, TextInput, Image, TouchableOpacity, StyleSheet, Text, FlatList } from 'react-native';
import { CardList } from './';
import { Config, Database } from '../settings';

const { colors } = Config;

class Chat extends Component {

    state = { elements: [], 
              input: '',
              personId: null }

    componentWillMount() {
        //get current log in
        const data = Database.realm('Session', { }, 'select', '');
        const personId = data[0].personId;        
        this.setState({ personId });

        this.setState({
            elements: [
                {
                    category: 'Chat',
                    key: 1,
                    taskMessageId: 1,
                    taskId: 1,
                    personId: 2,
                    avatar: 'PO',
                    person: 'Paulina Orihuela Pérez',
                    message: 'This is a Test',
                    messageTypeId: 1,
                    attachment: null,
                    attachmentTypeId: null,
                    messageDate: '2017-06-21 02:01:48',
                    isSelf: false,
                    theme: '#D7C000'
                },
                {
                    category: 'Chat',
                    key: 2,
                    taskMessageId: 2,
                    taskId: 1,
                    personId: 3,
                    avatar: 'JH',
                    person: 'Julianne Hadyn Fear',
                    message: 'Hi',
                    messageTypeId: 1,
                    attachment: null,
                    attachmentTypeId: null,
                    messageDate: '2017-06-21 02:01:49',
                    isSelf: false,
                    theme: '#EFA209'
                }                
            ]
        });
    }

    onTextChanged(text) {
        this.setState({ input: text });
    }

    sendMessage() {
        const key = 'K' + (new Date().getTime() / 1000);
        const newMessage = {
                    category: 'Chat',
                    key,
                    taskMessageId: 3,
                    taskId: 1,
                    personId: 1,
                    avatar: 'ES',
                    person: 'Even Sosa Rodríguez',
                    message: this.state.input,
                    messageTypeId: 1,
                    attachment: null,
                    attachmentTypeId: null,
                    messageDate: '2017-06-21 02:01:49',
                    isSelf: false,
                    theme: '#EFA209'
                };
        this.setState({ elements: [...this.state.elements, newMessage], input: '' });
        this.refs.chatList.scrollToEnd();
    }

    renderMessages({ item }) {
        const { 
            bubbleLeftStyle,
            dateBubble,
            personBubble,
            bubbleRightStyle,
            spacer
        } = styles;
        
        if (item.personId === this.state.personId) {
            return (
                    <View style={{ flexDirection: 'row' }} >
                        <View style={spacer} />                        
                        <View key={item.key} style={bubbleRightStyle}>
                            <Text style={{ color: colors.mainText }}>{item.message}</Text>
                            <Text style={dateBubble}>{item.messageDate}</Text>
                        </View> 
                    </View>
            );  
        }

        return (
                <View style={{ flexDirection: 'row' }} >          
                    <View key={item.key} style={bubbleLeftStyle}>
                        <Text style={[personBubble, { color: item.theme }]}>{item.person}</Text>
                        <Text>{item.message}</Text>
                        <Text style={dateBubble}>{item.messageDate}</Text>
                    </View>
                    <View style={spacer} />                        
                </View>
        );             
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
                <View style={chatStyle} >
                    <FlatList 
                        ref='chatList'
                        data={this.state.elements} 
                        renderItem={this.renderMessages.bind(this)}
                    />
                </View>
                <View style={typingContainerStyle}>
                    <TextInput 
                        placeholder='Type your message' 
                        style={typingStyle} 
                        value={this.state.input}
                        onChangeText={this.onTextChanged.bind(this)}
                        multiline={true}
                    />
                    <TouchableOpacity style={imageStyle}>
                        <Image />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={imageStyle}
                        onPress={this.sendMessage.bind(this)}
                    >
                        <Text style={{ color: colors.main }}>Send</Text>
                    </TouchableOpacity>                    
                </View>
            </View>
        );
    }
}

const styles = new StyleSheet.create({
    containerStyle: {
        flex: 1,
        backgroundColor: colors.veryLight
    },
    chatStyle: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    typingContainerStyle: {
        flexDirection: 'row',
        height: 50,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.lightText,
        backgroundColor: colors.mainText,
        justifyContent: 'center',
        alignItems: 'center'
    },
    typingStyle: {
        flex: 4,
        paddingLeft: 15
    },
    imageStyle: {
        flex: 1
    },
    bubbleLeftStyle: {
        backgroundColor: colors.mainText,
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 10,
        flex: 0.7,
        borderColor: colors.lightText,
        borderWidth: StyleSheet.hairlineWidth
    },
    bubbleRightStyle: {
        flex: 0.7,
        backgroundColor: colors.main,
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 10,
        borderColor: colors.lightText,
        borderWidth: StyleSheet.hairlineWidth
    },    
    spacer: {
        flex: 0.3
    },
    dateBubble: {
        fontSize: 8,
        alignSelf: 'flex-end',
        color: colors.lightText
    },
    personBubble: {
        fontSize: 12,
        alignSelf: 'flex-start'
    }       
});

export { Chat };
