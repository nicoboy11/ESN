import React, { Component } from 'react';
import { View } from 'react-native';
import { Input } from './components';
import { texts } from './config';

export default class App extends Component {
  render() {
    return (
        <View>
            <Input 
                label={texts.email}
                returnKeyType='next' 
                type='email' 
            />
            <Input ref='tiPassword' label={texts.password} returnKeyType='next' type='password' />
            <Input label={texts.name} returnKeyType='next' autoCapitalize='sentences' type='text' />
            <Input label={texts.lastName} returnKeyType='next' autoCapitalize='sentences' type='text' />
        </View>
    );
  }
}
