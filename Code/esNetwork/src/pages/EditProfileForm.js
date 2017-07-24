import React, { Component } from 'react';
import { ScrollView, Modal, Alert, ActivityIndicator } from 'react-native';
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';
import { Form, ListItem2, Label, DateDue, Avatar } from '../components';
import { EditTextForm, SelectPersonForm } from './';
import { Config, Helper, Database } from '../settings';

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

    onSaveName(text) {
        this.savePerson({ names: text });
    }

    onSaveLastName(text) {
        this.savePerson({ firstLastName: text });
    }

    onSaveSecondLastName(text) {
        this.savePerson({ secondLastName: text });
    }

    onSaveEmail(text) {
        this.savePerson({ email: text });
    }
    
    onSavePhone(text) {
        this.savePerson({ phone: text });
    }

    onSaveExt(text) {
        this.savePerson({ ext: text });
    }

    onSaveMobile(text) {
        this.savePerson({ mobile: text });
    }

    onChangeDOB(date) {
        Database.realm('Person', { dateOfBirth: Helper.toDate(date) }, 'edit', `personId=${this.state.personId}`);        

        Database.request2('PUT', `person/${this.state.personId}`, { dateOfBirth: date }, 1, (err, response) => {
            if (err) {
                Alert.alert('Error', response.message);
            } else {
                this.setState({ dateOfBirth: Helper.toDate(date) });
            }
        });        
    }    

    savePerson(data) {
        this.setState({ uploading: true });
        Database.request2('PUT', `person/${this.state.personId}`, data, 1, (err, response) => {
            if (err) {
                Alert.alert('Error', err.message);
            } else {
                const newData = {
                    dateOfBirth: Helper.toDate(response[0].dateOfBirth),
                    names: response[0].names,
                    firstLastName: response[0].firstLastName,
                    secondLastName: response[0].secondLastName,
                    email: response[0].email,
                    phone: response[0].phone,
                    ext: response[0].ext,
                    mobile: response[0].mobile,
                    abbr: response[0].abbr,
                    avatar: response[0].avatar,
                    genderId: response[0].genderId              
                };

                this.setState(newData);
                
                this.setState({ 
                    isMobileEditorVisible: false,
                    isExtensionEditorVisible: false,
                    isPhoneEditorVisible: false,
                    isEmailEditorVisible: false,
                    isSecondLastNameEditorVisible: false,
                    isLastNameEditorVisible: false,
                    isNameEditorVisible: false,
                    uploading: false
                });             

                Database.realm('Person', newData, 'edit', `personId=${this.state.personId}`); 
            }
        });
    }

    updateParent() {
        const newState = {
            names: this.state.names,
            personId: this.state.personId 
        };        
        return newState;
    }

    selectProfilePicture() {
        const options = {
            title: 'Select your profile photo',
            customButtons: [],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('canceled');
            } else if (response.error) {
                console.log('error');
            } else if (response.customButton) {
                console.log('customButton', response.customButton);
            } else {
                const source = { uri: response.uri };
                this.setState({
                    avatar: source,
                    avatarFileName: response.fileName,
                    avatarFileType: response.type
                });

                let avatar;

                if (response.fileName !== undefined) {
                    avatar = {
                                uri: source.uri,
                                name: response.fileName,
                                type: response.type
                            };
                }      
                        
                this.savePerson({ avatar });
            }
        });        
    }

    render() {
        const { avatar, theme, names, firstLastName, secondLastName, dateOfBirth, email, phone, mobile, ext } = this.state;
        return (
            <Form 
                title={names}
                leftIcon='back'
                onPressLeft={() => Actions.pop({ refresh: { updated: this.updateParent() } })}
            >
                <ScrollView>
                {/* Name editor */}
                    <ListItem2 
                        title='PROFILE PICTURE:' 
                        editable
                        onPress={this.selectProfilePicture.bind(this)}
                    >
                        {(this.state.uploading) ? 
                            <ActivityIndicator /> : 
                            <Avatar 
                                avatar={avatar}
                                color={theme}
                                size='big'
                            /> 
                        }
                                                   
                    </ListItem2>                    
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
                            type='text'
                        />
                    </Modal> 
                {/* lastName editor */}
                    <ListItem2 
                        title='LAST NAME:' 
                        editable
                        onPress={() => this.setState({ isLastNameEditorVisible: true })}
                    >
                            <Label style={{ color: colors.darkGray }} >{firstLastName}</Label>
                    </ListItem2>
                    <Modal
                        animationType='slide'
                        onRequestClose={() => console.log('closing')}
                        visible={this.state.isLastNameEditorVisible}
                    >
                        <EditTextForm 
                            title='Last Name'
                            text={firstLastName}
                            onClose={() => this.setState({ isLastNameEditorVisible: false })}
                            onSave={this.onSaveLastName.bind(this)}
                            type='text'
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
                            type='text'
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
                            type='email'
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
                            type='number'
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
                            type='number'
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
                            type='number'
                        />
                    </Modal>                                                                                                                      
                </ScrollView>    
            </Form>
        );
    }
}

export { EditProfileForm };
