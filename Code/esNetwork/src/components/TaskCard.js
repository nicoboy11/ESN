import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    StyleSheet
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { LinkButton } from './';
import { Config } from '../settings';

const { colors, texts } = Config;

class TaskCard extends Component {

    openComments() {
        Actions.taskMessage({ taskId: this.props.taskId, name: this.props.name });
    } 

    renderResponsible() {
        const {
            smallImageStyle,
            collaboratorAbbrStyle
        } = styles;        

        const leader = JSON.parse(this.props.leader);

        if (leader === null) {
            return <View />;
        } 

        return leader.map(leaderPerson => (
            (leaderPerson.avatar.length === 2) ?
            <View
                key={leaderPerson.personId}
                style={[smallImageStyle, { backgroundColor: leaderPerson.theme }]}                     
            >
                <Text 
                    style={collaboratorAbbrStyle}
                >
                    {leaderPerson.avatar}
                </Text>
            </View> :
            <Image 
                style={[smallImageStyle, { marginRight: 5 }]} 
                source={{ uri: leaderPerson.avatar }} 
            />
        ));
    }        

    renderCollaborators() {
        const {
            smallImageStyle,
            collaboratorAbbrStyle
        } = styles;

        const collaborators = JSON.parse(this.props.collaborators);
        if (collaborators === null) {
            return <View />;
        }

        return collaborators.map(collaborator => (
                (collaborator.avatar.length === 2) ? 
                <View 
                    key={collaborator.personId} 
                    style={[smallImageStyle, { backgroundColor: collaborator.theme }]} 
                >
                    <Text 
                        style={collaboratorAbbrStyle}
                    >
                            {collaborator.avatar}
                    </Text>
                </View> :
                <Image key={collaborator.personId} style={smallImageStyle} source={{ uri: collaborator.avatar }} />
            )
        );
    }

    renderAvatar() {
        const {
            imageStyle,
            avatarTextStyle
        } = styles;

        if (this.props.creatorAvatar.length === 2) {
            return (
                <View style={[imageStyle, { backgroundColor: this.props.theme }]} >
                    <Text style={avatarTextStyle}>{this.props.creatorAvatar}</Text>
                </View>
            );
        }

        return <Image src={{ uri: this.props.creatorAvatar }} />;
    }

    render() {
        const {
            containerStyle,
            topViewStyle,
            middleViewStyle,
            bottomViewStyle,
            taskTextStyle,
            linkStyle,
            bottomLeftStyle,
            bottomRightStyle,
            creatorStyle,
            creatorTextStyle,
            contributorsStyle,
            peopleStyle,
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
                        <Text style={taskTextStyle} >{this.props.name}</Text>
                        {/* Aqui van las imagenes */}
                    </View>
                </View>         
                <View style={middleViewStyle} >
                    <View style={middleLeftStyle} >
                        <View style={linkListStyle} >
                            <LinkButton 
                                style={linkStyle} 
                                title={(this.props.team === null) ? texts.addTeam : this.props.team} 
                            />
                            <Text>|</Text>
                            <LinkButton 
                                style={linkStyle} 
                                title={(this.props.project === null) ? texts.addProject : this.props.project} 
                            />
                            <Text>|</Text>
                            <LinkButton 
                                style={[linkStyle, { color: colors.error }]} 
                                title={this.props.dueDate} 
                            />
                        </View>
                        <View style={creatorStyle} >
                            {this.renderAvatar()}
                            <Text style={creatorTextStyle} >{this.props.creator}</Text>
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
                            {this.renderResponsible()}
                            <View style={contributorsStyle}>
                                {this.renderCollaborators()}
                            </View>
                        </View>                        
                    </View>
                    <View style={bottomRightStyle} >
                        <LinkButton title={texts.comment} onPress={this.openComments.bind(this)} />
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
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'  
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
        borderRadius: 7.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    collaboratorAbbrStyle: {
        fontSize: 8,
        color: colors.mainText
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
    },
    avatarTextStyle: {
        color: colors.mainText,
        fontSize: 12
    },
});

export { TaskCard };
