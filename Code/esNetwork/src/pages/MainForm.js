import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { PostCard, CardList } from '../components';

export default class MainForm extends Component {

    render() {
        return (
            <ScrollView style={{ paddingTop: 60 }}>
                <CardList 
                    elements={
                        { 1: 1, 
                          2: 2, 
                          3: 3, 
                          4: 4,
                          5: 5,
                          6: 6,
                          7: 7,
                          8: 8,
                          9: 9,
                          10: 1, 
                          12: 2, 
                          13: 3, 
                          14: 4,
                          15: 5,
                          16: 6,
                          17: 7,
                          18: 8,
                          21: 1, 
                          22: 2, 
                          23: 3, 
                          24: 4,
                          25: 5,
                          26: 6,
                          27: 7,
                          28: 8,
                          29: 9,
                          210: 1, 
                          212: 2, 
                          213: 3, 
                          214: 4,
                          215: 5,
                          216: 6,
                          217: 7,
                          218: 8
                        }
                    } 
                />      
            </ScrollView>
        );
    }
}
