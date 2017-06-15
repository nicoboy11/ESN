import React, { Component } from 'react';
import { ScrollView, Alert, ActivityIndicator, TouchableOpacity, Image, View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { CardList, Menu, Header } from '../components';
import { Database, Config } from '../settings';

export default class MainForm extends Component {

    state = { elements: [], isLoading: false, showMenu: false, offset: 0 };

    componentWillMount() {
        this.setState({ isLoading: true });
        //get current log in
        const data = Database.realm('Session', { }, 'select', '');
        const personId = data[0].personId;

        /** Get elements from API */
        Database.request(
            'GET', 
            `feed/${personId}/1`, 
            {}, 
            this.handleResponse.bind(this), 
            this.onSuccess.bind(this),
            this.onError.bind(this)
        );
    }

    onError(error) {
        Alert.alert('Error', error.message);
        this.refresh();
    }
    
    onSuccess(responseData) {
        this.setState({ elements: responseData, isLoading: false });
    }

    onLeft() {
        const showMenu = this.state.showMenu;
        this.setState({ showMenu: !showMenu });
    }

    closeMenu() {
        this.setState({ showMenu: false });
    }

    showMenu() {
        if (this.state.showMenu) {
            return <Menu closeMenu={this.closeMenu.bind(this)} />;
        }

        return;
    }

    handleResponse(response) {
        console.log(response.status);
        this.setState({ status: response.status });
        return response.json();
    }   

    refresh() {
        this.setState({ elements: [], isLoading: false });
    }   

    renderList() {
        if (this.state.isLoading) {
            return <ActivityIndicator size='large' />;
        }

        return (
            <CardList 
                elements={this.state.elements}
            />
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header 
                    onPress={this.onLeft.bind(this)}
                    rightIcon='search'
                    leftIcon='menu'
                    title='Feed'
                />
                <ScrollView style={{ backgroundColor: '#EFEFEF' }}>
                    {this.renderList()}    
                </ScrollView>
                {this.showMenu()}                
            </View>

        );
    }
}
