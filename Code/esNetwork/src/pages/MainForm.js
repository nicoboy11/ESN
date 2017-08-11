import React, { Component } from 'react';
import { ScrollView, Alert, ActivityIndicator, TouchableOpacity, Image, View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { CardList, Menu, Header, Form, NewCard } from '../components';
import { Database, Config } from '../settings';

const { texts, colors } = Config;
const session = Database.realm('Session', { }, 'select', '');

class MainForm extends Component {

    state = { elements: [], isLoading: false, showMenu: false, offset: 0, personId: 0, isCheckedIn: false };

    componentWillMount() {
        this.setState({ isLoading: true });
        //get current log in
        const personId = session[0].personId;
        this.setState({ personId });
        /** Get elements from API */
        Database.request(
            'GET', 
            `feed/${personId}/1`, 
            {}, 
            2,
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
        if (this.state.status > 299) {
            Database.realm('Session', { }, 'delete', '');
            Actions.authentication();
        } else {
            this.setState({ elements: responseData, isLoading: false });
        }
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

    createPost() {
        const data = {
                personId: session[0].personId,
                message: this.state.newPostText,
                messageTypeId: 1,
                fileName: this.state.file,
                attachmentTypeId: this.state.attachmentTypeId,
                scopeTypeId: 1            
        };

        Database.request2('POST', 'post', data, 1, (err, response) => {
            if (err) {
                Alert.alert('Error', response.message);
            } else {
                this.setState({ elements: [response[0], ...this.state.elements] });
            }
        });
    }    

    renderList() {
        if (this.state.isLoading) {
            return <ActivityIndicator size='large' />;
        }

        return (
            <CardList 
                type='Post'
                elements={this.state.elements}
            />
        );
    }

    render() {
        return (
            <Form
                rightIcon='menu'
                title={texts.feed}
                menuList={
                    [
                        { name: 'Profile', form: 'profile', id: this.state.personId },
                        { name: 'Logout', form: 'authentication', id: 0 }

                    ]
                }
            >
                <ScrollView style={{ backgroundColor: colors.background }}>
                    <NewCard
                        value={this.state.newPostText}
                        onChangeText={(newPostText) => this.setState({ newPostText })}
                        onSubmitEditing={this.createPost.bind(this)}
                        placeholder='Type a new post'
                        attachment
                    />                      
                    {this.renderList()}    
                </ScrollView>                
            </Form>            
        );
    }
}

export { MainForm };
