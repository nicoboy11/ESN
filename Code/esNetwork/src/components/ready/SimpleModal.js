import React, { Component } from 'react';
import { Modal, View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { FlatListe } from '../';
import { Config, Database } from '../../settings';

const { colors } = Config;

class SimpleModal extends Component {
    state = { selectedItem: null, elements: [] };

    componentWillMount() {
        this.setState({ visible: this.props.visible, elements: this.props.elements });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ visible: nextProps.visible });            
    }

    onSelection(text, value) {
        this.setState({ selectedItem: value });
        if (this.props.onSelection !== undefined) {
            if (this.props.autoclose) {
                this.setState({ visible: false });
            }
            this.props.onSelection(text, value);
        }
    }
        
    renderModal() {
        return (
            <FlatListe 
                ref={(input) => { this.cardList = input; }}
                onPress={this.onSelection.bind(this)}
                data={this.state.elements}
                keyEx='value'
                itemType={this.props.itemType}
                separator
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
                        {this.renderModal()}                            
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
        color: colors.clickable,
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

export { SimpleModal };
