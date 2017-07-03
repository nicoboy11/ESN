import React, { Component } from 'react';
import { Modal, View, StyleSheet, Dimensions, Text, TouchableOpacity, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { CardList } from './';
import { Config, Database } from '../settings';

const { colors } = Config;
const data = Database.realm('Session', { }, 'select', '');

class ESModal extends Component {

    state = { selectedItem: null, elements: [] };

    componentWillMount() {
        if (this.props.selectedItem !== undefined && this.props.selectedItem !== null) {
            this.setState({ selectedItem: this.props.selectedItem });
        }
        this.setState({ visible: this.props.visible });
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            let request = '';

            switch (nextProps.table) {
                case 'teams':
                    request = `teams/${data[0].personId}`;
                    break;
                case 'projects':
                    request = `projects/${data[0].personId}`;
                    break;    
                case 'stateTypes':
                    request = 'stateTypes/null';
                    break;                                        
                default:
                    break;
            }


            Database.request(
                'GET', 
                request, 
                {}, 
                2,
                this.handleResponse.bind(this), 
                this.onSuccess.bind(this),
                this.onError.bind(this)
            );            
        } else {
            this.setState({ visible: nextProps.visible });            
        }
    }

    onError(error) {
        Alert.alert('Error', error.message);
        if (this.state.status === 403) {
            Actions.authentication();
        }
    }
    
    onSuccess(responseData) {
        if (this.state.status === 403) {
            Database.realm('Session', { }, 'delete', '');
            Actions.authentication();
        } else if (this.state.status > 299) {
            Alert.alert('Error', 'There was an error with the request.');
        } else {        
            this.setState({ elements: responseData, visible: true });
        }
    }

    onSelection(text, value) {
        this.setState({ selectedItem: value });
        if (this.props.onSelection !== undefined) {
            this.props.onSelection(text, value);
        }
    }

    handleResponse(response) {
        console.log(response.status);
        this.setState({ status: response.status });
        return response.json();
    }    

    renderPicker() {
        return (
            <CardList 
                ref={(input) => { this.cardList = input; }}
                onPress={this.onSelection.bind(this)}
                type='DropDown' 
                selectedItem={this.state.selectedItem}
                elements={this.state.elements}
            />                     
        );
    }

    render() {
        const screen = Dimensions.get('screen');

        const { 
            listStyle,
            backgroundStyle,
            titleStyle,
            titleContainer,
            cancelStyle
        } = styles;

        return (
            <Modal 
                ref={(input) => { this.modal = input; }}
                animationType={'fade'}
                transparent
                visible={this.state.visible}
                onRequestClose={() => console.log('closeModal')}
            >
                <View 
                    ref={(input) => { this.mainView = input; }}
                    style={{ flex: 1, justifyContent: 'center' }}
                >
                    <View style={backgroundStyle} />
                    <View style={[listStyle, { maxHeight: screen.height / 2 }]}>
                        <View style={titleContainer}>
                            <Text style={titleStyle}>
                                {this.props.title}
                            </Text>
                        </View>
                        {this.renderPicker()}                            
                    </View>
                    <View style={listStyle}>
                        <TouchableOpacity 
                            style={titleContainer} 
                            onPress={() => this.setState({ visible: false })}
                        >
                            <Text style={cancelStyle}>
                                Cancel
                            </Text>
                        </TouchableOpacity>                        
                    </View>
                </View>
            </Modal>            
        );
    }
}

const styles = StyleSheet.create({
    backgroundStyle: {
        position: 'absolute', 
        top: 0, 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: 'black', 
        opacity: 0.5
    },
    listStyle: {
        borderRadius: 5,
        backgroundColor: 'white',
        margin: 10,
        marginBottom: 0
    },
    titleStyle: {
        fontSize: 23,
        color: colors.darkGray,
        marginTop: 10,
        marginLeft: 10,
        marginBottom: 10,
        textAlign: 'center'
    },
    cancelStyle: {
        fontSize: 18,
        color: colors.main,
        marginTop: 10,
        marginLeft: 10,
        marginBottom: 10,
        textAlign: 'center'
    },    
    titleContainer: {
        borderBottomWidth: 1,
        borderBottomColor: colors.lightText
    }
});

export { ESModal };
