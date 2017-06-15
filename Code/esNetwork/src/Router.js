import React, { Component } from 'react';
import { StyleSheet, Modal } from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';
import { Menu } from './components';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import MainForm from './pages/MainForm';
import AccountForm from './pages/AccountForm';
import { Config } from './settings';

const { colors } = Config;

class RouterComponent extends Component {

    render() {
        return (
            <Router 
                navigationBarStyle={styles.navBarStyle}
                leftButtonIconStyle={{ tintColor: 'white' }}
                titleStyle={styles.textStyle}
            > 
                <Scene initial key='authentication'>
                    <Scene key='login' navigationBarStyle={{ opacity: 0 }} component={LoginForm} />
                    <Scene 
                        hideNaveBar={false} 
                        key='register' 
                        component={RegisterForm} 
                        title='Register'
                    />                 
                </Scene>   
                <Scene key='main'>
                    <Scene 
                        key='mainForm' 
                        component={MainForm} 
                        hideNavBar
                    />   
                    <Scene key='account' component={AccountForm} hideNavBar />
                </Scene>    
                {/*<Scene key="statusModal" component={PostCardMenu} direction='vertical' hideNavBar />     */}
            </Router>
        );
    }
}

const styles = StyleSheet.create({
    navBarStyle: {
        backgroundColor: colors.main
    },
    textStyle: {
        color: colors.mainText
    }
});

export default RouterComponent;
