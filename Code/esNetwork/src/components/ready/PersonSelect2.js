import React, { Component } from 'react';
import { View, TextInput, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { FlatListe, Avatar } from '../';
import { Config, Database } from '../../settings';
const { colors } = Config;
const session = Database.realm('Session', { }, 'select', '');

class PersonSelect2 extends Component {
    state = { 
                elements: [], 
                network: [], 
                company: [], 
                selectedItems: [], 
                selection: true, 
                textVal: '' 
            }

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
                network: data
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

    onSelection(text, value, data) {
        this.setState({
            selectedItems: [...this.state.selectedItems, data],
            textVal: '',
            elements: []
        });
    }

    removeItem(toRemove) {
        this.setState({
            selectedItems: this.state.selectedItems.filter(item => item.id !== toRemove.id)
        });
    }

    changeText(text) {
        let result = [];
        
        if (text !== '') {
            result = this.state.network.filter(
                (person) => person.person.toLowerCase().includes(text.toLowerCase())
            );
        }

        this.setState({ textVal: text, elements: result });
        this.changeText.bind(this);
    }

    renderSelected() {
        const {
            contactStyle,
            closeStyle,
            closeContainer
        } = styles;

        return this.state.selectedItems.map(item => 
            (
                <View key={item.id} style={contactStyle}>
                    <Avatar 
                        avatar={item.avatar.avatar}
                        color={item.avatar.color}
                        name={item.title}
                        size='small'
                    />
                    <TouchableOpacity
                        onPress={() => this.removeItem(item)}
                    >
                        <View style={closeContainer}>
                            <Image 
                                tintColor={colors.mainDark} 
                                style={closeStyle} 
                                source={{ uri: 'cancel' }} 
                            />
                        </View>
                    </TouchableOpacity>                            
                </View>            
            )
        );
    }

    render() {
        const screen = Dimensions.get('screen');    

        const { 
            textsContainerStyle,
            selectedItemsStyle,
            listStyle
        } = styles;

        return (
            <View
                style={this.props.style}
            >
                <View
                    onLayout={(event) => { 
                        this.setState({ dropTop: event.nativeEvent.layout.height }); 
                    }} 
                    style={textsContainerStyle}
                >
                    <View style={[selectedItemsStyle]}>
                        {this.renderSelected()}
                        <TextInput 
                            placeholder={this.props.placeholder}
                            placeholderTextColor={colors.lightText}
                            value={this.state.textVal}
                            onChangeText={this.changeText.bind(this)}
                            style={{ width: 150, padding: 0, paddingLeft: 5, height: 25, lineHeight: 25 }}
                        />                        
                    </View>
                </View>
                <View style={[listStyle, { top: this.state.dropTop, width: screen.width }]}>
                    <FlatListe 
                        ref={(input) => { this.cardList = input; }}
                        onPress={this.onSelection.bind(this)}
                        data={this.state.elements}
                        keyEx='personId'
                        itemType='people'
                        separator
                    />                  
                </View>
            </View>
        );
    }
}

const styles = new StyleSheet.create({
    textsContainerStyle: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.lightText
    },
    selectedItemsStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: colors.elementBackground,
        paddingBottom: 5
    },
    listStyle: {
        position: 'absolute',
        zIndex: 999,
        backgroundColor: colors.background
    },
    contactStyle: {
        backgroundColor: colors.background,
        borderRadius: 5,
        height: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
        marginTop: 5,
        paddingLeft: 5,
        paddingRight: 5,
        flexDirection: 'row'
    },
    inputContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    closeStyle: {
        width: 12,
        height: 12
    },
    closeContainer: {
        borderRadius: 6,
        width: 15,
        height: 15,
        backgroundColor: colors.secondText,
        marginLeft: 5,
        padding: 2,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export { PersonSelect2 };
