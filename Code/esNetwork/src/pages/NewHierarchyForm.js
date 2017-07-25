import React, { Component } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Form, Avatar } from '../components';
import { Config, Database } from '../settings';

const { colors } = Config;
const session = Database.realm('Session', { }, 'select', '');

class NewHierarchyForm extends Component {
    componentWillMount() {

        const data = Database.realm('Person', {}, 'select', `higherPersonId=0 AND personId!=${session[0].personId}`);
        const people = Database.realmToObject(data, 'Person');
        this.setState({
            people
        });
    }

    addManager(personId) {
        const manager = Database.realm('Person', { }, 'select', `personId=${personId}`);

        Database.realm(
            'Person', 
            { 
                higherPersonId: manager[0].personId,
                higherPerson: manager[0].person,
                parentLevelKey: manager[0].levelKey,
                levelKey: manager[0].levelKey + '-' + ('0000' + session[0].personId.toString()).slice(-4),
                isSync: false
            }, 
            'edit', 
            `personId=${session[0].personId}`
        );

        Actions.pop({ refresh: { edited: true } });
    }

    addSubordinate(personId) {
        const manager = Database.realm('Person', { }, 'select', `personId=${session[0].personId}`);
        const subordinate = Database.realm('Person', { }, 'select', `personId=${personId}`);

        Database.realm(
            'Person', 
            { 
                higherPersonId: manager[0].personId,
                higherPerson: manager[0].person,
                parentLevelKey: manager[0].levelKey,
                levelKey: manager[0].levelKey + '-' + ('0000' + subordinate[0].personId.toString()).slice(-4),
                isSync: false
            }, 
            'edit', 
            `personId=${subordinate[0].personId}`
        );

        Actions.pop({ refresh: { edited: true } });
    }

    selectPerson(item) {
            Alert.alert(
                `Mark ${item.person} as:`,
                '',
                [
                    { text: 'My manager', onPress: () => this.addManager(item.personId) },
                    { text: 'My subordinate', onPress: () => this.addSubordinate(item.personId) },
                    { text: 'Cancel', onPress: () => console.log('cancel'), style: 'cancel' }                    
                ]
            );
    }

    renderItem({ item }) {
        return (
            <TouchableOpacity
                onPress={() => this.selectPerson(item)}
            >
                <View style={{ flex: 1, margin: 5 }}>
                    <Avatar 
                        avatar={item.avatar}
                        color={item.theme}
                        name={item.person}
                        size='big'
                        flexDirection='column'
                        textStyle={{ fontSize: 12 }}
                    />
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const { mainContainer } = styles;
        return (
            <Form
                title='Users without a network'
                leftIcon='back'
                onPressLeft={() => Actions.pop()}
            >
                <View style={mainContainer}>
                    <FlatList 
                        keyExtractor={item => item.personId}
                        data={this.state.people}                    
                        renderItem={this.renderItem.bind(this)}
                        horizontal={false}
                        numColumns={3}  
                        style={{ flex: 1 }}              
                    />
                </View>            
            </Form>
        );
    }
}

const styles = new StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'stretch'
    }
});

export { NewHierarchyForm };
