import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { Form, Input, PersonSelect } from '../components';

class SelectPersonForm extends Component {
    state = { text: '' }
    
    onSearch(text) {
        this.setState({ text });
        this.pSelect.filter(text);
    }

    onSelection(text, value) {
        this.props.onSelection(text,value);
    }

    onPressLeft() {
        this.props.close();
    }

    render() {
        return (
            <Form
                leftIcon='cancel'
                title={this.props.title}
                onPressLeft={this.onPressLeft.bind(this)}            
            >
                <View>
                    <View>
                        <TextInput 
                            onChangeText={this.onSearch.bind(this)}
                            value={this.state.text}
                        />
                    </View>
                    <View>
                        <PersonSelect 
                            ref={(pSelect) => { this.pSelect = pSelect; }}
                            onSelection={this.onSelection.bind(this)}
                        />
                    </View>
                </View>
            </Form>
        );
    }
}

export { SelectPersonForm };
