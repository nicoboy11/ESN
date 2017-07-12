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
import ImagePicker from 'react-native-image-picker';
import { CardList } from './';
import { Config, Database, Helper } from '../settings';

const { colors, font, network } = Config;
//get current log in
const data = Database.realm('Session', { }, 'select', '');

class Chat extends Component {

    constructor(props) {
        super(props);

        this.state = { elements: [], 
                        input: '',
                        personId: data[0].personId,
                        showLog: true
                    };
    }              

    componentWillMount() {
        const taskId = this.props.taskId;
        const personId = data[0].personId;

        const self = this;

        this.ws = new WebSocket(network.wsServer);

        this.ws.onmessage = function (e) {
            const messageObj = JSON.parse(e.data);
            if (messageObj.isTyping) {
                self.setState({ typing: messageObj.message });
            } else {
                const newMessage = 
                            { 
                                message: messageObj.message,
                                person: messageObj.person,
                                theme: messageObj.theme,
                                messageDate: messageObj.messageDate,
                                messageTypeId: messageObj.messageTypeId,
                                taskId: messageObj.taskId,
                                taskMessageId: messageObj.taskMessageId,
                                personId: messageObj.personId
                            };

                self.setState({ elements: [...self.state.elements, newMessage], typing: '' });
                setTimeout(() => self.chatList.scrollToEnd(), 2000);   
            }
        };

        this.ws.onopen = function () {
            this.send(`{"newConnectionxxx":0,
                    "taskId":${taskId},
                    "personId":${personId}}`);
        };

        this.getMessages(personId);
    }

    componentDidUpdate() {

    }

    componentWillUnmount() {
        this.ws.send(`{"taskId":${this.props.taskId},"isTyping": true, "message":""}`);        
        this.ws.send(`{"disconnectingClient":${this.state.personId}}`);
        this.ws.close();
    }

    onHandleResponse(response) {
        console.log(response.status);
        this.setState({ status: response.status });
        return response.json();
    }

    onSuccess(responseData) {
        if (this.state.status > 299) {
            console.log('error');
        } else {
            this.setState({
                elements: responseData
            });
        }

        const self = this;
        setTimeout(() => self.chatList.scrollToEnd(), 2000);        
    }

    onSuccessPost(responseData) {
        this.ws.send(JSON.stringify(responseData[0]));

        this.getMessages(this.state.personId);
    }

    onError(error) {
        Alert.alert('Error', error.message);
    }

    onTextChanged(text) {
        this.setState({ input: text });
        if (text !== '') {
            this.ws.send(`{"taskId":${this.props.taskId},"isTyping": true, "message":"${data[0].names} is typing..."}`);
        } else {
            this.ws.send(`{"taskId":${this.props.taskId},"isTyping": true, "message":""}`);
        }
    }

    getMessages(personId) {
        Database.request(
            'GET', 
            `taskMessages/${this.props.taskId}/${personId}`, 
            {}, 
            2,
            this.onHandleResponse.bind(this), 
            this.onSuccess.bind(this),
            this.onError.bind(this)
        );
    }

    scrollToBottom() {
       /* const self = this;
        setTimeout(self.chatList.scrollToEnd(), 100);*/
    }

    imageAction() {
        const options = {
            title: 'Select your profile photo',
            customButtons: [
                { name: 'fb', title: 'Photos from facebook' },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('canceled');
            } else if (response.error) {
                console.log('error');
            } else if (response.customButton) {
                console.log('customButton', response.customButton);
            } else {
                const source = { uri: response.uri };
                this.setState({
                    imgSource: source,
                    imgFileName: response.fileName,
                    imgFileType: response.type
                });
            }
        });
    }  

    sendMessage() {
        const personId = this.state.personId;
        let attachment;
        let attachmentTypeId;
        
        if (this.state.imgFileName !== undefined) {
            attachment = {
                        uri: this.state.imgSource.uri,
                        name: this.state.imgFileName,
                        type: this.state.imgFileType
                    };                
            attachmentTypeId = 2;
        }  

        const newMessage = {
                    category: 'Chat',
                    key: 'loading',
                    taskMessageId: 0,
                    taskId: this.props.taskId,
                    personId: this.state.personId,
                    message: this.state.input,
                    messageTypeId: 1,
                    attachment,
                    attachmentTypeId: 2,
                    messageDate: 'Sending...'
                };              

        Database.request(
            'POST', 
            'taskMessages', 
            {
                taskId: this.props.taskId,
                personId,
                message: this.state.input,
                messageTypeId: 1,
                attachment,
                attachmentTypeId
            }, 
            1,
            this.onHandleResponse.bind(this), 
            this.onSuccessPost.bind(this),
            this.onError.bind(this)
        );
        
        this.setState({ elements: [...this.state.elements, newMessage], input: '' });
        this.chatList.scrollToEnd();
    }

    renderMessages({ item }) {
        const { 
            bubbleLeftStyle,
            dateBubble,
            personBubble,
            bubbleRightStyle,
            spacer,
            logStyle,
            bubbleImgStyle
        } = styles;
        
        if (item.messageTypeId === 2) {
            if (this.state.showLog) {
                return (
                    <View>
                        <Text
                            style={logStyle}
                        >
                            {item.message}
                        </Text>
                    </View>
                );
            }

            return <View />;
        } 

        if (item.personId === this.state.personId) {
            return (
                    <View style={{ flexDirection: 'row' }} >
                        <View style={spacer} />                        
                        <View style={[bubbleRightStyle, (item.key === 'loading') ? { opacity: 0.5 } : {}]}>
                            <Image 
                                style={(item.attachment) ? bubbleImgStyle : {}} 
                                source={{ uri: Config.network.server + item.attachment }} 
                            />
                            <Text style={{ color: colors.mainText }}>{item.message}</Text>
                            <Text style={dateBubble}>{Helper.prettyfyDate(item.messageDate).date}</Text>
                        </View> 
                    </View>
            );  
        }

        return (
                <View style={{ flexDirection: 'row' }} >          
                    <View style={bubbleLeftStyle}>
                        <Text style={[personBubble, { color: item.theme }]}>{item.person}</Text>
                        <Image 
                            style={(item.attachment) ? bubbleImgStyle : {}} 
                            source={{ uri: Config.network.server + item.attachment }} 
                        />                        
                        <Text>{item.message}</Text>
                        <Text style={dateBubble}>{Helper.prettyfyDate(item.messageDate).date}</Text>
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
                        ref={(ref) => { this.chatList = ref; }}
                        data={this.state.elements} 
                        renderItem={this.renderMessages.bind(this)}
                    />
                </View>
                <View>
                    <Text>
                        {this.state.seen}
                    </Text>
                </View>                
                <View>
                    <Text>
                        {this.state.typing}
                    </Text>
                </View>
                <View style={typingContainerStyle}>
                    <TextInput 
                        placeholder='Type your message' 
                        style={typingStyle} 
                        value={this.state.input}
                        onChangeText={this.onTextChanged.bind(this)}
                        multiline={true}
                    />
                    <TouchableOpacity 
                        style={imageStyle}
                        onPress={this.imageAction.bind(this)}
                    >
                        <Image 
                            tintColor={colors.main} 
                            style={{ width: 24, height: 24 }} 
                            source={{ uri: 'attach' }} 
                        />
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
    },
    logStyle: {
        fontSize: 10,
        color: colors.mainDark,
        textAlign: 'center',
        fontFamily: font.normal
    },
    bubbleImgStyle: {
        flex: 1,
        width: 150,
        height: 150,
        resizeMode: 'contain',
        borderRadius: 10,
        alignSelf: 'center'
    }
});

export { Chat };
