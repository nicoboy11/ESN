import React, { Component } from 'react';
import { ScrollView, Modal, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Form, ListItem2, Label, DateDue, FlatListe, Input } from '../components';
import { EditTextForm, SelectPersonForm } from './';
import { Config, Helper, Database } from '../settings';

const session = Database.realm('Session', { }, 'select', '');
const { colors } = Config;

class EditProjectForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...props,
            isProjectModalVisible: false,
            isNameEditorVisible: false,
            isLeaderEditorVisible: false,
            isMemberEditorVisible: false
        };
    }

    componentWillMount() {
        if (this.state.projectId !== 0) { //If the project is not new...
            this.setState({ members: JSON.parse(this.state.members) });   
        }     
    }

    componentDidMount() {
        if (this.state.projectId === 0) { //If the project is new...
            this.inpt_projectName.focus(); 
        }             
    }

    onSaveName(text) {
        if (this.state.projectId !== 0) { //If the project is not new...
            this.setState({ newName: text });
            this.saveProject({ name: text });            
        } 
    }

    onChangeDateStart(date) {
        if (this.state.projectId !== 0) { //If the project is not new...        
            this.setState({ newStartDate: Helper.getDateISOfromDate(date) });
            this.saveProject({ startDate: Helper.getDateISOfromDate(date) });
        } else {
            this.setState({ startDate: Helper.getDateISOfromDate(date) });
        }
    }

    onChangeDueDate(date) {
        if (this.state.projectId !== 0) { //If the project is not new...        
            this.setState({ newDueDate: Helper.getDateISOfromDate(date) });
            this.saveProject({ dueDate: Helper.getDateISOfromDate(date) });
        } else {
            this.setState({ dueDate: Helper.getDateISOfromDate(date) });
        }
    }

    onPress2Delete(name, id) {
        if (this.state.projectId !== 0) { //If the project is not new...        
            Alert.alert(
                'Remove member',
                `Are you sure you want to remove ${name}`,
                [
                    { text: 'Yes', onPress: () => this.removeMember(id) },
                    { text: 'No', onPress: () => console.log('no') }
                ]
            );
        }
    }

    onMemberSelected(text, value) {
        const params = { 
            projectId: this.state.projectId,
            personId: value,
            roleId: 3
        };
        Database.request2('POST', 'projectMember', params, 1, (err, response) => {
            if (err) { 
                Alert.alert('Error', response.message);
            } else {
                this.setState({ 
                    members: [...this.state.members, response[0]], 
                    isMemberEditorVisible: false 
                });
                this.updateParent();
            }
        });
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

    onSuccess(responseData) {
        if (responseData.status > 299) {
            console.log('error');
        } else {
            this.setState({ 
                name: (this.state.newName) ? this.state.newName : this.state.name, 
                isNameEditorVisible: false,
                newName: undefined,                
                startDate: (this.state.newStartDate) ? 
                            this.state.newStartDate : 
                            this.state.startDate,
                newStartDate: undefined,
                dueDate: (this.state.newDueDate) ? this.state.newDueDate : this.state.dueDate,
                newDueDate: undefined
            });

            this.startDate.updating = false;
            this.dueDate.updating = false;
            this.updateParent();
        }
    }    

    onSuccessNewProject(responseData) {
        if (responseData.status > 299) {
            console.log('error');
        } else {
            Actions.pop({ refresh: { newProject: responseData[0] } });
        }
    }   

    saveProject(data) {
        Database.request(
            'PUT',
            `project/${this.state.projectId}`, 
            data,
            1,
            this.onResponse.bind(this),
            this.onSuccess.bind(this),
            this.onError.bind(this)
        );
    }    

    saveNewProject() {
        Database.request(
            'POST',
            'project',
            {
                name: this.state.name,
                startDate: this.state.startDate,
                dueDate: this.state.dueDate,
                creatorId: session[0].personId
            },
            1,
            this.onResponse.bind(this),
            this.onSuccessNewProject.bind(this),
            this.onError.bind(this)            
        );
    }

    removeMember(personId) {
        this.setState({ member2Del: personId });
        Database.request2('DELETE', 'projectMember', { projectId: this.state.projectId, personId }, 2, 
            (err, response) => {
                if (err) {
                    Alert.alert('Error', response.message);
                } else {
                    // Get new array without the removed element
                    const result = this.state.members.filter(
                        (person) => person.personId !== this.state.member2Del
                    );        

                    if (this.state.status > 299) {
                        console.log('error');
                    } else {
                        this.setState({ members: result, isMemberEditorVisible: false });
                    }                     
                    
                    this.updateParent();
                }
            });           
    }

    updateParent() {
        const newState = {
                name: this.state.name, 
                startDate: this.state.startDate,
                dueDate: this.state.dueDate,
                members: this.state.members,
                projectId: this.state.projectId
        };
        
        return newState;
    }    

    render() {
        const { projectId, name, startDate, dueDate } = this.state;
        return (
            <Form 
                title={name}
                leftIcon='back'
                onPressLeft={() => Actions.pop({ refresh: { updated: this.updateParent() } })}
                rightIcon={(projectId !== 0) ? '' : 'ok'}
                onPressRight={() => this.saveNewProject()}
            >
                <ScrollView>
                {/* Name editor */}
                    <ListItem2 
                        title='NAME:' 
                        editable={(projectId !== 0) ? true : false}
                        onPress={() => this.setState({ isNameEditorVisible: true })}
                    >
                        {(projectId !== 0) ?
                            <Label style={{ color: colors.darkGray }} >{name}</Label> :
                            <Input 
                                ref={(_inptProjectName) => { this.inpt_projectName = _inptProjectName; }}
                                value={name} 
                                placeholder='Project name'
                                style={{ fontSize: 14, lineHeight: 16, height: 16, color: colors.mainDark }}
                                onChangeText={(value) => this.setState({ name: value })}
                            />
                        }
                        
                    </ListItem2>
                    <Modal
                        animationType='slide'
                        onRequestClose={() => console.log('closing')}
                        visible={this.state.isNameEditorVisible}
                    >
                        <EditTextForm 
                            title='Name of task'
                            text={name}
                            onClose={() => this.setState({ isNameEditorVisible: false })}
                            onSave={this.onSaveName.bind(this)}
                        />
                    </Modal>   
                {/* Start Date */}                       
                    <ListItem2 title='START DATE:'>
                        <DateDue 
                            ref={(date) => { this.startDate = date; }}
                            date={Helper.toDate(startDate)} 
                            onChangeDate={this.onChangeDateStart.bind(this)}
                            title='Start Date'
                        />
                    </ListItem2>        
                {/* Due Date */}                       
                    <ListItem2 title='DUE DATE:'>
                        <DateDue 
                            ref={(date) => { this.dueDate = date; }}
                            date={Helper.toDate(dueDate)} 
                            onChangeDate={this.onChangeDueDate.bind(this)}
                            title='Due Date'
                        />
                    </ListItem2>   
                {/* Members */}    
                    <ListItem2 
                        title='MEMBERS:' 
                        editable
                        onPress={() => this.setState({ isMemberEditorVisible: true })}
                    >
                        <FlatListe 
                            keyEx='personId'
                            data={this.state.members}
                            itemType='avatar'
                            horizontal
                            onPress={this.onPress2Delete.bind(this)}
                        />
                    </ListItem2>
                    <Modal
                        animationType='slide'
                        onRequestClose={() => console.log('closing')}
                        visible={this.state.isMemberEditorVisible}                
                    >
                        <SelectPersonForm 
                            title='Select a Member' 
                            onSelection={this.onMemberSelected.bind(this)}
                            onClose={() => this.setState({ isMemberEditorVisible: false })}
                        />
                    </Modal>                                                            
                </ScrollView>
            </Form>
        );
    }
}

export { EditProjectForm };
