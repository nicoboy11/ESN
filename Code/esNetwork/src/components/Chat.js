import React, { Component } from 'react';
import { 
    View, 
    TextInput, 
    Image, 
    TouchableOpacity, 
    StyleSheet, 
    Text, 
    FlatList, 
    Alert
} from 'react-native';
import { CardList } from './';
import { Config, Database } from '../settings';

const { colors } = Config;
//get current log in
const data = Database.realm('Session', { }, 'select', '');

class Chat extends Component {

    constructor(props) {
        super(props);

        this.state = { elements: [], 
                        input: '',
                        personId: data[0].personId };
    }              

    componentWillMount() {
        const taskId = this.props.taskId;
        const personId = data[0].personId;

        const self = this;

        this.ws = new WebSocket('ws://143.167.71.24:9998/task');

        this.ws.onmessage = function (e) {
            const newMessage = 
                        { 
                            message: e.data,
                            person: 'Robot',
                            theme: '#918277',
                            messageDate: '2017-09-09',
                            messageTypeId: 1,
                            taskId: 1,
                            taskMessageId: 99,
                            personId: 2
                        };

            self.setState({ elements: [...self.state.elements, newMessage] });
        };

        this.ws.onopen = function () {
            this.send(`{"newConnectionxxx":0,
                    "taskId":${taskId},
                    "personId":${personId}}`);
        };

        this.getMessages(personId);
    }

    onError(error) {
        Alert.alert('Error', error.message);
    }
    
    onSuccess(responseData) {
        if (this.state.status > 299) {
            console.log('error');
        } else {
            this.setState({
                elements: responseData
            });
        }
    }

    onSuccessPost(responseData) {
        this.ws.send(JSON.stringify(responseData[0]));

        this.getMessages(this.state.personId);
    }

    onTextChanged(text) {
        this.setState({ input: text });
    }

    getMessages(personId) {
        Database.request(
            'GET', 
            `taskMessages/${this.props.taskId}/${personId}`, 
            {}, 
            2,
            this.handleResponse.bind(this), 
            this.onSuccess.bind(this),
            this.onError.bind(this)
        );
    }

    handleResponse(response) {
        console.log(response.status);
        return response.json();
    } 

    sendMessage() {
        const personId = this.state.personId;

        const newMessage = {
                    category: 'Chat',
                    key: 'loading',
                    taskMessageId: 0,
                    taskId: this.props.taskId,
                    personId: this.state.personId,
                    message: this.state.input,
                    messageTypeId: 1,
                    attachment: null,
                    attachmentTypeId: null,
                    messageDate: 'Sending...'
                };

        Database.request(
            'POST', 
            'taskMessages', 
            {
                taskId: this.props.taskId,
                personId,
                message: this.state.input,
                messageTypeId: 1
            }, 
            1,
            this.handleResponse.bind(this), 
            this.onSuccessPost.bind(this),
            this.onError.bind(this)
        );
        
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
                        <View style={[bubbleRightStyle, (item.key === 'loading') ? { opacity: 0.5 } : {}]}>
                            <Text style={{ color: colors.mainText }}>{item.message}</Text>
                            <Text style={dateBubble}>{item.messageDate}</Text>
                        </View> 
                    </View>
            );  
        }

        return (
                <View style={{ flexDirection: 'row' }} >          
                    <View style={bubbleLeftStyle}>
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
                        keyExtractor={item => item.taskMessageId}
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
