import React, { Component } from 'react';
import { StyleSheet, AppState, Image, Alert } from 'react-native';
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
    EditTaskForm,
    NewHierarchyForm,
    Dummy
} from './pages';
import { Config, Helper } from './settings';

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

    state = { appState: AppState.currentState };

    componentDidMount() {

        //Check if there are any changes in the server
        //then load accordingly

        //AppState.addEventListener('change', this.handleAppState);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppState);
    }    

    handleAppState(nextAppState) {
        if (this.state.appState.match('/inactive|background/') && nextAppState === 'Active') {
            Alert.alert('Welcome back');
        }
        this.setState({ appState: nextAppState });
    }

    render() {
        return (
            <Router 
                navigationBarStyle={styles.navBarStyle}
                leftButtonIconStyle={{ tintColor: 'white' }}
                titleStyle={styles.textStyle}
            > 
                <Scene  key='authentication' type={ActionConst.RESET}>
                    <Scene 
                        hideNavBar
                        key='login' 
                        navigationBarStyle={{ opacity: 0 }} 
                        component={LoginForm} 
                        type={ActionConst.RESET}
                    />
                    <Scene 
                        hideNaveBar
                        key='register' 
                        component={RegisterForm} 
                        title='Register'
                    />                 
                </Scene>   
                <Scene initial key='tabbar' tabs={true} tabBarStyle={styles.tabBarStyle} >
                    <Scene 
                        key='hierarchy'
                        hideNavBar
                        title='profile'
                        icon={TabIcon}
                        style={{ paddingBottom: 46 }}
                    >    
                        <Scene
                            key='hierarchyForm' 
                            component={HierarchyForm} 
                        />
                        <Scene key='newHierarchyForm' component={NewHierarchyForm} />
                    </Scene>         
                    <Scene
                        initial
                        key='projects'
                        icon={TabIcon}
                        title='task'
                        hideNavBar
                    >          
                        <Scene key='projectForm' component={ProjectForm} style={{ paddingBottom: 46 }} />    
                        <Scene key='editProjectForm' component={EditProjectForm} hideTabBar />                         
                        <Scene key='taskForm' component={TaskForm} hideNavBar hideTabBar />                  
                        <Scene key='taskMessage' component={TaskMessageForm} hideNavBar hideTabBar />  
                        <Scene key='editTaskForm' component={EditTaskForm} hideNavBar hideTabBar />  
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
                        key='myprofile'
                        icon={TabIcon}
                        title='profile'
                        hideNavBar
                    >
                        <Scene 
                            key='myProfileForm' 
                            component={ProfileForm} 
                            hideNavBar
                            title='profile'
                            icon={TabIcon}
                            style={{ paddingBottom: 46 }}
                        />                      
                        <Scene key='myEditProfileForm' component={EditProfileForm} hideTabBar />     
                    </Scene>                                 
                </Scene>    
                <Scene key='dummy' component={Dummy} hideNavBar />
                <Scene
                    key='profile'
                    hideNavBar
                >
                    <Scene key='profileview' initial component={ProfileForm} hideNavBar />
                    <Scene key='editProfileForm' component={EditProfileForm} hideTabBar />    
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
