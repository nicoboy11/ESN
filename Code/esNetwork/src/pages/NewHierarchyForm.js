import React, { Component } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Form, Avatar } from '../components';
import { Config, Database } from '../settings';

const { colors, texts } = Config;
let session = {};
let meData = {};

class NewHierarchyForm extends Component {
    componentWillMount() {
        session = Database.realm('Session', { }, 'select', '');
        meData = Database.realm('Person', {}, 'select', `personId=${session[0].personId}`);        
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
                `${texts.mark} ${item.person} ${texts.as}`,
                '',
                [
                    //{ text: texts.myManager, onPress: () => this.addManager(item.personId) },
                    { text: texts.mySubordinate, onPress: () => this.addSubordinate(item.personId) },
                    { text: texts.cancel, onPress: () => console.log('cancel'), style: 'cancel' }                    
                ]
            );
    }

    renderItem({ item }) {
        let extraInfo = '';
        if (item.personId === meData[0].higherPersonId) {
            extraInfo = ' (Manager)';
        }

        if (item.higherPersonId === meData[0].personId) {
            extraInfo = ' (Subordinate)';
        }

        return (
            <TouchableOpacity
                onPress={() => this.selectPerson(item)}
            >
                <View style={{ flex: 1, margin: 5 }}>
                    <Avatar 
                        avatar={item.avatar}
                        color={item.theme}
                        name={`${item.person}\n${extraInfo}`}
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
                title={texts.newUserTitle}
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
