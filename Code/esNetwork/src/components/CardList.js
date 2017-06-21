import React, { Component } from 'react';
import { ListView, Alert, Text } from 'react-native';
import { PostCard, TaskCard } from './';

class CardList extends Component {

    componentWillMount() {
        const ds = new ListView.DataSource({ 
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.dataSource = ds.cloneWithRows(this.props.elements);
    }

    renderRow(data) {
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
                        />
                );        
            case 'Chat':
                return (
                    <Text>{data.message}</Text>
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

export { CardList };
