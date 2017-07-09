import React, { Component } from 'react';
import { ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Form, CardList, NewCard, FlatListe } from '../components';
import { Config, Database } from '../settings';

const { texts, network, colors } = Config;
const data = Database.realm('Session', { }, 'select', '');

class TaskForm extends Component {

    state = { elements: [], isLoading: false, personId: data[0].personId, newTaskText: '' };

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
            this.setState(
                { 
                    elements: responseData.concat(this.state.elements), 
                    isLoading: false, 
                    newTaskText: '' 
                }
            );
        }
    }

    openComments(props) {
        Actions.taskMessage(props.data);
    } 

    handleResponse(response) {
        console.log(response.status);
        this.setState({ status: response.status });
        return response.json();
    }      

    createTask() {
        Database.request(
            'POST', 
            'task', 
            {
                name: this.state.newTaskText,
                creatorId: this.state.personId
            }, 
            1,
            this.handleResponse.bind(this), 
            this.onSuccess.bind(this),
            this.onError.bind(this)
        );
    }

    renderList() {
        if (this.state.isLoading) {
            return <ActivityIndicator size='large' />;
        }

        return (
            <FlatListe 
                keyEx='taskId'
                itemType='task'
                data={this.state.elements}
                initialNumToRender={3}
                onPress={(props) => { this.openComments(props); }}
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
                <ScrollView style={{  }}>
                    {/*Aqui va para la nueva tarea*/} 
                    <NewCard
                        name={`${data[0].names} ${data[0].firstLastName}`} 
                        avatar={network.server + data[0].avatar} 
                        color={data[0].theme} 
                        value={this.state.newTaskText}
                        onChangeText={(newTaskText) => this.setState({ newTaskText })}
                        onSubmitEditing={this.createTask.bind(this)}
                    />                    
                    {this.renderList()}
                </ScrollView>                
            </Form>            
        );
    }

}

export { TaskForm };
