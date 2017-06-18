import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Input, DatePicker } from '../components';
import { Config, Database } from '../settings';

const { texts, colors } = Config;

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
        genderId: 1
    }

    onChangeDate(dateISO) {
        this.setState({ dateOfBirth: dateISO });
    }

    renderAvatar() {
        const { avatarStyle, avatarTextStyle, indicatorStyle, avatarContainer } = styles;
        return (
            <TouchableOpacity style={avatarContainer}>
                <View style={[avatarStyle, { backgroundColor: colors.alternateColor }]} >
                    <Text style={avatarTextStyle}>{this.props.personId}</Text>
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
                <View style={{ flex: 1 }}>
                <TouchableOpacity style={{ backgroundColor: colors.main }} onPress={() => Actions.pop()} >
                    <Image style={imageStyle} source={require('../img/wback.png')} />
                </TouchableOpacity>                       
                <ScrollView>
                    <View style={headerStyle}>
                        <Text style={mainTextStyle}>Even Sosa</Text>                         
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
                    <View>

                    </View>
                    <View style={mainViewStyle}>
                        <Text style={titleStyle}>{texts.contactInfo}</Text>
                        <Input 
                            label={texts.email} 
                            type='email' 
                            returnKeyType='next' 
                            onChangeText={(email) => this.setState({ email })}
                            value='even.sosa@gmail.com'
                            editable={false}                
                        />
                        <DatePicker 
                            label={texts.dateOfBirth} 
                            onChangeDate={this.onChangeDate.bind(this)}
                            date={new Date(1985, 9, 23)}
                            editable={false}                                 
                        />
                        <Input 
                            label={texts.mobile} 
                            type='number' 
                            returnKeyType='next' 
                            onChangeText={(mobile) => this.setState({ mobile })}
                            value={this.state.mobile}       
                            editable={false}
                            value='8341263004'
                        />                      
                        <Input 
                            label={texts.phone} 
                            type='number' 
                            returnKeyType='next' 
                            onChangeText={(phone) => this.setState({ phone })}
                            value={this.state.phone}      
                            editable={false}
                            value='3163655'
                        />     
                        <Input 
                            label={texts.ext} 
                            type='number' 
                            returnKeyType='next' 
                            onChangeText={(ext) => this.setState({ ext })}
                            value={this.state.ext}      
                            editable={false}
                            value='1209'
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
                </View>
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
