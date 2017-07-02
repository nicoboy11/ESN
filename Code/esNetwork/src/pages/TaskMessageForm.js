import React, { Component } from 'react';
import { 
    Text, 
    View, 
    TouchableOpacity, 
    StyleSheet, 
    Image, 
    Alert, 
    DatePickerAndroid, 
    Slider,
    Modal
} from 'react-native';
import { Chat, Form, Avatar, LinkButton, SimpleModal, PersonSelect, ModalView } from '../components';
import { CheckListForm } from './';
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
                isLeaderVisible: false
            }

    onError(error) {
        this.setState({ newState: null });
        Alert.alert('Error', error.message);
    }
    
    onSuccessState(responseData) {
        if (this.state.status > 299) {
            console.log('error');
        } else {
            this.setState({ stateId: this.state.newState });
        }
    }  

    onSuccessDueDate(responseData) {
        if (this.state.status > 299) {
            console.log('error');
        } else {
            this.setState({ dueDate: this.state.newDueDate });
        }
    }  

    onSuccessProgress(responseData) {
        if (this.state.status > 299) {
            console.log('error');
        } else {
            this.setState({ progress: this.state.newSliderValue });
        }
    }

    onSuccessLeader(responseData) {
        if (this.state.status > 299) {
            console.log('error');
        } else {
            this.setState({ dueDate: this.state.newDueDate });
        }        
    }

    onHandleResponse(response) {
        console.log(response.status);
        this.setState({ status: response.status });
        return response.json();
    }     

    async showDatePicker() {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                date: (this.props.dueDate === null) ? new Date() : Helper.toDate(this.props.dueDate)
            });

            if (action !== DatePickerAndroid.dismissedAction) {
                const dateISO = Helper.getDateISO(year, month, day);
                this.setState({ newDueDate: dateISO });

                Database.request(
                    'PUT', 
                    'task', 
                    {
                        taskId: this.props.taskId,
                        dueDate: dateISO
                    }, 
                    1,
                    this.onHandleResponse.bind(this), 
                    this.onSuccessDueDate.bind(this),
                    this.onError.bind(this)
                ); 
            }
        } catch ({ code, message }) {
            console.log('Could not load date picker');
        }
    }

    changeState() {
        let newState = this.state.stateId;
        //if task is Active
        if (this.state.stateId === 1) {
           newState = 2;
        } else {
            newState = 1;
        }

        this.setState({ newState });
        Database.request(
            'PUT', 
            'task', 
            {
                taskId: this.props.taskId,
                stateId: newState
            }, 
            1,
            this.onHandleResponse.bind(this), 
            this.onSuccessState.bind(this),
            this.onError.bind(this)
        );         
    }  

    openSelection(text, value) {
        if (value === 'EL') {
            this.setState({ isLeaderVisible: true, isEditVisible: false });
        }
    }

    renderCreator() {
        const creator = JSON.parse(this.props.creator);
        return creator.map(creatorPerson => (
            <Avatar 
                key={creatorPerson.personId}
                avatar={
                            (creatorPerson.avatar.length > 2) ? 
                            Config.network.server + creatorPerson.avatar : 
                            creatorPerson.avatar
                        }
                color={creatorPerson.theme}
                size='medium'
            />
        ));        
    }

    renderResponsible() {
        let leader = JSON.parse(this.props.leader);

        if (leader === null) {
            leader = JSON.parse(this.props.creator);
            if (leader === null) {
                return <View />;
            }
        } 

        return leader.map(leaderPerson => (
            <Avatar 
                key={leaderPerson.personId}
                avatar={
                            (leaderPerson.avatar.length > 2) ? 
                            Config.network.server + leaderPerson.avatar : 
                            leaderPerson.avatar
                        }
                color={leaderPerson.theme}
                size='mini'
            />
        ));
    } 

    renderCollaborators() {
        const collaborators = JSON.parse(this.props.collaborators);
        if (collaborators === null) {
            return <View />;
        }

        return collaborators.map(collaborator => 
            (
                <Avatar 
                    key={collaborator.personId}
                    avatar={
                                (collaborator.avatar.length > 2) ? 
                                network.server + collaborator.avatar : 
                                collaborator.avatar
                            }
                    color={collaborator.theme}
                    size='mini'
                />
            )
        );
    }

    renderSlider() {
        if (this.state.showSlider) {
            return (
                    <View style={styles.mainContainerStyle}>
                        <Slider 
                            style={{ flex: 1 }}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            value={this.state.newSliderValue}
                            onValueChange={(val) => this.setState({ newSliderValue: val })}
                        />
                        <LinkButton 
                            title='Ok'
                            onPress={() => {
                                this.setState({ showSlider: false });
                                Database.request(
                                    'PUT', 
                                    'task', 
                                    {
                                        taskId: this.props.taskId,
                                        progress: this.state.newSliderValue 
                                    }, 
                                    1,
                                    this.onHandleResponse.bind(this), 
                                    this.onSuccessState.bind(this),
                                    this.onError.bind(this)
                                );                                   
                            }}  
                        />
                    </View>            
            );
        }

        return <View />;
    }

    renderForm() {
        if (this.state.isChatVisible) {
            return <Chat taskId={this.props.taskId} />;
        }

        return <CheckListForm />;
    }

    render() {
        const { 
            avatarContainer, 
            infoContainerStyle,
            infoStyle,
            mainContainerStyle,
            dateContainerStyle
        } = styles;
        return (
            <Form
                leftIcon='back'
                rightColor={colors.clickable}
                rightIcon='more'
                onPressRight={() => this.setState({ isEditVisible: true })}
                title={this.props.name}
            >
                {/*<View style={mainContainerStyle}>
                    <View style={infoStyle}>
                        <View style={infoContainerStyle}>
                            <LinkButton 
                                title={(this.props.project === null) ? 
                                texts.addProject : 
                                this.props.projectName} 
                            />
                        </View>
                        <View style={avatarContainer}>
                            {this.renderResponsible()}
                            {this.renderCollaborators()}
                        </View>                        
                    </View>
                    <View style={dateContainerStyle}>
                        <TouchableOpacity>
                            <Text
                                style={{ color: Helper.prettyfyDate(this.props.dueDate).color }}
                            >
                                {Helper.prettyfyDate(this.props.dueDate).date}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.changeState.bind(this)}
                        >
                            <View>
                                <Image 
                                    tintColor={
                                        (this.state.stateId === 1) ?
                                        colors.secondText :
                                        colors.main
                                    }
                                    source={{ 
                                            uri: (this.state.stateId === 1) ?
                                                'unchecked' :
                                                'checked'
                                        }} 
                                    style={{
                                        height: 30,
                                        width: 30
                                    }}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>                    
                </View>*/}
                <View style={mainContainerStyle}>
                    <TouchableOpacity>
                        {this.renderCreator()}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.showDatePicker.bind(this)}>
                        <Text
                            style={{ color: (this.state.dueDate !== null) ? Helper.prettyfyDate(this.props.dueDate).color : colors.clickable }}
                        >
                            {(this.state.dueDate !== null) ? Helper.prettyfyDate(this.state.dueDate).date : 'Due date'}
                        </Text>                        
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.setState({ showSlider: !this.state.showSlider, newSliderValue: this.state.progress })}
                    >
                        <Text
                            style={{ color: colors.clickable }}
                        >
                            {`${this.state.newSliderValue} %`}
                        </Text>                           
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text
                            style={{ color: colors.clickable }}
                        >
                            00:00
                        </Text>                             
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            source={{ uri: 'edit' }} 
                            tintColor={colors.clickable}
                            style={{ width: 23, height: 23 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.setState({ isChatVisible: !this.state.isChatVisible })}
                    >
                        <Image
                            source={{ uri: 'checkList' }} 
                            tintColor={colors.clickable}
                            style={{ width: 23, height: 23 }}
                        />
                    </TouchableOpacity>                                                                                                   
                </View>
                {this.renderForm()}
                {this.renderSlider()}
                <SimpleModal 
                    title={texts.editTask} 
                    visible={this.state.isEditVisible} 
                    onSelection={this.openSelection.bind(this)}
                    autoclose
                    elements={
                        [
                            { text: 'Edit leader', value: 'EL' },
                            { text: 'Edit collaborators', value: 'EC' }
                        ]
                    }
                />
                <ModalView
                    visible={this.state.isLeaderVisible}
                    onRequestClose={() => this.setState({ isLeaderVisible: false })}
                >
                    <PersonSelect
                        title={'Select a leader'} 
                        onSelection={this.selectedPerson.bind(this)}
                        autoclose
                        itemType='people'
                    />     
                </ModalView>           
            </Form>
        );
    }
}

const styles = new StyleSheet.create({
    avatarContainer: {
        flexDirection: 'row'
    },
    mainContainerStyle: {
        backgroundColor: colors.background,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.mainDark
    },
    infoContainerStyle: {
        flex: 4
    },
    dateContainerStyle: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    infoStyle: {
        flexDirection: 'column',
        flex: 4
    }
});

export { TaskMessageForm };
