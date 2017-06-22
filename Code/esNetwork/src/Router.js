import React, { Component } from 'react';
import { StyleSheet, Modal, Text } from 'react-native';
import { Scene, Router, Actions, TabBar } from 'react-native-router-flux';
import { Menu } from './components';
import { 
    LoginForm, 
    RegisterForm, 
    MainForm, 
    ProfileForm, 
    ProfileImage,
    TaskForm,
    TaskMessageForm
} from './pages';
import { Config } from './settings';

const { colors } = Config;

class TabIcon extends React.Component {
    render() {
        return (
            <Text style={{ color: this.props.selected ? 'red' : 'black' }}>{this.props.title}</Text>
        );
    }
}

class RouterComponent extends Component {

    render() {
        return (
            <Router 
                navigationBarStyle={styles.navBarStyle}
                leftButtonIconStyle={{ tintColor: 'white' }}
                titleStyle={styles.textStyle}
            > 
                <Scene key='authentication'>
                    <Scene key='login' navigationBarStyle={{ opacity: 0 }} component={LoginForm} />
                    <Scene 
                        hideNaveBar={false} 
                        key='register' 
                        component={RegisterForm} 
                        title='Register'
                    />                 
                </Scene>   
                <Scene key='tabbar' tabs={true}>
                    <Scene 
                        key='tasks' 
                        component={TaskForm} 
                        hideNavBar
                        title='Tasks'
                        icon={TabIcon}
                    />                         
                    <Scene 
                        key='mainForm' 
                        component={MainForm} 
                        hideNavBar
                        title='Feed'
                        icon={TabIcon}
                    />                     
                    <Scene key='profile' direction='vertical' component={ProfileForm} hideNavBar />
                    <Scene key='profileImage' component={ProfileImage} hideNavBar />
                </Scene>    
                <Scene initial key='taskMessage' component={TaskMessageForm} hideNavBar />
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
