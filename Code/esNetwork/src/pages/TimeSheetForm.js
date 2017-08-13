import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Form, Button, FlatListe } from '../components';
import { Config, Database, Helper } from '../settings';

const { texts } = Config;
let session = {};

class TimeSheetForm extends Component {
    state = { pageLoading: false, loading: 0, message: '' }

    componentWillMount() {
        session = Database.realm('Session', { }, 'select', '');
        this.setState({ pageLoading: true });
        Database.request2('GET', `locationCheck/${session[0].personId}`, {}, 2, (err, response) => {
            if (err) {
                Alert.alert('Error', response.message);
                this.setState({ pageLoading: false });
            } else {
                this.setState({ elements: response, pageLoading: false });
            }
        });
    }

    onCheckPress() {
        this.setState({ loading: 1 });
        const data = {
            personId: session[0].personId,
            checkDate: Helper.getDateISOfromDate(new Date()),
            isCheckIn: 1,
            company: 1,
            office: 1
        };

        Database.request2('POST', 'locationCheck', data, 1, (err, response) => {
            if (err) {
                Alert.alert('Error', response.message);
                this.setState({ loading: 0 });
            } else {
                this.setState({ elements: [response[0], ...this.state.elements], loading: 0 });
            }
        });        
    }    

    renderList() {
        if (this.state.pageLoading) {
            return <ActivityIndicator size='large' />;
        }

        let list = [];
        let count = 1;
        for (let row of this.state.elements) {
            list.push({ id: count, text: Helper.prettyfyDate(row.checkDate).datetime });
            count++;
        }

        return (
            <FlatListe 
                keyEx='id'
                data={list}
                initialNumToRender={5}
                onPress={(props) => { console.log(''); }}
            />                       
        );           
    }

    render() {
        return (
            <Form
                title={texts.timesheet}
                leftIcon='menu'
                menuList={
                    [
                        { name: 'Profile', form: 'profile', id: this.state.personId },
                        { name: 'Logout', form: 'authentication', id: 0 }

                    ]
                }                
            >
                <ScrollView>
                    <Button 
                        title={texts.addCheck} 
                        animating={this.state.loading}
                        message={this.state.message}
                        onPress={this.onCheckPress.bind(this)} 
                    />             
                    {this.renderList()}
                </ScrollView>                      
            </Form>
        );
    }
}

export { TimeSheetForm };
