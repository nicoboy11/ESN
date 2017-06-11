import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    StyleSheet 
} from 'react-native';
import { LinkButton } from './';
import { colors } from '../config';

class TaskCard extends Component {

    render() {
        const {
            containerStyle,
            topViewStyle,
            middleViewStyle,
            bottomViewStyle,
            taskTextStyle,
            linkStyle,
            imageStyle,
            bottomLeftStyle,
            bottomRightStyle,
            creatorStyle,
            creatorTextStyle,
            contributorsStyle,
            peopleStyle,
            smallImageStyle,
            startStyle,
            startTextStyle,
            linkListStyle,
            middleLeftStyle,
            middleRightStyle
        } = styles;

        return (
            <View style={containerStyle} >
                <View style={topViewStyle} >
                    <View>
                        <Text style={taskTextStyle} >Organizar inventarios del almacén 1 alfabeticamente</Text>
                        {/* Aqui van las imagenes */}
                    </View>
                </View>         
                <View style={middleViewStyle} >
                    <View style={middleLeftStyle} >
                        <View style={linkListStyle} >
                            <LinkButton style={linkStyle} title='DISA' />
                            <Text>|</Text>
                            <LinkButton style={linkStyle} title='Nominas' />
                            <Text>|</Text>
                            <LinkButton style={[linkStyle, { color: colors.error }]} title='Mañana' />
                        </View>
                        <View style={creatorStyle} >
                            <Image style={imageStyle} source={require('../img/12.jpg')} />
                            <Text style={creatorTextStyle} >Even Sosa</Text>
                        </View> 
                    </View>
                    <View style={middleRightStyle}>
                        <TouchableOpacity style={startStyle} >
                            <Text style={startTextStyle} >START</Text>
                        </TouchableOpacity>                    
                    </View>                                 
                </View>
                <View style={bottomViewStyle} >
                    <View style={bottomLeftStyle} >
                        <View style={peopleStyle} >
                            <Image style={[smallImageStyle, { marginRight: 5 }]} source={require('../img/13.jpg')} />
                            <View style={contributorsStyle}>
                                <Image style={smallImageStyle} source={require('../img/228.jpg')} />
                                <Image style={smallImageStyle} source={require('../img/226.jpg')} />
                                <Image style={smallImageStyle} source={require('../img/1.jpg')} />
                            </View>
                        </View>                        
                    </View>
                    <View style={bottomRightStyle} >
                        <LinkButton title='Comment' />
                    </View>                    
                </View>                                     
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.lightText,
        padding: 10,
        marginTop: 5,
        backgroundColor: colors.elementBackground
    },
    topViewStyle: {
        flex: 1,
        flexDirection: 'row'
    },
    middleViewStyle: {
        flex: 1,
        marginBottom: 10,
        marginTop: 10,
        flexDirection: 'row'
    },
    bottomViewStyle: {
        flexDirection: 'row'
    },
    middleLeftStyle: {
        flex: 3
    },
    middleRightStyle: {
        flex: 1
    },
    linkListStyle: {
        flex: 1,
        flexDirection: 'row'
    },
    taskTextStyle: {
        fontSize: 18,
        color: 'black'
    },
    linkStyle: {
        marginLeft: 2.5,
        marginRight: 2.5
    },
    imageStyle: {
        width: 20,
        height: 20,
        borderRadius: 10
    },    
    bottomLeftStyle: {
        flex: 2,
        justifyContent: 'center'
    },
    bottomRightStyle: {
        flex: 1,
        alignItems: 'center'
    },
    creatorStyle: {
        flexDirection: 'row'
    },
    creatorTextStyle: {
        fontSize: 12,
        marginLeft: 5
    },
    peopleStyle: {
        flexDirection: 'row'
    },
    contributorsStyle: {
        flexDirection: 'row',
        marginLeft: 5
    },
    smallImageStyle: {
        width: 15,
        height: 15,
        borderRadius: 7.5
    },
    startStyle: {
        width: 50,
        height: 50,
        backgroundColor: colors.alternateColor,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#333',
        shadowOpacity: 0.2,
        elevation: 2,
        shadowOffset: { width: 0, height: 2 }
    },
    startTextStyle: {
        color: colors.mainText
    }
});

export { TaskCard };
