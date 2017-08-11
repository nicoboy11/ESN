import React, { Component } from 'react';
import { ScrollView, ActivityIndicator, Alert, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Form, CardList, NewCard, FlatListe, TaskCard3} from '../components';
import { Config, Database } from '../settings';

const { texts, network, colors } = Config;
const data = Database.realm('Session', { }, 'select', '');

class TaskForm extends Component {

    state = { elements: [], isLoading: false, newTaskText: '', isLoadingTask: false, leftButton: 'back', rightButton: 'search' };

    componentWillMount() {
        this.setState({ title: this.props.title });

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
            Database.request2('GET', `personTasks/${data[0].personId}/${projectId}`, {}, 2, (error, response) => {
                this.handleResponse(error, response);
            });
        }
    }

    componentWillReceiveProps(newProps) {
        let elements = this.state.elements;

        for (let i = 0; i < elements.length; i++) {
            if (elements[i].taskId === newProps.updated.taskId) {
                elements[i].name = newProps.updated.name;
                elements[i].dueDate = newProps.updated.dueDate;
                elements[i].progress = newProps.updated.progress;
                elements[i].priorityId = newProps.updated.priorityId;
            }
        }

        this.setState({
            elements,
            visibleTasks: elements
        }); 
    }

    onPressRight() {
        switch (this.state.rightButton) {
            case 'search': 
                this.setState({ isSearching: true, rightButton: 'cancel' });
                return;
            case 'cancel':
                this.setState({ isSearching: false, rightButton: 'search', visibleTasks: this.state.elements });
                return;
            case 'ok':        
                this.createTask();          
            default:
                return;
        }
    }

    onPressLeft() {
        switch (this.state.leftButton) {
            case 'cancel':
                this.setState({ rightButton: 'search', leftButton: 'back', title: this.props.title, listStyle: {} });
                this.listWrapper.disabled = false;
                Keyboard.dismiss();
                return;
            case 'back':
                Actions.pop();
                return;
            default:
                return;
        }
    }

    onSearch(text) {
        if (text === '') {
            this.setState({ visibleTasks: this.state.elements });
        } else {
            const visibleTasks = this.state.elements.filter((task) => {
                return task.name.toLowerCase().includes(text.toLowerCase());
            });

            this.setState({ visibleTasks });
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
            elements,
            visibleTasks: elements
        });
    }

    handleResponse(error, response) {
        if (error) {
            Alert.alert('Error', error.message);
            if (this.state.status === 403) {
                Actions.authentication();
            }                    
        } else {
            //If this was called by a notification open it directly
            if (this.props.auto) {
                const notifTask = response.filter((element) => { 
                    return element.taskId === this.props.taskId; 
                });
                Actions.taskMessage(notifTask[0]);
                return;
            }

            //else run normal flow
            this.setState(
                { 
                    elements: response.concat(this.state.elements), 
                    visibleTasks: response.concat(this.state.elements), 
                    isLoading: false, 
                    newTaskText: '',
                    isLoadingTask: false
                }
            );                    
        }
    }      

    createTask() {
        this.setState({ 
            isLoadingTask: true
        });

        this.setState({ 
            rightButton: 'search', 
            leftButton: 'back', 
            title: this.props.title, 
            listStyle: {},
            isLoadingTask: true 
        });
        this.listWrapper.disabled = false;
        Keyboard.dismiss();  

        Database.request2('POST', 'task', 
            {
                name: this.state.newTaskText,
                creatorId: this.state.personId,
                projectId: this.props.projectId
            }, 1, (error, response) => {
                this.handleResponse(error, response);
            }
        );                   
    }

    focusedNewCard() {
        this.setState({ rightButton: 'ok', leftButton: 'cancel', title: '', listStyle: { opacity: 0.2 } });
        this.listWrapper.disabled = true;
    }    

    renderList() {
        if (this.state.isLoading) {
            return <ActivityIndicator size='large' />;
        }

        return (
            <TouchableWithoutFeedback ref={(listWrapper) => { this.listWrapper = listWrapper; }}>
                <View style={this.state.listStyle} >
                    <FlatListe 
                        keyEx='taskId'
                        itemType='task'
                        data={this.state.visibleTasks}
                        initialNumToRender={4}
                        onPress={(props) => { this.openComments(props); }}
                        updateFromChildren={(update) => this.updateFromChildren(update)}
                    />      
                </View>  
            </TouchableWithoutFeedback>               
        );        
    }

    renderNewTaskLoad() {
        if (this.state.isLoadingTask) {
            return (
                <TaskCard3 
                title={this.state.newTaskText}
                subtitle=''
                id={0}
                onPress={(props) => {}}
                data={{ creator: '[{"avatar":"","theme":"#FFF"}]', progress: 0 }}
                updateFromChildren={(update) => {}}
                />               
            );
        }

        return <View />;
    }

    render() {
        return (
            <Form
                rightIcon={this.state.rightButton}
                leftIcon={this.state.leftButton}
                onPressLeft={() => this.onPressLeft()}
                onPressRight={() => this.onPressRight()}
                title={this.state.title}
                onSearch={this.onSearch.bind(this)}
                isSearching={this.state.isSearching}
                menuList={
                    [
                        { name: 'Search', form: 'search', id: 1 }
                    ]
                }
            >
                <ScrollView>
                    {/*Aqui va para la nueva tarea*/} 
                    <NewCard
                        value={this.state.newTaskText}
                        onChangeText={(newTaskText) => this.setState({ newTaskText, title: newTaskText })}
                        onSubmitEditing={this.createTask.bind(this)}
                        onFocus={this.focusedNewCard.bind(this)}
                        placeholder='Type a new task'
                    />   
                    {this.renderNewTaskLoad()}
                    {this.renderList()}
                </ScrollView>                
            </Form>            
        );
    }

}

export { TaskForm };
