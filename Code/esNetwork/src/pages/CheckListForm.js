import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import { FlatListe } from '../components';
import { Database, Helper } from '../settings';

const data = Database.realm('Session', { }, 'select', '');

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
            'checkListItem/1', 
            {}, 
            2,
            this.onHandleResponse.bind(this), 
            this.onSuccess.bind(this),
            this.onError.bind(this)
        );        
    }

    checkPressed(childProps) {
        Database.request(
            'PUT', 
            'checkListItem', 
            {
                checkListId: childProps.checkListId,
                sortNumber: childProps.sortNumber,
                isChecked: !childProps.isChecked,
                terminatorId: data[0].personId
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
        );
    }
}

export { CheckListForm };
