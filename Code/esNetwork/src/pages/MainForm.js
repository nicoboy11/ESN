import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { CardList } from '../components';
import { Database } from '../settings';

export default class MainForm extends Component {

    state = { category: '' };

    onComponentWillMount() {
        let data = Database.realm('Session', { }, 'select', '');
        /** loop and draw elements */
    }

    render() {
        return (
            <ScrollView style={{ paddingTop: 60, backgroundColor: '#EFEFEF' }}>
                <CardList 
                    elements={[{ category: 'Task' }, 
                               { category: 'Post' },
                               { category: 'Task' },
                               { category: 'Task' },
                               { category: 'Task' },
                               { category: 'Post' }]}
                />      
            </ScrollView>
        );
    }
}
