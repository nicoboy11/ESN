import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Image, 
    StyleSheet, 
    Animated,
    TouchableOpacity,
    Dimensions,
    Easing
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Config, Helper } from '../settings';
import { Menu, Header } from './';

const { texts, colors } = Config;

class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: new Animated.Value(0),
            isOpen: false,
            screen: Dimensions.get('screen')
        };
    }

    onLeft() {
        switch (this.props.leftIcon) {
            case 'menu':
                this.toogle();
                return; 
            default:
                return;
        }
    }

    onRight() {
        switch (this.props.rightIcon) {
            case 'menu':
                this.toogle();
                return; 
            default:
                this.props.onPressRight();
                return;
        }
    }

    toogle() {
        const initValue = this.state.isOpen ? this.state.screen.width - 100 : 0;
        const endValue = this.state.isOpen ? 0 : this.state.screen.width - 100;
        const elastic = this.state.isOpen ? 0 : 1;

        this.setState({ isOpen: !this.state.isOpen });

        this.state.width.setValue(initValue);
        Animated.timing(this.state.width, {
            toValue: endValue,
            duration: 400,
            easing: Easing.elastic(elastic)
        }).start();        
    }    

    renderList() {
        const {
            menuListStyle,
            menuListContainerStyle
        } = styles;

        if (this.props.menuList === undefined) {
            return;
        }

        return this.props.menuList.map(element => 

            (<TouchableOpacity 
                key={element.form}
                onPress={() => { 
                                    this.toogle(); 
                                    if (element.form === 'authentication') {
                                        Helper.logout();
                                    }
                                    Actions[element.form]({ personId: element.id }); 
                                }}
                style={menuListContainerStyle}
            >
                <Text style={menuListStyle}>{element.name}</Text>
            </TouchableOpacity>)

        );
    }

    render() {
        const {
            leftIcon,
            rightIcon,
            title
        } = this.props;

        const isVisible = this.props.isVisible || true;

        const {
            wrapperStyle,
            menuStyle,
        } = styles;

        return (
            <View 
                style={wrapperStyle} 
                onLayout={() => this.setState({ 
                    screen: Dimensions.get('screen') 
                })}
            >
                <Animated.View style={{ right: this.state.width, width: this.state.screen.width }}>
                    <Header 
                        onPressLeft={this.onLeft.bind(this)}
                        onPressRight={this.onRight.bind(this)}
                        rightIcon={rightIcon}
                        leftIcon={leftIcon}
                        title={title}
                        isVisible={isVisible}
                    />                
                    <View style={{ flex: 1 }}>
                        {this.props.children}
                    </View>
                </Animated.View>
                <Animated.View style={[menuStyle, { right: this.state.width, width: this.state.width }]}>
                    {this.renderList()}
                </Animated.View>                
            </View>
        );
    }
}

const styles = new StyleSheet.create({
    wrapperStyle: {
        flex: 1,
        flexDirection: 'row'
    },
    menuStyle: {
        backgroundColor: colors.contrastColor
    },
    menuListContainerStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.contrastColorDark,
        justifyContent: 'flex-start',
        alignContent: 'center'
    },
    menuListStyle: {
        color: colors.mainText,
        fontSize: 18
    }
});

export { Form };
