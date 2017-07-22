import React, { Component } from 'react';
import { ScrollView, View, Slider, Modal, Text, StyleSheet, Alert } from 'react-native';
import { 
    Input, 
    DatePicker, 
    ESModal, 
    SplitButton, 
    PersonSelect2, 
    ListItem2, 
    DateDue, 
    Avatar, 
    LinkButton,
    FlatListe,
    Label
} from '../components';
import { EditTextForm, SelectPersonForm } from './';
import { Config, Helper, Database } from '../settings';
const { texts, colors } = Config;

class EditTaskForm extends Component {
    
    constructor(props) {
        super(props);
        const priority = [
                            { text: 'None', id: 1 },
                            { text: 'Low', id: 2 },
                            { text: 'Medium', id: 3 },
                            { text: 'High', id: 4 },
                            { text: 'Urgent', id: 5 },
                        ];
        this.state = {
            ...props.taskData,
            isProjectModalVisible: false,
            isNameEditorVisible: false,
            isDescriptionEditorVisible: false,
            isLeaderEditorVisible: false,
            isCollaboratorEditorVisible: false,
            processingProgress: false,
            project: { text: props.taskData.projectName, value: props.taskData.projectId },
            showAll: false,
            priority,
            collaborator2Del: null
        };
    }

    componentWillMount() {
        if (this.state.leader !== null) {
            this.setState({ leader: JSON.parse(this.state.leader)[0] });
        } else {
            this.setState({ leader: [] });
        }
        
        if (this.state.collaborators) {
            this.setState({ collaborators: JSON.parse(this.state.collaborators) });
        } else {
            this.setState({ collaborators: [] });
        }
    }

    onLeaderSelected(text, value) {
        Database.request(
            'PUT',
            `task/${this.state.taskId}/leader/${value}`, 
            { personId: value },
            1,
            this.onResponse.bind(this),
            this.onSuccessLeader.bind(this),
            this.onError.bind(this)
        );        
    }

    onCollaboratorSelected(text, value) {
        Database.request(
            'POST',
            'taskMember', 
            { 
                taskId: this.state.taskId,
                personId: value,
                roleId: 3
            },
            1,
            this.onResponse.bind(this),
            this.onSuccessCollaborator.bind(this),
            this.onError.bind(this)
        );          
    }

    onChangeDateStart(date) {
        this.setState({ newStartDate: Helper.getDateISOfromDate(date) });
        this.saveTask({ startDate: Helper.getDateISOfromDate(date) });  
    }

    onChangeDateDue(date) {
        this.setState({ newDueDate: Helper.getDateISOfromDate(date) });
        this.saveTask({ dueDate: Helper.getDateISOfromDate(date) });        
    }

    onPrioritySelection(priorityId) {
        this.setState({ priorityId });
        this.saveTask({ priorityId });
    }

    onSaveName(text) {
        this.setState({ newName: text });
        this.saveTask({ name: text });
    }

    onSaveDescription(text) {
        this.setState({ newDescription: text });
        this.saveTask({ description: text });
    }    

    onSaveProgress() {
        this.setState({ processingProgress: true });
        this.saveTask({ progress: this.state.progress });        
    }

    onPress2Delete(name, id) {
        Alert.alert(
            'Remove',
            `Are you sure you want to remove ${name}`,
            [
                { text: 'Yes', onPress: () => this.removeCollaborator(id) },
                { text: 'No', onPress: () => console.log('no') }
            ]
        );
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

    onSuccessLeader(responseData) {
        if (this.state.status > 299) {
            console.log('error');
        } else {
            this.setState({ leader: responseData[0], isLeaderEditorVisible: false });
        }        
    }

    onSuccessCollaborator(responseData) {
        if (this.state.status > 299) {
            console.log('error');
        } else {
            this.setState({ collaborators: [...this.state.collaborators, responseData[0]], isCollaboratorEditorVisible: false });
        }        
    }

    onSuccessDelete(responseData) {
        // Get new array without the removed element
        const result = this.state.collaborators.filter(
            (person) => person.personId !== this.state.collaborator2Del
        );        

        if (this.state.status > 299) {
            console.log('error');
        } else {
            this.setState({ collaborators: result, isCollaboratorEditorVisible: false });
        }        
    }

    onSuccess(responseData) {
        if (responseData.status > 299) {
            console.log('error');
        } else {
            this.setState({ 
                name: (this.state.newName) ? this.state.newName : this.state.name, 
                isNameEditorVisible: false,
                newName: undefined,                
                description: (this.state.newDescription) ? this.state.newDescription : this.state.description, 
                isDescriptionEditorVisible: false,                
                newDescription: undefined,
                startDate: this.state.newStartDate,
                newStartDate: undefined,
                dueDate: this.state.newDueDate,
                newDueDate: undefined,
                processingProgress: false
            });

            this.startDate.updating = false;
            this.dueDate.updating = false;
            this.updateParent();
        }
    }    

    updateParent() {
        const newState = {
                name: this.state.name, 
                description: this.state.description, 
                startDate: this.state.newStartDate,
                dueDate: this.state.newDueDate,
                collaborators: this.state.collaborators,
                leader: this.state.leader,
                progress: this.state.progress,
                priorityId: this.state.priorityId
        };
        this.props.onUpdateChild(newState);
    }

    saveTask(data) {
        Database.request(
            'PUT',
            `task/${this.state.taskId}`, 
            data,
            1,
            this.onResponse.bind(this),
            this.onSuccess.bind(this),
            this.onError.bind(this)
        );
    }

    removeCollaborator(personId) {
        this.setState({ collaborator2Del: personId });
        Database.request(
            'DELETE',
            'taskMember', 
            { 
                taskId: this.state.taskId,
                personId
            },
            2,
            this.onResponse.bind(this),
            this.onSuccessDelete.bind(this),
            this.onError.bind(this)
        );           
    }

    projectSelected(text, value) {
        this.setState({ project: { text, value }, isProjectModalVisible: false, processingProgress: true });
        Database.request2('PUT', `task/${this.state.taskId}`, { projectId: value }, 1, 
            (err, response) => {
                if (err) {
                    Alert.alert(response.message);
                } else {
                    this.setState({ processingProgress: false });
                }
            });      
    }

    render() {
        return (
            <ScrollView>
                {/* Name editor */}
                    <ListItem2 
                        title='NAME' 
                        editable 
                        onPress={() => this.setState({ isNameEditorVisible: true })}
                    >
                        <Label style={{ color: colors.darkGray }} >{this.state.name}</Label>
                    </ListItem2>
                    <Modal
                        animationType='slide'
                        onRequestClose={() => console.log('closing')}
                        visible={this.state.isNameEditorVisible}
                    >
                        <EditTextForm 
                            title='Name of task'
                            text={this.state.name}
                            onClose={() => this.setState({ isNameEditorVisible: false })}
                            onSave={this.onSaveName.bind(this)}
                        />
                    </Modal>   
                {/* Description editor */}                        
                    <ListItem2 
                        title='DESCRIPTION' 
                        editable
                        onPress={() => this.setState({ isDescriptionEditorVisible: true })}
                    >
                        <Label style={{ color: colors.darkGray }} >{this.state.description}</Label>
                    </ListItem2>  
                    <Modal
                        animationType='slide'
                        onRequestClose={() => console.log('closing')}
                        visible={this.state.isDescriptionEditorVisible}
                    >
                        <EditTextForm 
                            title='Description of task'
                            text={this.state.description}
                            onClose={() => this.setState({ isDescriptionEditorVisible: false })}
                            onSave={this.onSaveDescription.bind(this)}
                        />
                    </Modal>    
                {/* Start Date */}                       
                    <ListItem2 title='START DATE:'>
                        <DateDue 
                            ref={(startDate) => { this.startDate = startDate; }}
                            date={Helper.toDate(this.state.startDate)} 
                            onChangeDate={this.onChangeDateStart.bind(this)}
                        />
                    </ListItem2>    
                {/* Due Date */}
                    <ListItem2 title='DUE DATE:'>
                        <DateDue 
                            ref={(dueDate) => { this.dueDate = dueDate; }}
                            date={Helper.toDate(this.state.dueDate)} 
                            onChangeDate={this.onChangeDateDue.bind(this)}
                        />
                    </ListItem2>
                {/* Progress */}    
                    <ListItem2 title='PROGRESS:' style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 4 }}>  
                            <Slider 
                                minimumValue={0}
                                maximumValue={100}
                                step={1}
                                thumbTintColor={colors.main}
                                minimumTrackTintColor={colors.main}
                                value={this.state.progress}
                                onValueChange={(value) => this.setState({ progress: value })}
                                onSlidingComplete={this.onSaveProgress.bind(this)}
                                disabled={this.state.processingProgress}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Label>{this.state.progress}%</Label>
                        </View>
                    </ListItem2>    
                {/* Priority */}    
                    <ListItem2 title='PRIORITY:'>
                        <SplitButton 
                            onSelection={this.onPrioritySelection.bind(this)}
                            elements={this.state.priority}
                            selectedItem={this.state.priorityId}
                        />
                    </ListItem2>
                {/* Leader */}         
                    <ListItem2 
                        title='LEADER:' 
                        editable
                        onPress={() => this.setState({ isLeaderEditorVisible: true })}
                    >
                        {<Avatar 
                            avatar={this.state.leader.avatar}
                            color={this.state.leader.theme}
                            name={this.state.leader.person}
                            size='medium'
                        />}
                    </ListItem2>         
                    <Modal
                        animationType='slide'
                        onRequestClose={() => console.log('closing')}
                        visible={this.state.isLeaderEditorVisible}                
                    >
                        <SelectPersonForm 
                            title='Select a leader' 
                            onSelection={this.onLeaderSelected.bind(this)}
                            onClose={() => this.setState({ isLeaderEditorVisible: false })}
                        />
                    </Modal>
                {/* Collaborators */}    
                    <ListItem2 
                        title='COLLABORATORS:' 
                        editable
                        onPress={() => this.setState({ isCollaboratorEditorVisible: true })}
                    >
                        <FlatListe 
                            keyEx='personId'
                            data={this.state.collaborators}
                            itemType='avatar'
                            horizontal
                            onPress={this.onPress2Delete.bind(this)}
                        />
                    </ListItem2>
                    <Modal
                        animationType='slide'
                        onRequestClose={() => console.log('closing')}
                        visible={this.state.isCollaboratorEditorVisible}                
                    >
                        <SelectPersonForm 
                            title='Select a collaborator' 
                            onSelection={this.onCollaboratorSelected.bind(this)}
                            onClose={() => this.setState({ isCollaboratorEditorVisible: false })}
                        />
                    </Modal>                
                <ListItem2 title='PROJECT:'>
                    {
                    <View>
                        <LinkButton 
                            title={this.state.project.text}
                            onPress={() => this.setState({ isProjectModalVisible: true })}
                            style={{ opacity: (this.state.processingProject) ? 0.5 : 1 }}
                        />
                        <ESModal 
                            title={texts.projectSelect} 
                            visible={this.state.isProjectModalVisible} 
                            onSelection={this.projectSelected.bind(this)}
                            elements={[]}
                            table='projects'
                            selectedItem={this.state.projectId}
                        />                        
                    </View>    
                    }
                </ListItem2>                                                                                                
            </ScrollView>
        );
    }
}

export { EditTaskForm };

const styles = new StyleSheet.create({
    rowStyle: {
        marginTop: 5,
        marginBottom: 10
    }
});
