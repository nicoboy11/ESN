import React, { Component } from 'react';
import { StyleSheet, Modal, Text, View, Image } from 'react-native';
import { Scene, Router, ActionConst, Actions, TabBar } from 'react-native-router-flux';
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
        let icon = (this.props.selected) ? 'g' : '';
        icon += this.props.title;

        return (
                <Image 
                    source={{ uri: icon }} 
                    style={{ width: 23, height: 23 }}
                />           
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
                <Scene initial key='authentication' type={ActionConst.RESET}>
                    <Scene 
                        key='login' 
                        navigationBarStyle={{ opacity: 0 }} 
                        component={LoginForm} 
                        type={ActionConst.RESET}
                    />
                    <Scene 
                        hideNaveBar={false} 
                        key='register' 
                        component={RegisterForm} 
                        title='Register'
                    />                 
                </Scene>   
                <Scene  key='tabbar' tabs={true} tabBarStyle={styles.tabBarStyle} >
                    <Scene 
                        key='tasks' 
                        component={TaskForm} 
                        hideNavBar
                        title='tasks'
                        icon={TabIcon}
                        style={{ paddingBottom: 46 }}
                    />                         
                    <Scene 
                        key='mainForm' 
                        component={MainForm} 
                        hideNavBar
                        title='feed'
                        icon={TabIcon}
                        style={{ paddingBottom: 46 }}
                    />                     
                </Scene>    
                <Scene key='profile' component={ProfileForm} hideNavBar />
                <Scene key='profileImage' component={ProfileImage} hideNavBar />                
                <Scene key='taskMessage' component={TaskMessageForm} hideNavBar />
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
    },
    tabBarStyle: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.2,
        elevation: 2,
        paddingTop: 5
    }
});

export default RouterComponent;
