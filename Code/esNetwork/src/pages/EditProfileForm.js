import React, { Component } from 'react';
import { ScrollView, Modal, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Form, ListItem2, Label, DateDue, FlatListe, Input } from '../components';
import { EditTextForm, SelectPersonForm } from './';
import { Config, Helper, Database } from '../settings';

const session = Database.realm('Session', { }, 'select', '');
const { colors } = Config;

class EditProfileForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...props,
            isNameEditorVisible: false,
            isSecondLastNameEditorVisible: false,
            isLastNameEditorVisible: false,
            isPhoneEditorVisible: false,
            isExtensionEditorVisible: false,
            isMobileEditorVisible: false,
            isEmailEditorVisible: false
        };
    }    

    onSaveName() {

    }

    onSaveLastName() {

    }

    onSaveSecondLastName() {

    }

    onSaveEmail() {

    }
    
    onSavePhone() {

    }

    onSaveExt() {

    }

    onSaveMobile() {

    }

    onChangeDOB() {

    }    

    savePerson() {

    }

    updateParent() {
        return {};
    }

    render() {
        const { personId, names, lastName, secondLastName, dateOfBirth, email, phone, mobile, ext } = this.state;
        return (
            <Form 
                title={names}
                leftIcon='back'
                onPressLeft={() => Actions.pop({ refresh: { updated: this.updateParent() } })}
                rightIcon={'ok'}
                onPressRight={() => this.saveNewProject()}
            >
                <ScrollView>
                {/* Name editor */}
                    <ListItem2 
                        title='NAME(s):' 
                        editable
                        onPress={() => this.setState({ isNameEditorVisible: true })}
                    >
                            <Label style={{ color: colors.darkGray }} >{names}</Label>
                    </ListItem2>
                    <Modal
                        animationType='slide'
                        onRequestClose={() => console.log('closing')}
                        visible={this.state.isNameEditorVisible}
                    >
                        <EditTextForm 
                            title='Name(s)'
                            text={names}
                            onClose={() => this.setState({ isNameEditorVisible: false })}
                            onSave={this.onSaveName.bind(this)}
                        />
                    </Modal> 
                {/* lastName editor */}
                    <ListItem2 
                        title='LAST NAME:' 
                        editable
                        onPress={() => this.setState({ isLastNameEditorVisible: true })}
                    >
                            <Label style={{ color: colors.darkGray }} >{lastName}</Label>
                    </ListItem2>
                    <Modal
                        animationType='slide'
                        onRequestClose={() => console.log('closing')}
                        visible={this.state.isLastNameEditorVisible}
                    >
                        <EditTextForm 
                            title='Last Name'
                            text={lastName}
                            onClose={() => this.setState({ isLastNameEditorVisible: false })}
                            onSave={this.onSaveLastName.bind(this)}
                        />
                    </Modal> 
                {/* secondLastName editor */}
                    <ListItem2 
                        title='SECOND LAST NAME:' 
                        editable
                        onPress={() => this.setState({ isSecondLastNameEditorVisible: true })}
                    >
                            <Label style={{ color: colors.darkGray }} >{secondLastName}</Label>
                    </ListItem2>
                    <Modal
                        animationType='slide'
                        onRequestClose={() => console.log('closing')}
                        visible={this.state.isSecondLastNameEditorVisible}
                    >
                        <EditTextForm 
                            title='Second Last Name'
                            text={secondLastName}
                            onClose={() => this.setState({ isSecondLastNameEditorVisible: false })}
                            onSave={this.onSaveSecondLastName.bind(this)}
                        />
                    </Modal>    
                {/* Date of Birth */}                       
                    <ListItem2 title='DATE OF BIRTH:'>
                        <DateDue 
                            ref={(date) => { this.dateOfBirth = date; }}
                            date={dateOfBirth} 
                            onChangeDate={this.onChangeDOB.bind(this)}
                            title='Date of birth'
                        />
                    </ListItem2>  
                {/* Email editor */}
                    <ListItem2 
                        title='EMAIL:' 
                        editable
                        onPress={() => this.setState({ isEmailEditorVisible: true })}
                    >
                            <Label style={{ color: colors.darkGray }} >{email}</Label>
                    </ListItem2>
                    <Modal
                        animationType='slide'
                        onRequestClose={() => console.log('closing')}
                        visible={this.state.isEmailEditorVisible}
                    >
                        <EditTextForm 
                            title='Email'
                            text={email}
                            onClose={() => this.setState({ isEmailEditorVisible: false })}
                            onSave={this.onSaveEmail.bind(this)}
                        />
                    </Modal>                        
                {/* phone editor */}
                    <ListItem2 
                        title='PHONE:' 
                        editable
                        onPress={() => this.setState({ isPhoneEditorVisible: true })}
                    >
                            <Label style={{ color: colors.darkGray }} >{phone}</Label>
                    </ListItem2>
                    <Modal
                        animationType='slide'
                        onRequestClose={() => console.log('closing')}
                        visible={this.state.isPhoneEditorVisible}
                    >
                        <EditTextForm 
                            title='Phone'
                            text={phone}
                            onClose={() => this.setState({ isPhoneEditorVisible: false })}
                            onSave={this.onSavePhone.bind(this)}
                        />
                    </Modal>      
                {/* Extension editor */}
                    <ListItem2 
                        title='EXTENSION:' 
                        editable
                        onPress={() => this.setState({ isExtensionEditorVisible: true })}
                    >
                            <Label style={{ color: colors.darkGray }} >{ext}</Label>
                    </ListItem2>
                    <Modal
                        animationType='slide'
                        onRequestClose={() => console.log('closing')}
                        visible={this.state.isExtensionEditorVisible}
                    >
                        <EditTextForm 
                            title='Extension'
                            text={ext}
                            onClose={() => this.setState({ isExtensionEditorVisible: false })}
                            onSave={this.onSaveExt.bind(this)}
                        />
                    </Modal>     
                {/* Mobile editor */}
                    <ListItem2 
                        title='MOBILE:' 
                        editable
                        onPress={() => this.setState({ isMobileEditorVisible: true })}
                    >
                            <Label style={{ color: colors.darkGray }} >{mobile}</Label>
                    </ListItem2>
                    <Modal
                        animationType='slide'
                        onRequestClose={() => console.log('closing')}
                        visible={this.state.isMobileEditorVisible}
                    >
                        <EditTextForm 
                            title='Mobile'
                            text={mobile}
                            onClose={() => this.setState({ isMobileEditorVisible: false })}
                            onSave={this.onSaveMobile.bind(this)}
                        />
                    </Modal>                                                                                                                      
                </ScrollView>    
            </Form>
        );
    }
}

export { EditProfileForm };
