import React, { Component } from 'react';
import { ScrollView, View, Modal, Alert } from 'react-native';
import { ListItem2, Avatar, Form } from '../components';
import { SelectPersonForm } from '../pages';
import { Database } from '../settings';

class EditHierarchyForm extends Component {
    state = { employer: {}, isEmployerEditorVisible: false }
    componentWillMount() {
        this.getEmployer(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.getEmployer(nextProps);
    }

    onPressLeft(data) {
        this.props.onClose();
    }

    onEmployerSelected(text, value) {
        const newEmployer = Database.realm('Person', { }, 'select', `personId=${value}`);

        Database.realm(
            'Person', 
            { 
                higherPersonId: newEmployer[0].personId,
                higherPerson: newEmployer[0].person,
                parentLevelKey: newEmployer[0].levelKey,
                levelKey: newEmployer[0].levelKey + '-' + ('0000' + this.props.data.personId.toString()).slice(-4),
                isSync: false
            }, 
            'edit', 
            `personId=${this.props.data.personId}`
        );

        this.props.onClose(true);
    }

    getEmployer({ data }) {     
        const employerRealm = Database.realm('Person', { }, 'select', `personId=${data.higherPersonId}`);
        let employer = {};
        employer = Database.realmToObject(employerRealm, 'Person')[0];
        this.setState({ employer });
    }

    renderEmployer() {
        if (this.state.employer !== undefined) {
            return (
                <Avatar 
                    avatar={this.state.employer.avatar}
                    color={this.state.employer.theme}
                    name={this.state.employer.person}
                    size='medium'
                />
            );
        } 

        return <View />;
    }

    render() {
        return (
            <Form
                leftIcon='back'
                onPressLeft={this.onPressLeft.bind(this)}
                title={`Edit ${this.props.data.person}`}
            >
                <ScrollView>
                    <ListItem2 
                        title='EMPLOYER:' 
                        editable
                        onPress={() => this.setState({ isEmployerEditorVisible: true })}
                    >
                        {this.renderEmployer()}                
                    </ListItem2>
                    <Modal
                        animationType='slide'
                        onRequestClose={() => console.log('closing')}
                        visible={this.state.isEmployerEditorVisible}                
                    >
                        <SelectPersonForm 
                            title='Select a employer' 
                            onSelection={this.onEmployerSelected.bind(this)}
                            onClose={() => this.setState({ isEmployerEditorVisible: false })}
                        />
                    </Modal>                    
                </ScrollView>
            </Form>
        );
    }
}

export { EditHierarchyForm };
