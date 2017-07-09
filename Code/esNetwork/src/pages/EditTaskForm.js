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
    FlatListe
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
        this.setState({ leader: JSON.parse(this.state.leader)[0] });
        this.setState({ collaborators: JSON.parse(this.state.collaborators) });
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
        this.setState({ newStartDate: date });
        this.saveTask({ startDate: date });  
    }

    onChangeDateDue(date) {
        this.setState({ newDueDate: date });
        this.saveTask({ dueDate: date });        
    }

    onPrioritySelection(priorityId) {
        this.state({ priorityId });
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
        this.setState({ project: { text, value }, isProjectModalVisible: false });
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
                        <Text style={{ color: colors.darkGray, fontFamily: 'Roboto' }} >{this.state.name}</Text>
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
                        <Text style={{ color: colors.darkGray, fontFamily: 'Roboto' }} >{this.state.description}</Text>
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
                            date={this.state.startDate} 
                            selectedDate={this.onChangeDateStart.bind(this)}
                        />
                    </ListItem2>    
                {/* Due Date */}
                    <ListItem2 title='DUE DATE:'>
                        <DateDue 
                            ref={(dueDate) => { this.dueDate = dueDate; }}
                            date={this.state.dueDate} 
                            selectedDate={this.onChangeDateDue.bind(this)}
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
                            <Text fontFamily='Roboto'>{this.state.progress}%</Text>
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
                        />
                        <ESModal 
                            title={texts.projectSelect} 
                            visible={this.state.isProjectModalVisible} 
                            onSelection={this.projectSelected.bind(this)}
                            elements={[]}
                            table='projects'
                        />                        
                    </View>    
                    }
                </ListItem2>                                                                                                
                {/*<View 
                    style={[
                                rowStyle, 
                                { 
                                    borderBottomWidth: 2, 
                                    borderBottomColor: colors.lightText,
                                    marginLeft: 10,
                                    marginRight: 10
                                }
                        ]}
                >
                    <Text style={{ fontSize: 20, paddingLeft: 10 }}>PEOPLE</Text>
                </View>
                <View style={rowStyle}>
                    <View 
                        style={{ 
                                flex: 1, 
                                flexDirection: 'row', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginLeft: 10,
                                marginRight: 10
                            }} 
                    >
                        <View style={{ flex: 1 }} >
                            <Text style={{ fontSize: 18 }}>Leader</Text>
                        </View>
                        <View style={{ flex: 1 }} >
                            <SplitButton 
                                elements={[
                                        { text: 'My network', id: false, isSelected: true },
                                        { text: 'Company', id: true }
                                ]}
                            />   
                        </View>                     
                    </View>
                    <PersonSelect2 
                        placeholder='Type a leader' 
                        showAll={this.state.showAll}
                        style={{ marginLeft: 5, marginRight: 5 }}
                    />
                </View>
                <View style={rowStyle}>
                    <View 
                        style={{ 
                                flex: 1, 
                                flexDirection: 'row', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginLeft: 10,
                                marginRight: 10
                            }} 
                    >
                        <View style={{ flex: 1 }} >
                            <Text style={{ fontSize: 18 }}>Collaborators</Text>
                        </View>
                        <View style={{ flex: 1 }} >
                            <SplitButton 
                                elements={[
                                        { text: 'My network', id: false, isSelected: true },
                                        { text: 'Company', id: true }
                                ]}
                            />   
                        </View>                     
                    </View>                
                    <PersonSelect2 
                        placeholder='Type a colaborator' 
                        showAll={this.state.showAll}
                        style={{ marginLeft: 5, marginRight: 5 }}
                    />                        
                </View>
                <View 
                    style={[
                                rowStyle, 
                                { 
                                    borderBottomWidth: 2, 
                                    borderBottomColor: colors.lightText,
                                    marginLeft: 10,
                                    marginRight: 10
                                }
                        ]}
                >
                    <Text style={{ fontSize: 20, paddingLeft: 10 }}>GENERAL INFO</Text>
                </View>               
                <View style={rowStyle}>
                    <Input 
                        label={texts.taskName} 
                        returnKeyType='next' 
                        onChangeText={(name) => this.setState({ name })}
                        value={this.state.name}
                        editable
                    />
                </View>
                <View style={rowStyle}>
                    <Input 
                        label={texts.taskDesc} 
                        returnKeyType='next' 
                        height={this.state.descHeight}
                        onChangeText={(description) => {
                            this.setState({ description });
                        }}
                        onContentSizeChange={(event) => this.setState({ descHeight: event.nativeEvent.contentSize.height })}
                        value={this.state.description}
                        editable
                        multiline
                    />     
                </View>
                <View style={rowStyle}>
                    <DatePicker 
                        label={texts.taskStart} 
                        onChangeDate={this.onChangeDateStart.bind(this)}
                        date={Helper.toDate(this.state.startDate)}
                        editable
                    />
                </View>
                <View style={rowStyle}>
                    <DatePicker 
                        label={texts.taskDue} 
                        onChangeDate={this.onChangeDateDue.bind(this)}
                        date={Helper.toDate(this.state.dueDate)}
                        editable
                    />
                </View>
                <View style={rowStyle}>
                    <TouchableOpacity
                        onPress={() => this.setState({ isTeamModalVisible: true })}
                    >
                        <Text>{this.state.project.text}</Text>
                    </TouchableOpacity>
                    <ESModal 
                        title={texts.projectSelect} 
                        visible={this.state.isTeamModalVisible} 
                        onSelection={(this.projectSelected.bind(this))}
                        selectedItem={this.props.taskData.projectId}
                        table='projects'
                    />   
                </View>
                <View style={rowStyle}>
                    <Text>Progress</Text>
                    <Slider minimumValue={0} maximumValue={100} />
                </View>
                <View style={rowStyle}>
                    <Text>Priority</Text>
                    <SplitButton 
                        elements={
                            [
                                { text: 'None', id: 1 },
                                { text: 'Low', id: 2 },
                                { text: 'Medium', id: 3 },
                                { text: 'High', id: 4, isSelected: true },
                                { text: 'Urgent', id: 5 },
                            ]
                        }
                    />
                </View>
                <View style={rowStyle}>
                    <Text>State</Text>
                    <SplitButton 
                        elements={
                            [
                                { text: 'Active', id: 1 },
                                { text: 'Ready', id: 2 },
                                { text: 'Completed', id: 3 }
                            ]
                        }
                    />
                </View>*/}
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
