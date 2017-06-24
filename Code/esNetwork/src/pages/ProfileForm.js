import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Input, DatePicker, Form } from '../components';
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
        currentOption: ''
    }

    componentWillMount() {
        this.getProfile(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.getProfile(nextProps);
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
                genderId: 1
            });
        }
    }

    onChangeDate(dateISO) {
        this.setState({ dateOfBirth: dateISO });
    }

    onPressRight() {
        this.setState({ editable: true });
    }

    getProfile(props) {
        if (session[0].personId === this.props.personId) {
            this.setState({ currentOption: 'Edit' });
        }    

        Database.request(
            'GET', 
            `person/${props.personId}`, 
            {}, 
            2,
            this.handleResponse.bind(this), 
            this.onSuccess.bind(this),
            this.onError.bind(this)
        );
    }

    handleResponse(response) {
        console.log(response.status);
        this.setState({ status: response.status });
        return response.json();
    }  

    renderAvatar() {
        const { avatarStyle, avatarTextStyle, indicatorStyle, avatarContainer } = styles;
        return (
            <TouchableOpacity style={avatarContainer}>
                <View style={[avatarStyle, { backgroundColor: colors.alternateColor }]} >
                    <Text style={avatarTextStyle}>{this.state.abbr}</Text>
                </View>
                <View style={indicatorStyle} />
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
                   leftIcon='back'
                   title='Profile'
                   menuList={[]}
                   rightIcon={this.state.currentOption}
                   onPressRight={this.onPressRight.bind(this)}
                >                       
                <ScrollView>
                    <View style={headerStyle}>
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
                        <Text style={titleStyle}>{texts.contactInfo}</Text>
                        <Input 
                            label={texts.email} 
                            type='email' 
                            returnKeyType='next' 
                            onChangeText={(email) => this.setState({ email })}
                            value={this.state.email}
                            editable={this.state.editable}
                        />
                        <DatePicker 
                            label={texts.dateOfBirth} 
                            onChangeDate={this.onChangeDate.bind(this)}
                            date={this.state.dateOfBirth}
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
        paddingRight: 30
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
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 10
    },    
    headerStyle: {
        backgroundColor: colors.main,
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
        width: 82,
        height: 82,
        alignSelf: 'center',
        marginTop: 20
    },
    indicatorStyle: {
        width: 20,
        height: 20,
        position: 'absolute',
        borderRadius: 10,
        backgroundColor: 'gray',
        right: 5,
        bottom: 5
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
        height: 20
    },
    titleStyle: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 18
    }
});

export { ProfileForm };
