import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { Config, Helper } from '../../settings';
const { colors, font } = Config;

class TaskCard3 extends Component {
    render() {
        const {
            containerStyle,
            topContainerStyle,
            bottomContainerStyle,
            checkImage,
            percentStyle,
            percentText,
            subTitleContainer,
            subTitleText,
            titleText,
            titlecontainer,
            smallTitle,
            smallContainers,
            separator,
            chevronClosed
        } = styles;

        return (
            <View key={this.props.id} style={containerStyle}>
                <TouchableOpacity onPress={() => this.props.onPress(this.props)}>                
                    <View style={topContainerStyle}>
                        <View style={[percentStyle, { borderColor: Helper.prettyfyDate(this.props.date).color }]}>
                            <Text style={percentText}>{`${this.props.data.progress}%`}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={[subTitleContainer, { flex: 1, marginTop: 10 }]}>
                                <Text style={subTitleText}>{this.props.subtitle}</Text>
                            </View>
                            <View style={[titlecontainer, { flex: 1 }]}>
                                <Text style={titleText}>{this.props.title}</Text>
                            </View>
                            <View style={[subTitleContainer, { flex: 1, marginBottom: 10 }]}>
                                <Text style={subTitleText}>Even Sosa</Text>
                            </View>                            
                        </View>
                    </View>
                </TouchableOpacity>                
                <View style={bottomContainerStyle}>
                    <View style={[smallContainers, separator]}>
                        <Text style={smallTitle}>{Helper.prettyfyDate(this.props.date).date}</Text>
                    </View>
                    <View style={[smallContainers, separator]}>
                        <Text style={smallTitle}>Resume</Text>                        
                    </View>
                    <View style={[smallContainers, separator]}>
                        <TouchableOpacity>
                            <Image 
                                source={{ uri: 'checked' }}
                                style={checkImage}
                                tintColor={colors.main}
                            />
                        </TouchableOpacity>
                    </View>         
                    <View style={[smallContainers, { flex: 0.5 }]}>
                        <TouchableOpacity
                            style={{ flex: 1, alignSelf: 'center' }}
                            onPress={() => this.props.onPress(this.props)}
                        >
                            <Image 
                                source={{ uri: 'chevron' }}
                                style={chevronClosed}
                                tintColor={colors.mainDark}
                            />
                        </TouchableOpacity>
                    </View>                                  
                </View>                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.lightText,   
        backgroundColor: colors.elementBackground,
        marginBottom: 10,
        marginTop: 5,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 3
    },
    topContainerStyle: {
        flexDirection: 'row'
    },
    bottomContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.lightText,           
        backgroundColor: colors.background
    },
    checkImage: {
        width: 24,
        height: 24
    },
    percentStyle: {
        borderWidth: 4,
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        alignSelf: 'center'
    },
    percentText: {
        fontFamily: font.normal,
        fontWeight: '600'
    },
    subTitleContainer: {
        
    },
    subTitleText: {
        fontFamily: font.light,
        fontSize: 14,
        color: colors.secondText,   
        flex: 1     
    },
    titlecontainer: {
        
    },
    titleText: {
        fontFamily: font.normal,
        fontSize: 18,
        color: colors.mainDark
    },
    smallContainers: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: colors.background
    },
    smallTitle: {
        color: colors.mainDark,
        fontSize: 12,
    },
    separator: {
        borderColor: colors.lightText,
        borderRightWidth: StyleSheet.hairlineWidth
    },
    chevronClosed: {
        width: 24,
        height: 24,
        transform: [{ rotate: '-90deg' }]
    }    
});

export { TaskCard3 };
