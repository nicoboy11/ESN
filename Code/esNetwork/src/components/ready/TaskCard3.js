import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Config, Helper, Database } from '../../settings';
import { Avatar, DateDue, Label } from '../';
const { colors, font } = Config;

class TaskCard3 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...props,
            newStateId: props.data.stateId,
            taskId: props.id
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            ...newProps,
            newStateId: newProps.data.stateId,
            taskId: newProps.id
        });
    }

    onResponse(response) {
        this.setState({ status: response.status });
        return response.json();
    }  

    onError(error) {
        if (this.state.status === 403) {
            Alert.alert('Authentication Error');
        } else {
            Alert.alert('Unable to save the data.', `Code: ${this.state.status}, ${error.message}`);
            this.setState({ isChecking: false });
        }
    }

    onSuccess(responseData) {
        if (this.state.status > 299) {
            console.log('error');
        } else {
            const data = this.state.data;
            data.stateId = this.state.newStateId;

            this.setState({ data, isChecking: false });
            this.props.updateFromChildren(data);
        }        
    }

    onChangeDate(dueDate) {
        const params = { dueDate: Helper.getDateISOfromDate(dueDate) };
        this.setState({ date: Helper.getDateISOfromDate(dueDate) });                

        Database.request2('PUT', `task/${this.state.taskId}`, params, 1, (err, response) => {
            if (err) {
                Alert.alert('Error', response.message);
            } else {
                const data = this.state.data;
                data.dueDate = this.state.dueDate;

                this.setState({ data });
                this.props.updateFromChildren(data);
            }
        });   
    }

    toogleTask() {
        let stateId = this.state.data.stateId;
        this.setState({ isChecking: true });
        if (stateId === 1) {
            this.setState({ newStateId: 5 });
            stateId = 5;
        } else {
            this.setState({ newStateId: 1 });
            stateId = 1;
        }

        Database.request(
            'PUT',
            `task/${this.state.taskId}`, 
            {
                stateId
            },
            1,
            this.onResponse.bind(this),
            this.onSuccess.bind(this),
            this.onError.bind(this)
        );        
    }

    renderCheck(data) {
        const {
            checkImage,
            uncheckImage
        } = styles;

        if (this.state.isChecking) {
            return <ActivityIndicator size='small' />;
        }

        if (data.stateId !== 1) {
            return (<Image 
                        source={{ uri: 'checked' }}
                        style={checkImage}
                        tintColor={colors.main}
            />);
        }

        return (<Image 
                    source={{ uri: 'unchecked' }}
                    style={uncheckImage}
                    tintColor={colors.secondText}
        />);         
    }

    renderNotifications(data) {
        const {
            badgeStyle,
            badgeText
        } = styles;

        if (data.allNotif > 0) {
            return (
                <View style={badgeStyle}>
                    <Label style={badgeText}>{data.allNotif}</Label>
                </View>
            );
        }

        return <View />;
    }

    render() {
        const {
            containerStyle,
            topContainerStyle,
            bottomContainerStyle,
            percentStyle,
            percentText,
            subTitleContainer,
            subTitleText,
            titleText,
            titlecontainer,
            smallTitle,
            smallContainers,
            separator
        } = styles;

        const { data, date, subtitle, title, id, onPress, onLongPress, selected } = this.state;

        const creator = JSON.parse(data.creator)[0];

        return (            
            <View key={id} style={[containerStyle, (data.stateId === 1) ? {} : { opacity: 0.4 }]}>
                {
                    (selected) ?
                    
                        <View style={{ zIndex: 100, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => onPress(this.props)}> 
                                <View style={{ opacity: 0.6, backgroundColor: colors.main, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
                                <Image style={{ width: 50, height: 50, tintColor: colors.elementBackground }} source={{ uri: 'ok' }} />
                            </TouchableOpacity>                                
                        </View> :
                    <View />
                }                  
                <TouchableOpacity onPress={() => onPress(this.props)} onLongPress={() => onLongPress(this.props)}>                
                    <View style={topContainerStyle}>
                        <View style={[percentStyle, { borderColor: Helper.prettyfyDate(date).color }]}>
                            <Text style={percentText}>{`${data.progress}%`}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'space-around' }}>
                            <View style={[titlecontainer, { flex: 1 }]}>
                                <Text style={titleText}>{title}</Text>
                            </View>                                   
                            <View style={[subTitleContainer, { flex: 1, marginTop: 10 }]}>
                                <Text style={subTitleText}>{subtitle}</Text>
                            </View>                  
                        </View>
                        {this.renderNotifications(data)}
                    </View>
                </TouchableOpacity>                
                <View style={bottomContainerStyle}>
                    <View style={[smallContainers, separator, { flex: 0.5 }]}>
                        <TouchableOpacity
                            style={{ flex: 1, alignSelf: 'center' }}
                            onPress={() => onPress(this.props)}
                        >
                                <Avatar 
                                    avatar={creator.avatar}
                                    color={creator.theme}
                                    size='medium'
                                />
                        </TouchableOpacity>
                    </View>                       
                    <View style={[smallContainers, separator]}>
                        <DateDue 
                            ref={(date) => { this.dueDate = date; }}
                            date={Helper.toDate(date)} 
                            onChangeDate={this.onChangeDate.bind(this)}
                            title='Due Date'
                        />                        
                    </View>
                    <View style={[smallContainers, separator]}>
                        <Text style={smallTitle}>Resume</Text>                        
                    </View>
                    <View style={[smallContainers, separator]}>
                        <TouchableOpacity
                            onPress={this.toogleTask.bind(this)}
                        >
                            {this.renderCheck(data)}
                        </TouchableOpacity>
                    </View>                                        
                </View>                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.lightText,   
        backgroundColor: colors.elementBackground,
        marginBottom: 10,
        marginTop: 5,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 3
    },
    topContainerStyle: {
        flexDirection: 'row'
    },
    bottomContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.lightText,           
        backgroundColor: colors.background
    },
    checkImage: {
        width: 24,
        height: 24,
        tintColor: colors.main
    },
    uncheckImage: {
        width: 24,
        height: 24,
        tintColor: colors.secondText
    },    
    percentStyle: {
        borderWidth: 4,
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        alignSelf: 'center'
    },
    percentText: {
        fontFamily: font.normal,
        fontWeight: '600'
    },
    subTitleContainer: {
        
    },
    subTitleText: {
        fontFamily: font.light,
        fontSize: 14,
        color: colors.secondText,   
        flex: 1     
    },
    titlecontainer: {
        
    },
    titleText: {
        fontFamily: font.normal,
        fontSize: 18,
        color: colors.mainDark
    },
    smallContainers: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: colors.background
    },
    smallTitle: {
        color: colors.mainDark,
        fontSize: 12,
    },
    separator: {
        borderColor: colors.lightText,
        borderRightWidth: StyleSheet.hairlineWidth
    },
    chevronClosed: {
        width: 24,
        height: 24,
        transform: [{ rotate: '-90deg' }]
    },
    badgeStyle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.main,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    badgeText: {
        fontSize: 14,
        color: colors.mainText
    }
});

export { TaskCard3 };
