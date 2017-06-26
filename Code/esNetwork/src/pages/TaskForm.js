import React, { Component } from 'react';
import { ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Form, CardList, Button } from '../components';
import { Config, Database } from '../settings';

const { texts } = Config;
const data = Database.realm('Session', { }, 'select', '');

class TaskForm extends Component {

    state = { elements: [], isLoading: false, personId: data[0].personId };

    componentWillMount() {
        this.setState({ isLoading: true });

        /** Get elements from API */
        Database.request(
            'GET', 
            `personTasks/${data[0].personId}`, 
            {}, 
            2,
            this.handleResponse.bind(this), 
            this.onSuccess.bind(this),
            this.onError.bind(this)
        );
    }

    onError(error) {
        Alert.alert('Error', error.message);
        if (this.state.status === 403) {
            Actions.authentication();
        }
    }
    
    onSuccess(responseData) {
        if (this.state.status === 403) {
            Database.realm('Session', { }, 'delete', '');
            Actions.authentication();
        } else if (this.state.status > 299) {
            Alert.alert('Error', 'There was an error with the request.');
        } else {        
            this.setState({ elements: responseData, isLoading: false });
        }
    }

    handleResponse(response) {
        console.log(response.status);
        this.setState({ status: response.status });
        return response.json();
    }      

    renderList() {
        if (this.state.isLoading) {
            return <ActivityIndicator size='large' />;
        }

        return (
            <CardList 
                type='Task'
                elements={this.state.elements}
            />
        );        
    }

    render() {
        return (
            <Form
                rightIcon='menu'
                title={texts.tasks}
                menuList={
                    [
                        { name: 'Search', form: 'search', id: 1 }
                    ]
                }
            >
                <ScrollView style={{ backgroundColor: '#EFEFEF' }}>
                    {/*Aqui va para la nueva tarea*/} 
                    {this.renderList()}
                </ScrollView>                
            </Form>            
        );
    }

}

export { TaskForm };
