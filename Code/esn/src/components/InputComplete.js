import React, { Component } from 'react';
import { View, TextInput, Image } from 'react-native';

class InputComplete extends Component {

    render(){
        const { containerStyle, textStyle, inputStyle, imageStyle, imageContainer } = styles;
        const { placeholder, secureTextEntry, source, keyboardType, onChangeText } = this.props;
        return (
            <View style={containerStyle}>
                {/*<Text style={textStyle} >{label}</Text>*/}
                <View style={imageContainer}>
                    <Image style={imageStyle} source={source} />
                </View>
                <TextInput 
                    style={inputStyle} 
                    placeholder={placeholder} 
                    underlineColorAndroid='transparent' 
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    onChangeText={onChangeText}
                />
            </View>            
        )
    }


}

const styles = {
    containerStyle: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        borderColor: '#FA1325',
        borderWidth: 1
    },
    textStyle: {
        flex: 1,
        lineHeight: 24,
        fontSize: 16,
        paddingLeft: 5
    },
    inputStyle: {
        flex: 2,
        backgroundColor: '#FFF',
        lineHeight: 24,
        fontSize: 16
    },
    imageStyle: {
        height: 20,
        width: 20
    },
    imageContainer: {
        backgroundColor: '#333',
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center'
    }
};

export { InputComplete };
