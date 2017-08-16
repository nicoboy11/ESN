import React, { Component } from 'react';
import { 
    View, 
    TextInput, 
    Image, 
    TouchableOpacity, 
    StyleSheet, 
    Text, 
    FlatList, 
    Alert,
    Platform,
    ActivityIndicator
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { CardList, KeyboardSpacer } from './';
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
                        showLog: true,
                        visibleElements: [],
                        isLoading: true,
                        isRendering: false
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

                self.setState({ 
                    visibleElements: [...self.state.visibleElements, newMessage], 
                    elements: [...self.state.elements, newMessage], 
                    typing: '' 
                });
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
        //this.chatList.scrollToEnd();
        if (this.state.isRendering) {
            setTimeout(() => { 
                this.chatList.scrollToEnd(); 
                this.setState({ isRendering: false });
            }, 500);  
        }    
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
                elements: responseData,
                visibleElements: responseData.slice(-8)
            });
        }

        if (this.state.isLoading) {
            this.setState({ isLoading: false, isRendering: true });  
        }   
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
                    imgFileType: response.type,
                    loadedImage: true
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
                    messageDate: null,
                    sending: 'Sending...'
                };              

        this.setState({ 
            visibleElements: [...this.state.visibleElements, newMessage], 
            elements: [...this.state.elements, newMessage], 
            input: '',
            loadedImage: false
        });

        setTimeout(() => { 
            this.chatList.scrollToEnd(); 
        }, 500);                        

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
    }

    refreshList() {
        this.chatList.refreshing = true;
        this.setState({
            visibleElements: this.state.elements.slice(-this.state.visibleElements.length - 10)
        });
    }

    renderAttachment(item) {
        const { 
            bubbleImgStyle
        } = styles;

        if (item.attachment === undefined || item.attachment === '' || item.attachment === null) {
            return <View />;
        }

        return (
            <View>
                {(item.key === 'loading') ? <ActivityIndicator /> : <View />}
                <Image 
                    style={bubbleImgStyle} 
                    source={{ uri: Config.network.server + Config.network.blured + item.attachment }} 
                />
                {/* <View style={{ position: 'absolute', right: 5, top: 75 }}>
                    <TouchableOpacity>
                        <Image source={{ uri: 'download' }} style={{ width: 30, height: 30, tintColor: 'black' }} />
                    </TouchableOpacity>
                </View> */}
            </ View>
        );  
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
                            {this.renderAttachment(item)}
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
                        {this.renderAttachment(item)}                      
                        <Text>{item.message}</Text>
                        <Text style={dateBubble}>{(item.sending) ? item.sending : Helper.prettyfyDate(item.messageDate).date}</Text>
                    </View>
                    <View style={spacer} />                        
                </View>
        );             
    }

    renderList() {
        if (this.state.isLoading) {
            return <ActivityIndicator size='large' />;
        }

        return (
            <FlatList 
                keyExtractor={item => item.taskMessageId}
                ref={(ref) => { this.chatList = ref; }}
                data={this.state.visibleElements} 
                renderItem={this.renderMessages.bind(this)}
                onRefresh={() => { this.refreshList(); }}
                refreshing={false}
            />            
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
                <View style={[chatStyle, (this.state.isRendering) ? { opacity: 0 } : { opacity: 1 }]} >
                    {this.renderList()}
                </View>
                {(this.state.seen) ? 
                    <View>
                        <Text>
                            {this.state.seen}
                        </Text>
                    </View> : <View />}
                {(this.state.typing) ?
                    <View>
                        <Text>
                            {this.state.typing}
                        </Text>
                    </View> : <View />      
                }
                <View style={typingContainerStyle}>
                    <TextInput 
                        placeholder='Type your message' 
                        placeholderTextColor={colors.secondText}
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
                            tintColor={colors.clickable} 
                            style={{ width: 24, height: 24, tintColor: colors.clickable }} 
                            source={{ uri: (this.state.loadedImage) ? this.state.imgSource.uri : 'attach' }} 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={imageStyle}
                        onPress={this.sendMessage.bind(this)}
                    >
                        <Text style={{ color: colors.clickable }}>Send</Text>
                    </TouchableOpacity>                    
                </View>
                {(Platform.OS === 'ios') ? <KeyboardSpacer /> : <View /> }
                
            </View>
        );
    }
}

const styles = new StyleSheet.create({
    containerStyle: {
        flex: 1,
        backgroundColor: colors.veryLight,
        justifyContent: 'flex-end'
    },
    chatStyle: {
        //flex: 1,
        justifyContent: 'flex-end',
        paddingTop: 60
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
        marginTop: 10,
        resizeMode: 'stretch',
        borderRadius: 10,
        alignSelf: 'center'
    }
});

export { Chat };
