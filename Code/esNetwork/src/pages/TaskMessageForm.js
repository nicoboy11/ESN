import React, { Component } from 'react';
import { 
    View, 
    TouchableOpacity, 
    StyleSheet, 
    Image,
    KeyboardAvoidingView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Chat, Form } from '../components';
import { CheckListForm, EditTaskForm } from './';
import { Helper, Config, Database } from '../settings';

const { network, colors, texts } = Config;

class TaskMessageForm extends Component {
    state = { 
                stateId: this.props.stateId, 
                newState: null, 
                dueDate: this.props.dueDate,
                newDueDate: null,
                showSlider: false,
                progress: this.props.progress,
                newSliderValue: this.props.progress,
                isChatVisible: true,
                isEditVisible: false,
                isLeaderVisible: false,
                taskData: this.props
            }

    onUpdateChild(updatedTask) {
        this.setState({ taskData: updatedTask });
    }

    renderForm() {
        if (this.state.isChatVisible) {
            return (
                    <Chat taskId={this.props.taskId} />
            );
        } else if (this.state.isCheckVisible) {
            return <CheckListForm />;
        } else if (this.state.isEditVisible) {
            return <EditTaskForm onUpdateChild={this.onUpdateChild.bind(this)} taskData={this.props} />;
        }

        return <View />;
    }

    render() {
        const { 
            mainContainerStyle,
        } = styles;
        return (
            <Form
                leftIcon='back'
                data={this.state.taskData}
                title={this.state.taskData.name}
                shadow={false}
                onPressLeft={() => Actions.pop()}
            >
                <View style={mainContainerStyle}>
                    <TouchableOpacity
                        onPress={() => this.setState(
                            { 
                                isChatVisible: true,
                                isCheckVisible: false,
                                isEditVisible: false
                            }
                        )}
                    >
                        <Image 
                            source={{ uri: 'chat' }} 
                            tintColor={(this.state.isChatVisible) ? colors.main : colors.secondText}
                            style={{ width: 23, height: 23, tintColor: (this.state.isChatVisible) ? colors.main : colors.secondText }}                        
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.setState(
                            { 
                                isChatVisible: false,
                                isCheckVisible: true,
                                isEditVisible: false
                            }
                        )}
                    >
                        <Image
                            source={{ uri: 'checkList' }} 
                            tintColor={(this.state.isCheckVisible) ? colors.main : colors.secondText}
                            style={{ width: 23, height: 23, tintColor: (this.state.isCheckVisible) ? colors.main : colors.secondText }}
                        />
                    </TouchableOpacity>        
                    <TouchableOpacity
                        onPress={() => this.setState(
                            { 
                                isChatVisible: false,
                                isCheckVisible: false,
                                isEditVisible: true
                            }
                        )}
                    >
                        <Image
                            source={{ uri: 'edit' }} 
                            tintColor={(this.state.isEditVisible) ? colors.main : colors.secondText}
                            style={{ width: 23, height: 23, tintColor: (this.state.isEditVisible) ? colors.main : colors.secondText }}
                        />
                    </TouchableOpacity>                                                                                                                   
                </View>
                <View style={{ flex: 1 }}>
                    {this.renderForm()}
                </View>
            </Form>
        );
    }
}

const styles = new StyleSheet.create({
    mainContainerStyle: {
        backgroundColor: colors.background,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.mainDark,
        zIndex: 99
    }
});

export { TaskMessageForm };
