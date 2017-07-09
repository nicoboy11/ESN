import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { Form, Input, PersonSelect } from '../components';
import { Config } from '../settings';
const { colors } = Config;

class SelectPersonForm extends Component {
    state = { text: '' }
    
    onSearch(text) {
        this.setState({ text });
        this.pSelect.filter(text);
    }

    onSelection(text, value) {
        this.props.onSelection(text, value);
    }

    onPressLeft() {
        if (this.props.onClose) {
            this.props.onClose();
        }
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
                            placeholder='Search people'
                            placeholderTextColor={colors.secondText}
                        />
                    </View>
                    <View>
                        <PersonSelect 
                            ref={(pSelect) => { this.pSelect = pSelect; }}
                            onSelection={this.onSelection.bind(this)}
                            itemType='people'
                            style={{ paddingLeft: 5 }}
                        />
                    </View>
                </View>
            </Form>
        );
    }
}

export { SelectPersonForm };
