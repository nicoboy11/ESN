import React, { Component } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { FlatListe, NewCard } from '../components';
import { Database, Helper, Config } from '../settings';

const { colors } = Config;
const session = Database.realm('Session', { }, 'select', '');

class CheckListForm extends Component {

    state = { elements: [], processing: false };

    componentWillMount() {
        this.getList();
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
    }

    onSuccessChecked(responseDate) {
        if (this.state.status > 299) {
            console.log('error');
        } else {
            this.setState({
                processing: false
            });
        }
    }

    onError(error) {
        Alert.alert('Error', error.message);
    }

    getList() {
        Database.request(
            'GET', 
            `checkListItem/${this.props.checkListId}`, 
            {}, 
            2,
            this.onHandleResponse.bind(this), 
            this.onSuccess.bind(this),
            this.onError.bind(this)
        );        
    }

    createCheckListItem() {
        this.setState({ 
            elements: [...this.state.elements, { sortNumber: 0, item: this.state.newCheckList, isChecked: false }],
            newCheckList: '',
            updating: true
        });

        const data = {
            checkListId: this.props.checkListId, 
            item: this.state.newCheckList,
            creatorId: session[0].personId
        };

        Database.request2('POST', 'checkListItem', data, 1, (err, response) => {
            if (err) {
                Alert.alert('Error', (response.message) ? response.message : '-');
            } else {
                this.setState({ 
                    elements: response,
                    newCheckList: ''
                });                
            }
        });            
    }

    checkPressed(childProps) {
        Database.request(
            'PUT', 
            'checkListItem', 
            {
                checkListId: childProps.checkListId,
                sortNumber: childProps.sortNumber,
                isChecked: !childProps.isChecked,
                terminatorId: session[0].personId
            }, 
            1,
            this.onHandleResponse.bind(this), 
            this.onSuccessChecked.bind(this),
            this.onError.bind(this)
        );         
    }

    render() {
        return (
            <View>
                <View>
                    {/*Aqui va para la nueva tarea*/} 
                    <NewCard
                        value={this.state.newCheckList}
                        onChangeText={(newCheckList) => this.setState({ newCheckList })}
                        onSubmitEditing={this.createCheckListItem.bind(this)}
                        placeholder='Type a new checklist item'
                    />                   
                    <FlatListe
                        itemType='checkList'
                        separator
                        keyEx='sortNumber'
                        waitUpdate
                        data={this.state.elements}          
                        onPress={this.checkPressed.bind(this)}
                        chkListProcessing={this.state.processing}
                    />                    
                </View>
            </View>
        );
    }
}


export { CheckListForm };
