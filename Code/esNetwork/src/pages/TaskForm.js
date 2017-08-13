import React, { Component } from 'react';
import { 
    ScrollView, 
    ActivityIndicator, 
    Alert, 
    View, 
    TouchableWithoutFeedback, 
    TouchableOpacity, 
    Keyboard, 
    Vibration, 
    Text, 
    StyleSheet,
    Image 
} from 'react-native';
import OneSignal from 'react-native-onesignal';
import { Actions } from 'react-native-router-flux';
import { Form, CardList, NewCard, FlatListe, TaskCard3} from '../components';
import { Config, Database } from '../settings';

const { texts, network, colors } = Config;
let session = {};

class TaskForm extends Component {

    state = { 
        tasks: [], 
        forceRender: false, 
        isLoading: false, 
        newTaskText: '', 
        selectedTasks: null, 
        isLoadingTask: false, 
        leftButton: 'back', 
        rightButton: 'search,more',
        deletingTask: false,
        isMenuVisible: false,
        currentFilter: 1 /* 1: Active, 5: Completed, 0: All */
    };

    componentWillMount() {
        OneSignal.addEventListener('received', this.onReceived.bind(this));

        session = Database.realm('Session', { }, 'select', '');
        this.setState({ title: this.props.title });

        if (session[0] === undefined) {
            Database.realm('Session', { }, 'delete', '');
            Actions.authentication();
        } else {
            this.setState({ isLoading: true, personId: session[0].personId });
            
            let projectId = this.props.projectId;

            if (projectId === undefined) {
                projectId = 'NULL';
            }

            /** Get elements from API */
            Database.request2('GET', `personTasks/${session[0].personId}/${projectId}`, {}, 2, (error, response) => {
                this.handleResponse(error, response);
            });
        }
    }

    componentWillReceiveProps(newProps) {
        let tasks = JSON.parse(JSON.stringify(this.state.tasks));

        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].taskId === newProps.updated.taskId) {
                tasks[i].name = newProps.updated.name;
                tasks[i].dueDate = newProps.updated.dueDate;
                tasks[i].progress = newProps.updated.progress;
                tasks[i].priorityId = newProps.updated.priorityId;
                tasks[i].allNotif = newProps.updated.allNotif;
            }
        }

        this.setState({
            tasks,
            visibleTasks: tasks,
            forceRender: true
        }); 
    }

    onReceived(notification) {
        let tasks = JSON.parse(JSON.stringify(this.state.tasks));

        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].taskId === notification.payload.additionalData.taskId) {
                tasks[i].allNotif ++;
                Vibration.vibrate([0, 200, 200], false);
            }
        }

        this.setState({
            tasks,
            visibleTasks: tasks,
            forceRender: true
        });         
    }

    onPressRight(pressedIcon) {
        switch (this.state.rightButton) {
            case 'cancel':
                this.setState({ isSearching: false, rightButton: 'search', visibleTasks: this.state.tasks });
                return;
            case 'ok':        
                this.createTask();    
                return;      
            default:
                if (pressedIcon === 'edit') {
                    Actions.editTaskForm({ taskData: this.state.selectedTasks.data });
                } else if (pressedIcon === 'search') {
                    this.setState({ isSearching: true, rightButton: 'cancel' });
                    return;
                } else if (pressedIcon === 'more') {
                    this.setState({ isMenuVisible: !this.state.isMenuVisible });
                    return;
                } else if (pressedIcon === 'rubbish') {
                    Alert.alert(
                        'Delete task?',
                        'Are you sure you want to delete this task',
                        [
                            { text: 'Yes', onPress: () => this.deleteTask({ stateId: 2, deletingTask: true }) },
                            { text: 'Cancel', onPress: () => console.log('cancel'), style: 'cancel' }                    
                        ]
                    );                          
                }
                return;
        }
    }

    onPressLeft() {
        switch (this.state.leftButton) {
            case 'cancel':
                this.setState({ rightButton: 'search,more', leftButton: 'back', title: this.props.title, listStyle: {} });
                this.listWrapper.disabled = false;
                this.unSelect();
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
            this.setState({ visibleTasks: this.state.tasks });
        } else {
            const visibleTasks = this.state.tasks.filter((task) => {
                return task.name.toLowerCase().includes(text.toLowerCase());
            });

            this.setState({ visibleTasks });
        }
    }    

    deleteTask(data) {
        this.setState({ deletingTask: true });
        Database.request('PUT', `task/${this.state.selectedTasks.data.taskId}`, data, 1,
        (response, error) => {
            this.setState({ deletingTask: false });
            if (error) {
                Alert.alert('Error', error.message);
            } else {
                let tasks = [];
                tasks = JSON.parse(JSON.stringify(this.state.tasks));
                
                for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i].taskId === this.state.selectedTasks.data.taskId) {
                        tasks.splice(i, 1);
                    } 
                }

                this.setState({ tasks, visibleTasks: tasks });
                this.unSelect();                            
            }
        });          
    }

    filterTasks(filterId) {
        this.setState({ currentFilter: filterId });

        let tasks = [];
        let visibleTasks = [];
        tasks = JSON.parse(JSON.stringify(this.state.tasks));
        
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].stateId === filterId || filterId === 0) {
                visibleTasks.push(tasks[i]);
            } 
        }

        this.setState({ visibleTasks, isMenuVisible: false });        
    }

    selectTask(props) {
        let tasks = [];
        tasks = JSON.parse(JSON.stringify(this.state.tasks));
        
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].taskId === props.data.taskId) {
                tasks[i].selected = true;
            } else {
                tasks[i].selected = false;
            }
        }
        Vibration.vibrate([0, 50], false);
        this.setState({ 
            selectedTasks: props, 
            rightButton: 'edit,rubbish', 
            leftButton: 'cancel', 
            title: '', 
            tasks, 
            visibleTasks: tasks 
        });
    }

    unSelect() {
        let tasks = [];
        tasks = JSON.parse(JSON.stringify(this.state.tasks));

        for (let i = 0; i < tasks.length; i++) {
                tasks[i].selected = false;
        }       

        this.setState({ 
            selectedTasks: null, 
            rightButton: 'search,more', 
            leftButton: 'back', 
            title: this.props.title, 
            tasks,
            visibleTasks: tasks
        });
    }

    taskPressed(item) {
        if (this.state.selectedTasks === null) {
            this.openComments(item);
        } else {
            if (item.taskId === this.state.selectedTasks.taskId) {
                this.unSelect();
            } else {
                this.selectTask(item);
            }
        }        
    }

    openComments(props) {
        Actions.taskMessage(props.data);
    } 

    updateFromChildren(update) {
        let tasks = this.state.tasks;

        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].taskId === update.taskId) {
                tasks[i] = update;
            }
        }

        this.setState({
            tasks,
            visibleTasks: tasks
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
                    tasks: response.concat(this.state.tasks), 
                    isLoading: false, 
                    newTaskText: '',
                    isLoadingTask: false
                }
            );      
            
            this.filterTasks(this.state.currentFilter);
        }
    }      

    createTask() {
        this.setState({ 
            isLoadingTask: true
        });

        this.setState({ 
            rightButton: 'search,more', 
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
                        onPress={(props) => { this.taskPressed(props); }}
                        onLongPress={(props) => { this.selectTask(props); }}
                        updateFromChildren={(update) => this.updateFromChildren(update)}
                        forceRender={this.state.forceRender}
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

    renderNewCard() {
        if (this.props.projectStateId === 5) {
            return <View />;
        }
        
        return (
            <NewCard
                value={this.state.newTaskText}
                onChangeText={(newTaskText) => this.setState({ newTaskText, title: newTaskText })}
                onSubmitEditing={this.createTask.bind(this)}
                onFocus={this.focusedNewCard.bind(this)}
                placeholder='Type a new task'
            /> 
        );
    }

    renderMenuSelection(filterId) {
        if (filterId === this.state.currentFilter) {
            return (
                <Image 
                    tintColor={colors.clickable} 
                    source={{ uri: 'ok' }}
                    style={{ width: 14, height: 14, tintColor: colors.clickable }} 
                />                
            );
        }

        return <View />;
    }

    renderMenu() {
        if (this.state.isMenuVisible) {
            return (
                <View style={{ zIndex: 299, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                    <TouchableOpacity onPress={() => this.setState({ isMenuVisible: false })} style={styles.fakeBackground} />
                    <View style={styles.shadow}>
                        <TouchableOpacity onPress={() => this.filterTasks(1)}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.menuTextStyle}>Active</Text>
                                {this.renderMenuSelection(1)}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.filterTasks(5)}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.menuTextStyle}>Completed</Text>
                                {this.renderMenuSelection(5)}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.filterTasks(0)}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.menuTextStyle}>All</Text>
                                {this.renderMenuSelection(0)}
                            </View>
                        </TouchableOpacity>
                    </View> 
                </View>           
            );
        }

        return <View />;
    }

    renderDeleting() {
        if (this.state.deletingTask) {
            return (
                <View style={{ zIndex: 299, position: 'absolute', justifyContent: 'center', alignItems: 'center', top: 0, bottom: 0, left: 0, right: 0 }}>
                    <View style={[styles.shadowIndicator]}>
                        <ActivityIndicator size='large' />
                    </View> 
                </View>          
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
                onPressRight={(pressedIcon) => this.onPressRight(pressedIcon)}
                title={this.state.title}
                onSearch={this.onSearch.bind(this)}
                isSearching={this.state.isSearching}
                menuList={
                    [
                        { name: 'Search', form: 'search', id: 1 }
                    ]
                }
            >
                {this.renderMenu()}
                {this.renderDeleting()}   
                <ScrollView>
                    {/*Aqui va para la nueva tarea*/} 
                    {this.renderNewCard()}
                    {this.renderNewTaskLoad()}
                    {this.renderList()}
                </ScrollView>                
            </Form>            
        );
    }

}

const styles = new StyleSheet.create({
    shadow: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0.2 },
            shadowOpacity: 0.2,
            elevation: 299,
            position: 'absolute',
            zIndex: 299,
            backgroundColor: colors.background,
            right: 3,
            top: 3,
            padding: 10
        },
    shadowIndicator: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0.2 },
            shadowOpacity: 0.2,
            elevation: 299,
            position: 'absolute',
            zIndex: 299,
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 25,
            backgroundColor: colors.background
        },        
    menuTextStyle: {
        margin: 5,
        fontSize: 18
    },
    fakeBackground: {
        backgroundColor: 'transparent', 
        position: 'absolute', 
        top: 0, 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 150,   
        elevation: 150  
    }
});

export { TaskForm };
