import React, { Component } from 'react';
import { View, Text, Alert, ActivityIndicator, Modal } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Form, FlatListe } from '../components';
import { EditHierarchyForm } from './';
import { Config, Database, Helper } from '../settings';
const { colors } = Config;
const session = Database.realm('Session', { }, 'select', '');
let people = Database.realm('Person', { }, 'select', '').sorted('levelKey');
let peopleNotSync = Database.realm('Person', { }, 'select', 'isSync=false');

class HierarchyForm extends Component {
    state ={ network: [], visibleNetwork: [], isLoading: true, isEditPersonOpen: false }
    componentWillMount() {
        if (session[0] === undefined) {
            Database.realm('Session', { }, 'delete', '');
            Actions.authentication();
        } else {
            if (people[0] === undefined) {
                Database.realm('Person', { }, 'delete', '');
                this.remoteRequest();
            } else if (peopleNotSync.length > 0) {
                this.commitChanges();             
            } else {
                this.setState({ network: Database.realmToObject(people, 'Person') });
                this.loadPeople(people);
            }            
        }     
    }

    onResponse(response) {
        console.log(response.status);
        this.setState({ status: response.status });
        return response.json();        
    }

    onSuccessNetwork(data) {
        if (this.state.status > 299) {
            console.log(`error ${this.state.status}`);
        } else {
             let people = [];

             for (let row of data) {
                people.push({
                    personId: row.personId,
                    names: row.names,
                    firstLastName: row.firstLastName,
                    secondLastName: row.secondLastName,
                    person: row.person,
                    dateOfBirth: Helper.toDate(row.dateOfBirth),
                    email: row.email,
                    mobile: row.mobile,
                    genderId: row.genderId,
                    gender: row.gender,                    
                    phone: row.phone,
                    ext: row.ext,
                    startDate: Helper.toDate(row.startDate),
                    endDate: Helper.toDate(row.endDate),
                    higherPersonId: row.higherPersonId,
                    higherPerson: row.higherPerson,
                    parentLevelKey: row.parentLevelKey,
                    lastLogin: Helper.toDate(row.lastLogin),
                    avatar: row.avatar,
                    description: row.description,
                    job: row.job,
                    roleId: row.roleId,
                    abbr: row.abbr,  
                    levelKey: row.levelKey,
                    theme: row.theme,
                    isParent: (row.isParent === 1),
                    isSync: true
                });         
             }
            
            Database.realm('Person', people, 'create', '');
            this.setState({ network: people });
            this.loadPeople(people);
        }
    }

    onError(error) {
        Alert.alert('Error', error.message);
        this.setState({ isLoading: false });
    }   

    onEditedHierarchy(edited) {
        if (edited) {
            people = Database.realm('Person', { }, 'select', '').sorted('levelKey');
            this.setState({ network: Database.realmToObject(people, 'Person') });
            this.loadPeople(people);
            this.commitChanges();
        }
        
        this.setState({ isEditPersonOpen: false });
    }

    onPress(text, value, selectedItem) {
        let visibleData = [];
        //Get level of current session user
        const sessionLevel = session[0].levelKey.split('-').length - 1;        

        //Loop through all people in the network
        for (let i = 0; i < this.state.network.length; i++) {
            //Get level from item in the loop
            const personLevel = this.state.network[i].levelKey.split('-').length - 1;

            //If the person is the one pressed on, Mark as open/closed
            if (this.state.network[i].personId === value) {
                this.state.network[i].isOpen = !this.state.network[i].isOpen;
            }
            //Add the sessions immediate employees
            if (((personLevel - sessionLevel) === 1) && this.state.network[i].levelKey.includes(session[0].levelKey)) {
                visibleData.push(this.state.network[i]);
            }            
            //Get items to display (children of pressed item)
            const isVisible = visibleData.filter((item) => {
                return item.isOpen === true && item.levelKey === this.state.network[i].parentLevelKey;
            });
            //Display items obtained in the previous line
            if (isVisible.length > 0) {
                visibleData.push(this.state.network[i]);                
            }
        }

        this.setState({ visibleNetwork: visibleData });
    }

    onIconPress(rawData) {
        this.setState({ isEditPersonOpen: true, selectedPerson: rawData });
    }

    remoteRequest() {
        Database.request(
            'GET', 
            `network/${session[0].personId}`, 
            {}, 
            2,
            this.onResponse.bind(this), 
            this.onSuccessNetwork.bind(this),
            this.onError.bind(this)
        );               
    }

    commitChanges() {
        Database.sync('person', peopleNotSync, (success, response) => {
            if (success) {
                Database.realm('Person', { }, 'delete', '');
                this.remoteRequest();
            } else {
                Alert.alert('Unable to sync', response.message);
                this.setState({ network: Database.realmToObject(people, 'Person') });
                this.loadPeople(people);                        
            }
        });            
    }

    loadPeople(data) {
        //Initially only show immediate employees
        const sessionLevel = session[0].levelKey.split('-').length - 1;
        //let visibleData = JSON.parse(JSON.stringify(data));
        let visibleData = Database.realmToObject(data, 'Person');

        visibleData = visibleData.filter((item) => {
            const personLevel = item.levelKey.split('-').length - 1;
            return (personLevel - sessionLevel) === 1 && item.levelKey.includes(session[0].levelKey);
        });

        this.setState({
            visibleNetwork: visibleData,
            isLoading: false
        });
    }

    renderList() {
        if (this.state.isLoading) {
            return <ActivityIndicator size='large' />;
        }

        return (
            <View>
                <FlatListe 
                    keyEx='personId'
                    itemType='people'
                    data={this.state.visibleNetwork}
                    onPress={this.onPress.bind(this)}
                    onIconPress={this.onIconPress.bind(this)}
                    icon='edit'
                    separator
                    chevron
                />
                <Modal
                    animationType='slide'
                    onRequestClose={() => console.log('closing')}
                    visible={this.state.isEditPersonOpen}                
                >
                    <EditHierarchyForm 
                        onClose={this.onEditedHierarchy.bind(this)}
                        data={this.state.selectedPerson}
                    />
                </Modal>                  
            </View>             
        );
    }   

    render() {
        return (
            <Form
                title='Manage people'
                rightIcon='plus'
            >
                {this.renderList()}
            </Form>
        );
    }
}

export { HierarchyForm };
