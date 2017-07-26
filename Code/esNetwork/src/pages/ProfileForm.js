import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';
import { Input, DatePicker, Form, Avatar, MyPicker } from '../components';
import { Config, Database, Helper } from '../settings';

const { texts, colors } = Config;
const session = Database.realm('Session', { }, 'select', '');

class ProfileForm extends Component {

    state = { 
        dateOfBirth: null,
        loading: 0,
        names: '',
        firstLastName: '',
        secondLastName: '',
        email: '',
        phone: '',
        ext: '',
        mobile: '',
        genderId: 1,
        editable: false,
        currentOption: '',
        currentLeft: undefined,
        avatar: null,
        theme: colors.main
    }

    componentWillMount() {
        this.getProfile(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.getProfile(nextProps);
    }

    onResponse(response) {
        console.log(response.status);
        this.setState({ status: response.status });
        return response.json();
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
            this.setState({
                dateOfBirth: Helper.toDate(responseData[0].dateOfBirth),
                loading: 0,
                names: responseData[0].names,
                firstLastName: responseData[0].firstLastName,
                secondLastName: responseData[0].secondLastName,
                email: responseData[0].email,
                phone: responseData[0].phone,
                ext: responseData[0].ext,
                mobile: responseData[0].mobile,
                abbr: responseData[0].abbr,
                avatar: responseData[0].avatar,
                genderId: responseData[0].genderId,
                editable: (responseData[0].personId === session[0].personId),
                currentOption: 'edit',
                theme: responseData[0].theme,
                personId: responseData[0].personId
            });
        }
    }

    onChangeDate(dateISO) {
        this.setState({ dateOfBirth: dateISO });
    }

    onPressRight() {
        switch (this.state.currentOption) {
            case 'edit':
                Actions.myEditProfileForm(this.state);
                break;
            case 'save':
                this.saveProfile();
                break;
            default:
                break;
        }
    }

    onPressLeft() {
        if (this.state.currentLeft === 'close') {
            this.setState({ editable: false, currentOption: 'edit' });
        } else {
            Actions.pop();
        }
    }

    getProfile(props) {
        let personId = 0;
        if (props.personId !== undefined) {
            if (session[0].personId === props.personId) {
                this.setState({ currentOption: 'edit', currentLeft: 'back', editable: true });
            } else {
                this.setState({ currentOption: '', currentLeft: 'back', editable: false });
            }
            personId = props.personId;
        } else {
            personId = session[0].personId;
        }
  

        const profile = Database.realm('Person', { }, 'select', `personId=${personId}`);

        if (profile[0] !== undefined) {
            this.localLoad(profile);
        } else {
            this.remoteRequest(personId);
        }
    }

    remoteRequest(personId) {
        Database.request(
            'GET', 
            `person/${personId}`, 
            {}, 
            2,
            this.onResponse.bind(this), 
            this.onSuccess.bind(this),
            this.onError.bind(this)
        );
    }

    localLoad(profile) {
        this.setState(
            Database.realmToObject(profile, 'Person')[0]
        );         
        
        if (session[0].personId === profile[0].personId) {
            this.setState({ currentOption: 'edit', currentLeft: 'back', editable: true });
        } else {
            this.setState({ currentOption: '', currentLeft: 'back', editable: false });
        }        
    }

    saveProfile() {
        let avatar;

        if (this.state.avatarFileName !== undefined) {
            avatar = {
                        uri: this.state.avatar.uri,
                        name: this.state.avatarFileName,
                        type: this.state.avatarFileType
                    };
        }

        Database.request(
            'PUT',
            `person/${this.props.personId}`, 
            {
                email: this.state.email,
                avatar
            },
            1,
            this.onResponse.bind(this),
            this.onSuccess.bind(this),
            this.onError.bind(this)
        );
    }

    imageAction() {
        if (this.state.editable) {
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
                }
            });
        }
    }    

    renderAvatar() {
        const { 
            avatarStyle, 
            avatarTextStyle, 
            indicatorStyle, 
            avatarContainer,
             contactImageStyle 
        } = styles;

        let indicator;

        if (this.state.editable) {
            indicator = (
                <View
                    style={indicatorStyle} 
                >
                    <Image 
                        source={{ uri: 'camera' }} 
                        style={contactImageStyle}
                    />
                </View>
            );
        }

        if (this.state.avatar !== null) {
            return (
                <TouchableOpacity style={avatarContainer} onPress={this.imageAction.bind(this)} >
                    <Avatar 
                        avatar={this.state.avatar}
                        color={this.state.theme}
                        size='huge'
                    />
                    {indicator}
                </TouchableOpacity>    
            );
        }

        return (
            <TouchableOpacity style={avatarContainer} onPress={this.imageAction.bind(this)} >
                <View style={[avatarStyle, { backgroundColor: colors.alternateColor }]} >
                    <Text style={avatarTextStyle}>{this.state.abbr}</Text>
                </View>
                {indicator}
            </TouchableOpacity>           
        );
    }

    render() {
        const { 
            mainViewStyle, 
            imageStyle, 
            headerStyle, 
            mainTextStyle, 
            contactContainerStyle, 
            contactStyle,
            contactImageStyle,
            titleStyle
        } = styles;
        
        return (
                <Form
                   leftIcon={this.state.currentLeft}
                   title=''
                   menuList={[]}
                   rightIcon={this.state.currentOption}
                   onPressRight={this.onPressRight.bind(this)}
                   onPressLeft={this.onPressLeft.bind(this)}
                   background={this.state.theme}
                   shadow={false}
                   rightColor={colors.elementBackground}
                   leftColor={colors.elementBackground}
                   titleStyle={{ color: colors.elementBackground }}
                >                       
                <ScrollView
                    style={{ backgroundColor: this.state.theme }}
                >
                    <View style={[headerStyle, { backgroundColor: this.state.theme }]}>
                        <Text style={mainTextStyle}>
                            {
                                this.state.names + ' ' + 
                                this.state.firstLastName + ' ' +
                                this.state.secondLastName
                            }
                        </Text>                         
                        {this.renderAvatar()}
                        <View style={contactContainerStyle}>
                            <TouchableOpacity style={contactStyle} >  
                                <Image style={contactImageStyle} source={require('../img/wphone.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={contactStyle} >  
                                <Image style={contactImageStyle} source={require('../img/wchat.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View />
                    <View style={mainViewStyle}>
                        <Text style={titleStyle}>{texts.personalInfo}</Text>
                        <DatePicker 
                            label={texts.dateOfBirth} 
                            onChangeDate={this.onChangeDate.bind(this)}
                            date={this.state.dateOfBirth}
                            editable={this.state.editable}
                        />
                        <MyPicker 
                            label='Gender'
                            onChangeSelection={(genderId) => this.setState({ genderId })}
                            elements={[{ text: 'Male', value: 1 }, { text: 'Famale', value: 2 }]}
                            selectedValue={this.state.genderId}
                            editable={false}
                        />                
                        <Text style={titleStyle}>{texts.contactInfo}</Text>                                                           
                        <Input 
                            label={texts.email} 
                            type='email' 
                            returnKeyType='next' 
                            onChangeText={(email) => this.setState({ email })}
                            value={this.state.email}
                            editable={this.state.editable}
                        />
                        <Input 
                            label={texts.phone} 
                            type='number' 
                            returnKeyType='next' 
                            onChangeText={(phone) => this.setState({ phone })}
                            value={this.state.phone}      
                            editable={this.state.editable}
                        />     
                        <Input 
                            label={texts.ext} 
                            type='number' 
                            returnKeyType='next' 
                            onChangeText={(ext) => this.setState({ ext })}
                            value={this.state.ext}      
                            editable={this.state.editable}
                        />                          
                        <Input 
                            label={texts.mobile} 
                            type='number' 
                            returnKeyType='next' 
                            onChangeText={(mobile) => this.setState({ mobile })}
                            value={this.state.mobile}       
                            editable={this.state.editable}
                        />                      
                    </View>

                    {/*<Input 
                        label={texts.gender} 
                        type='number' 
                        returnKeyType='next' 
                        onChangeText={(gender) => this.setState({ gender })}
                        value={this.state.gender}                    
                    />                     */}                                      
                </ScrollView>
                </Form>
        );
    }
}

const styles = StyleSheet.create({
    mainViewStyle: {
        paddingLeft: 30,
        paddingRight: 30,
        backgroundColor: colors.elementBackground
    },
    mainTextStyle: {
        color: colors.mainText,
        fontSize: 23,
        alignSelf: 'center'
    },
    avatarTextStyle: {
        color: colors.mainText,
        fontSize: 36,
        fontWeight: '200'
    },
    avatarStyle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 10
    },    
    headerStyle: {
        flex: 1,
        paddingBottom: 10

    },
    imageStyle: {
        width: 24,
        height: 24,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10
    },
    avatarContainer: {
        width: 122,
        height: 122,
        alignSelf: 'center',
        marginTop: 20
    },
    indicatorStyle: {
        width: 30,
        height: 30,
        position: 'absolute',
        borderRadius: 15,
        backgroundColor: colors.clickable,
        right: 5,
        bottom: 5,
        padding: 5
    },
    contactContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },
    contactStyle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: colors.darkMain,
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contactImageStyle: {
        width: 20,
        height: 20,
        tintColor: colors.elementBackground
    },
    titleStyle: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 18
    }
});

export { ProfileForm };
