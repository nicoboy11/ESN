import React, { Component } from 'react';
import { ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Form, CardList } from '../components';
import { Config, Database } from '../settings';

const { texts } = Config;

class TaskForm extends Component {

    state = { elements: [], isLoading: false };

    componentWillMount() {
        this.setState({ isLoading: true });
        //get current log in
        const data = Database.realm('Session', { }, 'select', '');
        const personId = data[0].personId;
        this.setState({ personId });
        /** Get elements from API */
        Database.request(
            'GET', 
            `personTasks/${personId}`, 
            {}, 
            true,
            this.handleResponse.bind(this), 
            this.onSuccess.bind(this),
            this.onError.bind(this)
        );
    }

    onError(error) {
        Alert.alert('Error', error.message);
        this.refresh();
    }
    
    onSuccess(responseData) {
        this.setState({ elements: responseData, isLoading: false });
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
                    {this.renderList()}
                </ScrollView>                
            </Form>            
        );
    }

}

export { TaskForm };
