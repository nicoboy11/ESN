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
    TaskMessageForm,
    HierarchyForm,
    Dummy
} from './pages';
import { Config } from './settings';

const { colors } = Config;

class TabIcon extends React.Component {
    render() {
        const color = (this.props.selected) ? colors.main : colors.secondText;

        return (
                <Image 
                    source={{ uri: this.props.title }} 
                    style={{ width: 23, height: 23 }}
                    tintColor={color}
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
                <Scene  key='authentication' type={ActionConst.RESET}>
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
                <Scene initial key='tabbar' tabs={true} tabBarStyle={styles.tabBarStyle} >
                    <Scene initial
                        key='hierarchy' 
                        component={HierarchyForm} 
                        hideNavBar
                        title='profile'
                        icon={TabIcon}
                        style={{ paddingBottom: 46 }}
                    />                     
                    <Scene 
                        key='tasks' 
                        component={TaskForm} 
                        hideNavBar
                        title='task'
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
                    <Scene 
                        key='chatForm' 
                        component={MainForm} 
                        hideNavBar
                        title='chat'
                        icon={TabIcon}
                        style={{ paddingBottom: 46 }}
                    />                                  
                </Scene>    
                <Scene key='dummy' component={Dummy} hideNavBar />
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
