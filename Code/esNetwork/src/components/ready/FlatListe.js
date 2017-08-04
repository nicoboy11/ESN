import React, { Component } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckListItem, ListItem, PersonListItem, Avatar, TaskCard3 } from '../';
import { Config } from '../../settings';

const { colors } = Config;

/**
 *  Props:
 *      separator - boolean - Should a separator be rendered? 
 *      key - value - a unique id for each cell (will be extracted from the data)
 *      data - the datasource (an array of objects) (mandatory)
 *      onPress - function for when item is pressed
 *      itemType - checkList, people, avatar 
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
                        processing={item.processing} 
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
                                size: 'medium'
                        }}
                        title={item.person}
                        subtitle={item.levelKey}
                        icon={this.props.icon}
                        onIconPress={(rawData) => this.props.onIconPress(rawData)}
                        id={item.personId}
                        isParent={item.isParent}
                        chevron={this.props.chevron}
                        isOpen={item.isOpen}
                        rawData={item}
                        onPress={(text, value, data) => this.props.onPress(text, value, data)}
                    />
                );
            case 'avatar':
                return (
                    <View
                        style={
                            (this.props.stacked) ?
                                { width: 14 } :
                                { marginRight: 5 }
                        }
                    >
                        <TouchableOpacity
                            onPress={() => {
                                if (this.props.onPress) {
                                    this.props.onPress(item.person, item.personId);
                                }
                            }}
                        >  
                            <Avatar 
                                avatar={item.avatar}
                                color={item.theme}
                                size={(this.props.size) ? this.props.size : 'medium'}
                            />
                        </TouchableOpacity>
                    </View>
                );
            case 'task':
                return (
                     <TaskCard3 
                        title={item.name}
                        subtitle={item.projectName}
                        date={item.dueDate}
                        id={item.taskId}
                        onPress={(props) => { this.props.onPress(props); }}
                        data={item}
                        updateFromChildren={(update) => this.props.updateFromChildren(update)}
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
        const { keyEx, data, style, horizontal, initialNumToRender } = this.props;

        return (
            <FlatList 
                keyExtractor={item => item[keyEx]}
                data={data}
                ItemSeparatorComponent={this.renderSeparator.bind(this)}                         
                renderItem={this.renderItem.bind(this)}
                style={style}
                horizontal={horizontal}
                initialNumToRender={initialNumToRender}
            />
        );
    }
}

export { FlatListe };
