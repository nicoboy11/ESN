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
    ProjectForm,
    EditProjectForm,
    EditProfileForm,
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
                    style={{ width: 23, height: 23, tintColor: color }}
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
                    <Scene
                        key='hierarchy' 
                        component={HierarchyForm} 
                        hideNavBar
                        title='profile'
                        icon={TabIcon}
                        style={{ paddingBottom: 46 }}
                    />         
                    <Scene
                        initial
                        key='projects'
                        icon={TabIcon}
                        title='task'
                        hideNavBar
                    >          
                        <Scene key='projectForm' component={ProjectForm} style={{ paddingBottom: 46 }} />    
                        <Scene key='editProjectForm' component={EditProjectForm} />                         
                        <Scene key='taskForm' component={TaskForm} hideNavBar hideTabBar />                  
                        <Scene key='taskMessage' component={TaskMessageForm} hideNavBar hideTabBar />  
                    </Scene>                     
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
                        component={ProjectForm} 
                        hideNavBar
                        title='chat'
                        icon={TabIcon}
                        style={{ paddingBottom: 46 }}
                    />                                  
                </Scene>    
                <Scene key='dummy' component={Dummy} hideNavBar />
                <Scene
                    key='profile'
                    hideNavBar
                >
                    <Scene key='profileview' initial component={ProfileForm} hideNavBar />
                    <Scene key='editProfileForm' component={EditProfileForm} />    
                </Scene>
                <Scene key='profileImage' component={ProfileImage} hideNavBar />                              
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
