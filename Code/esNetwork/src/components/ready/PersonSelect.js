import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FlatListe } from '../';
import { Config, Database } from '../../settings';

const { colors } = Config;
const session = Database.realm('Session', { }, 'select', '');

class PersonSelect extends Component {
    state = { elements: [], network: [], company: [], selection: true }

    componentWillMount() {
        Database.request(
            'GET', 
            `network/${session[0].personId}`, 
            {}, 
            2,
            this.onResponse.bind(this), 
            this.onSuccessMyNetwork.bind(this),
            this.onError.bind(this)
        );

        Database.request(
            'GET', 
            'network/null', 
            {}, 
            2,
            this.onResponse.bind(this), 
            this.onSuccessCompany.bind(this),
            this.onError.bind(this)
        );        
    }

    onResponse(response) {
        console.log(response.status);
        this.setState({ status: response.status });
        return response.json();        
    }

    onSuccessMyNetwork(data) {
        if (this.state.status > 299) {
            console.log('error');
        } else {
            this.setState({
                network: data,
                elements: data
            });
        }
    }

    onSuccessCompany(data) {
        if (this.state.status > 299) {
            console.log('error');
        } else {
            this.setState({
                company: data
            });
        }
    }    

    onError(error) {
        Alert.alert('Error', error.message);
    }    

    onSelection(text, value) {
        this.props.onSelection(text, value);
    }

    toogleTab() {
        const newSelection = !this.state.selection;
        this.setState({ selection: newSelection });
        this.setState({ elements: (newSelection) ? this.state.network : this.state.company });
    }

    filter(text) {
        let result = [];
        
        if (text !== '') {
            result = this.state.elements.filter(
                (person) => person.person.toLowerCase().includes(text.toLowerCase())
            );
        }

        this.setState({ elements: result });        
    }

    render() {
        const { mainStyle, tabStyle, tabItemStyle, tabItemText } = styles;

        return (
            <View>
                <View style={mainStyle}>
                    <View style={tabStyle}>
                        <View style={tabItemStyle}>
                            <TouchableOpacity 
                                onPress={this.toogleTab.bind(this)}
                            >
                                <Text 
                                    style={[tabItemText, { color: (this.state.selection) ? colors.main : colors.secondText }]}
                                >
                                    My Network
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={tabItemStyle}>
                            <TouchableOpacity 
                                onPress={this.toogleTab.bind(this)}
                            >
                                <Text 
                                    style={[tabItemText, { color: !(this.state.selection) ? colors.main : colors.secondText }]}
                                >
                                    Company
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <FlatListe 
                            ref={(input) => { this.cardList = input; }}
                            onPress={this.onSelection.bind(this)}
                            data={this.state.elements}
                            keyEx='personId'
                            itemType={this.props.itemType}
                            separator
                        />                       
                    </View>
                </View>
            </View>
        );
    }
}

const styles = new StyleSheet.create({
    mainStyle: {
        backgroundColor: colors.background
    },
    tabStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.mainDark,
        paddingTop: 10,
        paddingBottom: 10
    },
    tabItemStyle: {
        flex: 1,
        alignItems: 'center'
    },
    tabItemText: {
        fontSize: 18
    }
});

export { PersonSelect };
