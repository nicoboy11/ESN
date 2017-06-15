import React, { Component } from 'react';
import { ListView, Alert } from 'react-native';
import { PostCard, TaskCard } from './';

class CardList extends Component {

    componentWillMount() {
        const ds = new ListView.DataSource({ 
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.dataSource = ds.cloneWithRows(this.props.elements);
    }

    renderRow(data) {
        if (data.category === 'Task') {
            return <TaskCard />;
        }

        return ( 
                <PostCard 
                    avatar={data.avatar} 
                    theme={data.theme} 
                    creationDate={data.creationDate}
                    message={data.message}
                    person={data.person}
                />
        );
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
