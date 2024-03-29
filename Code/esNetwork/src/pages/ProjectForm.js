import React, { Component } from 'react';
import { 
    View, 
    FlatList, 
    StyleSheet, 
    ProgressViewIOS, 
    ProgressBarAndroid, 
    Platform, 
    Alert, 
    ActivityIndicator, 
    Image, 
    TouchableHighlight,
    TouchableOpacity,
    Vibration,
    BackHandler
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Form, Label, FlatListe, LinkButton } from '../components';
import { Config, Helper, Database } from '../settings';

const { colors } = Config;

class ProjectForm extends Component {
    state = { isLoading: true, selectedProjects: null, title: 'Projects', showCancelButton: 'menu', rightButton: 'search', visibleProjects: [] }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onPressBack.bind(this));

        const data = Database.realm('Session', { }, 'select', '');

        if (data[0] === undefined) {
            Database.realm('Session', { }, 'delete', '');
            Actions.authentication();
        } else {
            const personId = data[0].personId;        
            Database.request2('GET', `personProjects/${personId}`, {}, 2, (err, response) => {
                if (err) {
                    Alert.alert('Error', err.message);
                    this.refresh();
                } else {
                    if (response.status > 299) {
                        Database.realm('Session', { }, 'delete', '');
                        Actions.authentication();
                    } else {
                        // Add a element with 0 to act as the new Project card
                        const newProj = {
                            projectId: 0, 
                            text: '', 
                            name: '',
                            startDate: Helper.getDateISOfromDate(new Date())
                        };

                        this.setState({ projects: [newProj, ...response], visibleProjects: [newProj, ...response], isLoading: false });
                    }
                }
            }); 
        }       
    }

    componentWillReceiveProps(newProps) {
        let projects = [];
        projects = JSON.parse(JSON.stringify(this.state.projects));

        if (newProps.updated) {
            const { name, startDate, dueDate, projectId, activeTasks } = newProps.updated;
            
            for (let i = 0; i < projects.length; i++) {
                if (projects[i].projectId === projectId) {
                    projects[i].name = name;
                    projects[i].text = name;
                    projects[i].startDate = startDate;
                    projects[i].dueDate = dueDate;
                    projects[i].activeTasks = activeTasks;
                } 
            }
        } else if (newProps.newProject) {
            const { name, text, startDate, dueDate, projectId, activeTasks, progress, members } = newProps.newProject;
            projects.splice(1, 0, {
                projectId,
                name,
                startDate,
                dueDate,
                text,
                activeTasks,
                progress,
                members
            });
        }

        this.setState({ projects, visibleProjects: projects });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onPressBack.bind(this));        
    }    

    onPressBack() {
        return false;        
    }    

    handleResponse(response) {
        console.log(response.status);
        this.setState({ status: response.status });
        return response.json();
    }      
    
    projectPressed(item) {
        if (this.state.selectedProjects === null) {
            Actions.taskForm({ currentProject: item });
        } else {
            if (item.projectId === this.state.selectedProjects.projectId) {
                this.unSelect();
            } else {
                this.selectProject(item);
            }
        }
    }

    saveProject(data) {
        Database.request2('PUT', `project/${this.state.selectedProjects.projectId}`, data, 1, 
        (error, response) => {
            if (error) {
                Alert.alert('Error', error.message);
            } else {
                let projects = [];
                projects = JSON.parse(JSON.stringify(this.state.projects));

                const { stateId, projectId } = response[0];
                
                for (let i = 0; i < projects.length; i++) {
                    if (projects[i].projectId === projectId) {
                        projects.splice(i, 1);
                    } 
                }

                this.setState({ projects, visibleProjects: projects });
                this.unSelect();
            }
        });
    }    

    unSelect() {
        let projects = [];
        projects = JSON.parse(JSON.stringify(this.state.projects));

        for (let i = 0; i < projects.length; i++) {
                projects[i].selected = false;
        }       

        this.setState({ 
            selectedProjects: null, 
            rightButton: 'search', 
            showCancelButton: 'menu', 
            title: 'Projects', 
            projects,
            visibleProjects: projects
        });
    }

    selectProject(item) {
        let projects = [];
        projects = JSON.parse(JSON.stringify(this.state.projects));
        
        for (let i = 0; i < projects.length; i++) {
            if (projects[i].projectId === item.projectId) {
                projects[i].selected = true;
            } else {
                projects[i].selected = false;
            }
        }
        Vibration.vibrate([0, 50], false);
        this.setState({ 
            selectedProjects: item, 
            rightButton: 'edit,rubbish,checked', 
            showCancelButton: 'cancel', 
            title: '', 
            projects, 
            visibleProjects: projects 
        });
    }

    onPressRight(pressedIcon) {
        if (this.state.rightButton === 'search') {
            this.setState({ isSearching: true, rightButton: 'cancel' });
        } else if (this.state.rightButton === 'cancel') {
            this.setState({ isSearching: false, rightButton: 'search', visibleProjects: this.state.projects });
        } else {
            if (pressedIcon === 'edit') {
                Actions.editProjectForm(this.state.selectedProjects);
            } else if (pressedIcon === 'rubbish') {
                if (this.state.selectedProjects.activeTasks > 0) {
                    Alert.alert('Warning!', 'Complete all tasks to delete a project.');
                    return;
                }      
                
                Alert.alert(
                    'Delete project?',
                    'Are you sure you want to delete the project',
                    [
                        { text: 'Yes', onPress: () => this.saveProject({ stateId: 2 }) },
                        { text: 'Cancel', onPress: () => console.log('cancel'), style: 'cancel' }                    
                    ]
                );                

            } else if (pressedIcon === 'checked') {
                let message = 'Mark project as completed?';
                let submessage = '';
                let newStateId = { stateId: 5 };
                if (this.state.selectedProjects.activeTasks > 0) {
                    submessage = `${this.state.selectedProjects.activeTasks} tasks will be marked as completed. Are you sure?`;
                }

                if (this.state.selectedProjects.stateId === 5) {
                    message = 'Do you want to reactivate the project?';
                    submessage = '';
                    newStateId = { stateId: 1 };
                }

                Alert.alert(
                    message,
                    submessage,
                    [
                        { text: 'Yes', onPress: () => this.saveProject(newStateId) },
                        { text: 'Cancel', onPress: () => console.log('cancel'), style: 'cancel' }                    
                    ]
                );
            }
        }
    }

    onSearch(text) {
        if (text === '') {
            this.setState({ visibleProjects: this.state.projects });
        } else {
            const visibleProjects = this.state.projects.filter((project) => {
                return project.name.toLowerCase().includes(text.toLowerCase());
            });

            this.setState({ visibleProjects });
        }
    }

    renderProgress(progress) {
        let prog = parseFloat(progress);
        if (Platform.OS === 'ios') {
            return (
                <ProgressViewIOS 
                    progress={prog}
                    progressTintColor={colors.clickable}
                />
            );
        } 
        
        return (
            <ProgressBarAndroid 
                styleAttr='Horizontal'
                indeterminate={false}
                progress={prog}
                color={colors.clickable}
            />
        );
    }

    renderCompleteness(item) {
        const { 
            taskContStyle,
            circleStyle,
            countStyle,
            statStyle
        } = styles;    

        if (item.stateId === 5) {
            return (
                <View style={taskContStyle}>
                    <Image 
                        style={{ 
                            width: 50, 
                            height: 50, 
                            tintColor: colors.main 
                        }} 
                        source={{ uri: 'ok' }} 
                    />                
                </View>
            );
        }

        return (
            <View>
                <View style={taskContStyle}>
                    <View style={circleStyle}>
                        <Label style={countStyle}>{item.activeTasks}</Label>
                        <Label style={statStyle}>Active Tasks</Label>
                    </View>
                </View>
                <View style={{ margin: 10 }}>
                    {this.renderProgress(item.progress)}
                </View>                
            </View>
        );
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

    renderItem({ item }) {
        const { 
            projectStyle, 
            labelStyle, 
            labelDateStyle, 
            labelsContainerStyle,
            progressContainer,
            avatarStyles,
            newProjectStyle,
            newImageStyle
        } = styles;

        let completedStyle = {};

        if (item.projectId === 0) {
            return (//New peoject
                <TouchableOpacity
                    onPress={() => Actions.editProjectForm(item)}
                >                
                    <View 
                        key={item.projectId} 
                        style={[projectStyle, newProjectStyle]}
                    >
                                <Image 
                                    style={newImageStyle} 
                                    source={{ uri: 'plus' }} 
                                />
                                <Label>New Project</Label>                        
                    </View>
                </TouchableOpacity>
            );
        }


        if (item.stateId === 5) {
            completedStyle = { opacity: 0.5 };
        }
        
        return (
            <View 
                key={item.projectId} 
                style={[projectStyle, completedStyle]}
            >             
                <TouchableHighlight
                    underlayColor={colors.background}
                    onPress={() => this.projectPressed(item)}
                    onLongPress={() => this.selectProject(item)}
                >
                    <View>
                    {
                        (item.selected) ?
                        <View style={{ justifyContent: 'center', alignItems: 'center', zIndex: 100, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                            <View style={{ opacity: 0.6, backgroundColor: colors.main, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} />
                            <Image style={{ width: 50, height: 50, tintColor: colors.elementBackground }} source={{ uri: 'ok' }} />
                        </View> :
                        <View />
                    }                           
                    <View style={labelsContainerStyle}>
                        <View style={{ flex: 5 }}>
                            <Label light style={labelStyle}>{item.text}</Label>
                            <Label light style={labelDateStyle}>
                                {`${Helper.prettyfyDate(item.startDate).date} - ${Helper.prettyfyDate(item.dueDate).date}`}
                            </Label>
                        </View>
                        {this.renderNotifications(item)}
                        {/* <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <TouchableHighlight>
                                <Image style={{ tintColor: colors.secondText, width: 14, height: 14 }} source={{ uri: 'chevron' }} />
                            </TouchableHighlight>    
                        </View> */}
                    </View>
                    <View style={progressContainer}>
                        {this.renderCompleteness(item)}
                        <View style={avatarStyles}>
                            <FlatListe 
                                keyEx='personId'
                                data={JSON.parse(item.members)}
                                itemType='avatar'
                                size='small'
                                horizontal
                                stacked
                            />
                        </View>    
                    </View>
                    </View>
                </TouchableHighlight>     
            </View>   
        );
    }

    renderProjects() {
        if (this.state.isLoading) {
            return <ActivityIndicator size='large' />;
        }

        return (
            <FlatList 
                keyExtractor={item => item.projectId}
                data={this.state.visibleProjects}                    
                renderItem={this.renderItem.bind(this)}
                horizontal={false}
                numColumns={2}
            />    
        );
    }

    render() {
        const { mainContainer } = styles;

        return (
            <Form
                title={this.state.title}
                rightIcon={this.state.rightButton}
                leftIcon={this.state.showCancelButton}
                onPressRight={(pressedIcon) => this.onPressRight(pressedIcon)}
                onPressLeft={() => this.unSelect()}
                onSearch={this.onSearch.bind(this)}
                isSearching={this.state.isSearching}
                menuList={
                    [
                        { name: 'Profile', form: 'profile', id: this.state.personId },
                        { name: 'Logout', form: 'authentication', id: 0 }

                    ]
                }                
            >
                <View style={mainContainer}>
                    {this.renderProjects()}
                </View>
            </Form>
        );
    }
}

const styles = new StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.background
    },
    projectStyle: {
        margin: 5,
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.lightText,
        borderRadius: 2,
        backgroundColor: colors.elementBackground
    },
    labelsContainerStyle: {
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    labelStyle: {
        color: colors.mainDark,
        fontSize: 18,
        lineHeight: 23,
        fontWeight: '400'
    },
    labelDateStyle: {
        color: colors.secondText,
        fontSize: 14
    },
    progressContainer: {
        flexDirection: 'column'
    },
    taskContStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    circleStyle: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderRadius: 40,
        borderColor: colors.main,
        alignItems: 'center',
        justifyContent: 'center'
    },
    countStyle: {
        fontSize: 16,
        color: colors.mainDark
    },
    statStyle: {
        fontSize: 12,
        color: colors.secondText
    },
    avatarStyles: {
        marginLeft: 10,
        marginBottom: 10
    },
    newProjectStyle: {
        alignItems: 'center', 
        justifyContent: 'center', 
        borderStyle: 'dashed',
        backgroundColor: colors.background,
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20
    },
    newImageStyle: {
        width: 30, 
        height: 30, 
        borderWidth: 1, 
        borderColor: colors.main, 
        borderRadius: 15,
        tintColor: colors.main        
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

export { ProjectForm };
