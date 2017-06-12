import React from 'react';
import { StyleSheet, Modal } from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';
import { Input, PostCardMenu } from './components';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import MainForm from './pages/MainForm';
import { Config } from './settings';

const { colors } = Config;

const RouterComponent = () => {
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
                    leftButtonImage={require('./img/wmnu.png')} 
                    leftButtonIconStyle={styles.imageStyle}
                    onLeft={() => Actions.statusModal()}
                    rightButtonImage={require('./img/wsearch.png')}
                    rightButtonIconStyle={styles.imageStyle}
                    onRight={() => console.log('openSearch')}
                    title='Feed'
                />
            </Scene>    
            {/*<Scene key="statusModal" component={PostCardMenu} direction='vertical' hideNavBar />     */}
        </Router>
    );
};

const styles = StyleSheet.create({
    navBarStyle: {
        backgroundColor: colors.main
    },
    textStyle: {
        color: colors.mainText
    },
    imageStyle: {
        width: 24,
        height: 24
    }
});

export default RouterComponent;
