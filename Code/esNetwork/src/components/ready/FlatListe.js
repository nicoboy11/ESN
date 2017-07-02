import React, { Component } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { CheckListItem, ListItem, PersonListItem } from '../';
import { Config } from '../../settings';

const { colors } = Config;

/**
 *  Props:
 *      separator - boolean - Should a separator be rendered? 
 *      key - value - a unique id for each cell (will be extracted from the data)
 *      data - the datasource (an array of objects)
 *      onPress - function for when button is pressed
 *      itemType - checkList
 * 
 * ---CheckListItem
 *      chkListProcessing 
 *      onPress
 */
class FlatListe extends Component {

    renderSeparator() {
        if (this.props.separator) {
            return (
                <View 
                    style={{
                        height: StyleSheet.hairlineWidth,
                        backgroundColor: colors.mainDark
                    }}
                />
            );     
        }

        return <View />;
    }

    renderItem({ item }) {
        switch (this.props.itemType) {
            case 'checkList':
                return (
                    <CheckListItem 
                        processing={this.props.chkListProcessing} 
                        item={item.item} 
                        isChecked={item.isChecked} 
                        onPress={this.props.onPress} 
                        waitUpdate={this.props.waitUpdate}
                        data={item}
                    />
                );
            case 'people':
                return (
                    <PersonListItem 
                        avatar={{
                                avatar: item.avatar,
                                color: item.theme,
                                size: 'big'
                        }}
                        title={item.person}
                        subtitle={item.higherPerson}
                        icon={item.icon}
                        id={item.personId}
                        onSelection={(text, value) => this.props.onPress(text, value)}
                    />
                );
            default:
                return (
                    <ListItem 
                        onPress={(text, value) => this.props.onPress(text, value)} 
                        text={item.text} 
                        value={item.value}
                        isSelected={(item.value === this.props.selectedItem)} 
                    />
                );
        }
    }

    render() {
        const { keyEx, data } = this.props;

        return (
            <FlatList 
                keyExtractor={item => item[keyEx]}
                data={data}
                ItemSeparatorComponent={this.renderSeparator.bind(this)}                         
                renderItem={this.renderItem.bind(this)}
            />
        );
    }
}

export { FlatListe };
