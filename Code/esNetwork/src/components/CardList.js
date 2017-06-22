import React, { Component } from 'react';
import { ListView, StyleSheet, Text, View } from 'react-native';
import { PostCard, TaskCard } from './';
import { Config } from '../settings';

const { colors } = Config;

class CardList extends Component {

    componentWillMount() {
        this.setDataSource(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setDataSource(nextProps);
    }

    setDataSource({ elements }) {
        const ds = new ListView.DataSource({ 
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.dataSource = ds.cloneWithRows(elements);
    }

    renderRow(data) {
        const { 
            bubbleLeftStyle,
            dateBubble,
            personBubble
        } = styles;

        switch (data.category) {
            case 'Task':
                 return (
                        <TaskCard 
                            name={data.name}
                            team={data.teamAbbr}
                            project={data.projectName}
                            dueDate={data.dueDate}
                            creatorAvatar={data.creatorAvatar}
                            theme={data.theme}
                            creator={data.creator}
                            collaborators={data.collaborators}
                            leader={data.leader}
                            taskId={data.taskId}
                        />
                );
            case 'Post':
                return ( 
                        <PostCard 
                            avatar={data.avatar} 
                            theme={data.theme} 
                            creationDate={data.creationDate}
                            message={data.message}
                            person={data.person}
                            abbr={data.abbr}
                        />
                );        
            case 'Chat':
                if (data.isSelf) {
                    return (
                        <Text>{data.message}</Text>
                    );
                }

                return (
                    <View style={bubbleLeftStyle}>
                        <Text style={[personBubble, { color: data.theme }]}>{data.person}</Text>
                        <Text>{data.message}</Text>
                        <Text style={dateBubble}>{data.messageDate}</Text>
                    </View>
                );
            default: return;
        }
    }

    render() {
        return (
            <ListView 
                dataSource={this.dataSource} 
                renderRow={this.renderRow}
                enableEmptySections
            />
        );
    }

}

const styles = new StyleSheet.create({
    bubbleLeftStyle: {
        backgroundColor: colors.mainText,
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 10,
        flex: 0.7,
        borderColor: colors.lightText,
        borderWidth: StyleSheet.hairlineWidth
    },
    dateBubble: {
        fontSize: 8,
        alignSelf: 'flex-end',
        color: colors.lightText
    },
    personBubble: {
        fontSize: 12,
        alignSelf: 'flex-start'
    }    
});

export { CardList };
