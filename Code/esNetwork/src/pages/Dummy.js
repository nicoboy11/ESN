import React, { Component } from 'react';
import { View, Text, FlatList,StyleSheet } from 'react-native';
import { CheckListItem, FlatListe } from '../components';
import { Config } from '../settings';

const { colors } = Config;

class Dummy extends Component {
    state = { chkListProcessing: false }

    onPress() {
        this.setState({ chkListProcessing: false });
    }
        
    render() {
        return (
            <FlatListe
                itemType='checkList'
                separator
                keyEx='checkListId'
                waitUpdate
                data={[{ checkListId: 1, item: 'check item 1', isChecked: true },
                       { checkListId: 2, item: 'check item 2 largo para ver como se  muchas palabras muchas desemeña la lista ya con todo esto', isChecked: false }]}                
            />
        );
    }
}

export { Dummy };
