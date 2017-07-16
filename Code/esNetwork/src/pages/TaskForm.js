import React, { Component } from 'react';
import { ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Form, CardList, NewCard, FlatListe } from '../components';
import { Config, Database } from '../settings';

const { texts, network, colors } = Config;
const data = Database.realm('Session', { }, 'select', '');

class TaskForm extends Component {

    state = { elements: [], isLoading: false, newTaskText: '' };

    componentWillMount() {
        if (data[0] === undefined) {
            Database.realm('Session', { }, 'delete', '');
            Actions.authentication();
        } else {
            this.setState({ isLoading: true, personId: data[0].personId });
            
            let projectId = this.props.projectId;

            if (projectId === undefined) {
                projectId = 'NULL';
            }

            /** Get elements from API */
            Database.request(
                'GET', 
                `personTasks/${data[0].personId}/${projectId}`, 
                {}, 
                2,
                this.handleResponse.bind(this), 
                this.onSuccess.bind(this),
                this.onError.bind(this)
            );
        }
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

    updateFromChildren(update) {
        let elements = this.state.elements;

        for (let i = 0; i < elements.length; i++) {
            if (elements[i].taskId === update.taskId) {
                elements[i] = update;
            }
        }

        this.setState({
            elements
        });
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
                creatorId: this.state.personId,
                projectId: this.props.projectId
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
                updateFromChildren={(update) => this.updateFromChildren(update)}
            />                       
        );        
    }

    render() {
        return (
            <Form
                rightIcon='menu'
                leftIcon='back'
                onPressLeft={() => Actions.pop()}
                title={this.props.title}
                menuList={
                    [
                        { name: 'Search', form: 'search', id: 1 }
                    ]
                }
            >
                <ScrollView style={{  }}>
                    {/*Aqui va para la nueva tarea*/} 
                    <NewCard
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
