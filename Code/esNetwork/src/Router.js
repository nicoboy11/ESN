import React, { Component } from 'react';
import { StyleSheet, Modal } from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';
import { Menu } from './components';
import { LoginForm, RegisterForm, MainForm, ProfileForm, ProfileImage } from './pages';
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
                    <Scene key='profile' direction='vertical' component={ProfileForm} hideNavBar />
                    <Scene key='profileImage' component={ProfileImage} hideNavBar />
                </Scene>    
                {/*<Scene key="statusModal" component={PostCardMenu} direction='vertical' 
                hideNavBar />     */}
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
