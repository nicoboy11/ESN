import React, { Component } from 'react';
import { Modal, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Config } from '../../settings';
const { colors } = Config;

class ModalView extends Component {
    close() {
        this.props.onRequestClose();
    }

    render() {
        return (
                <Modal
                    ref={(input) => { this.peopleModal = input; }}
                    animationType={'fade'}
                    transparent
                    visible={this.props.visible}
                    onRequestClose={this.close.bind(this)}                
                >
                    <View style={styles.backgroundStyle} />
                    <View style={styles.contentStyle}>
                        {this.props.children}
                    </View>
                    <View style={styles.listStyle}>
                        <TouchableOpacity 
                            style={styles.titleContainer} 
                            onPress={this.close.bind(this)}
                        >
                            <Text style={styles.cancelStyle}>
                                Close
                            </Text>
                        </TouchableOpacity>                        
                    </View>                    
                </Modal>
        );
    }
}

const styles = new StyleSheet.create({
    backgroundStyle: {
            position: 'absolute', 
            top: 0, 
            bottom: 0, 
            left: 0, 
            right: 0, 
            backgroundColor: colors.mainDark, 
            opacity: 0.5
        },
    contentStyle: {
        backgroundColor: colors.background,
        flex: 1,
        borderRadius: 5,
        margin: 20,
        marginBottom: 0
    },
    listStyle: {
        borderRadius: 5,
        backgroundColor: colors.background,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10
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
    }    
});

export { ModalView };
