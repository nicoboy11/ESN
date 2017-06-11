import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { CardList } from '../components';

export default class MainForm extends Component {

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
