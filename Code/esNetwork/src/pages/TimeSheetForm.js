import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Form, Button } from '../components';
import { Config, Database } from '../settings';

const { texts } = Config;
const session = Database.realm('Session', { }, 'select', '');

class TimeSheetForm extends Component {
    state = { pageLoading: false, loading: false, message: '' }

    componentWillMount() {
        this.setState({ pageLoading: true });
        Database.request2('GET',`getLocationCheck/${session[0].personId}`,{},2, (err, response) => {
            if(err) {
                Alert.alert('Error', response.message);
                this.setState({ pageLoading: false });
            } else {
                this.setState({ elements: response, pageLoading: false });
            }
        });
    }

    onCheckPress() {
        this.setState({ loading: true });
        Database.request2('POST','postLocationCheck',{},2, (err, response) => {
            if(err) {
                Alert.alert('Error', response.message);
                this.setState({ loading: false });
            } else {
                this.setState({ elements: [response[0], ...this.state.elements], loading: false });
            }
        });        
    }    

    renderList() {
        if (this.state.pageLoading) {
            return <ActivityIndicator size='large' />;
        }

        return (
            <FlatListe 
                keyEx='checkDate'
                data={this.state.elements}
                initialNumToRender={5}
                onPress={(props) => { console.log('') }}
            />                       
        );           
    }

    render() {
        return (
            <Form
                title={texts.timesheet}
            >
                <ScrollView style={{  }}>
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