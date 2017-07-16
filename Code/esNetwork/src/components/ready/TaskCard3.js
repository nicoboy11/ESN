import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Config, Helper, Database } from '../../settings';
import { Avatar, DateDue } from '../';
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

    onResponse(response) {
        this.setState({ status: response.status });
        return response.json();
    }  

    onError(error) {
        if (this.state.status === 403) {
            Alert.alert('Authentication Error');
        } else {
            Alert.alert('Unable to save the data.', `Code: ${this.state.status}, ${error.message}`);
            this.startDate.updating = false;
            this.dueDate.updating = false;
        }
    }

    onSuccess(responseData) {
        if (this.state.status > 299) {
            console.log('error');
        } else {
            const data = this.state.data;
            data.stateId = this.state.newStateId;

            this.setState({ data });
            this.props.updateFromChildren(data);
        }        
    }

    onChangeDate() {

    }

    toogleTask() {
        let stateId = this.state.data.stateId;
        if (stateId === 1) {
            this.setState({ newStateId: 2 });
            stateId = 2;
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

    render() {
        const {
            containerStyle,
            topContainerStyle,
            bottomContainerStyle,
            checkImage,
            uncheckImage,
            percentStyle,
            percentText,
            subTitleContainer,
            subTitleText,
            titleText,
            titlecontainer,
            smallTitle,
            smallContainers,
            separator,
            chevronClosed
        } = styles;

        const { data, date, subtitle, title, id, onPress } = this.state;

        const creator = JSON.parse(data.creator)[0];

        return (
            <View key={id} style={[containerStyle, (data.stateId === 1) ? {} : { opacity: 0.4 }]}>
                <TouchableOpacity onPress={() => onPress(this.props)}>                
                    <View style={topContainerStyle}>
                        <View style={[percentStyle, { borderColor: Helper.prettyfyDate(date).color }]}>
                            <Text style={percentText}>{`${data.progress}%`}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={[subTitleContainer, { flex: 1, marginTop: 10 }]}>
                                <Text style={subTitleText}>{subtitle}</Text>
                            </View>
                            <View style={[titlecontainer, { flex: 1 }]}>
                                <Text style={titleText}>{title}</Text>
                            </View>
                            <View style={[subTitleContainer, { flex: 1, marginBottom: 10 }]}>
                                <Avatar 
                                    avatar={creator.avatar}
                                    color={creator.theme}
                                    size='mini'
                                    name={creator.person}
                                    nameColor={colors.secondText}
                                />
                            </View>                            
                        </View>
                    </View>
                </TouchableOpacity>                
                <View style={bottomContainerStyle}>
                    <View style={[smallContainers, separator]}>
                        <DateDue 
                            ref={(date) => { this.startDate = date; }}
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
                            {
                                (data.stateId !== 1) ?
                                <Image 
                                    source={{ uri: 'checked' }}
                                    style={checkImage}
                                    tintColor={colors.main}
                                /> :
                                <Image 
                                    source={{ uri: 'unchecked' }}
                                    style={uncheckImage}
                                    tintColor={colors.secondText}
                                />                                 
                            }
                        </TouchableOpacity>
                    </View>         
                    <View style={[smallContainers, { flex: 0.5 }]}>
                        <TouchableOpacity
                            style={{ flex: 1, alignSelf: 'center' }}
                            onPress={() => onPress(this.props)}
                        >
                            <Image 
                                source={{ uri: 'chevron' }}
                                style={chevronClosed}
                                tintColor={colors.mainDark}
                            />
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
    }    
});

export { TaskCard3 };
