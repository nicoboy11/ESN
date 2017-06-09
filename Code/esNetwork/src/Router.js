import React from 'react';
import { StyleSheet } from 'react-native';
import { Input } from './components/Input';
import { Scene, Router, Actions } from 'react-native-router-flux';
import LoginForm from './pages/LoginForm';
import MainForm from './pages/MainForm';
import { colors } from './config';

const RouterComponent = () => {
    return (
        <Router> 
            <Scene initial key='authentication'>
                <Scene hideNavBar key='login' component={LoginForm} />
            </Scene>   
            <Scene key='main'>
                <Scene 
                    key='mainForm' 
                    component={MainForm} 
                    leftButtonImage={require('./img/wmnu.png')} 
                    leftButtonIconStyle={styles.imageStyle}
                    onLeft={() => console.log('openMenu')}
                    rightButtonImage={require('./img/wsearch.png')}
                    rightButtonIconStyle={styles.imageStyle}
                    onRight={() => console.log('openSearch')}
                    title='Feed'
                    navigationBarStyle={styles.navBarStyle}
                    titleStyle={styles.textStyle}
                />
            </Scene>               
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
