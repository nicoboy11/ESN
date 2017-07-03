import React, { Component } from 'react';
import { ScrollView, View, Slider, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Input, DatePicker, ESModal, SplitButton, PersonSelect2 } from '../components';
import { Config, Helper } from '../settings';
const { texts, colors } = Config;

class EditTaskForm extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            ...props.taskData,
            isTeamModalVisible: false,
            project: { text: props.taskData.projectName, value: props.taskData.projectId },
            showAll: false
        };
    }

    onChangeDateStart() {

    }

    onChangeDateDue() {

    }

    onPrioritySelection() {

    }

    projectSelected(text, value) {
        this.setState({ project: { text, value }, isTeamModalVisible: false });
    }

    render() {
        const { rowStyle } = styles;
        return (
            <ScrollView>
                <View 
                    style={[
                                rowStyle, 
                                { 
                                    borderBottomWidth: 2, 
                                    borderBottomColor: colors.lightText,
                                    marginLeft: 10,
                                    marginRight: 10
                                }
                        ]}
                >
                    <Text style={{ fontSize: 20, paddingLeft: 10 }}>PEOPLE</Text>
                </View>
                <View style={rowStyle}>
                    <View 
                        style={{ 
                                flex: 1, 
                                flexDirection: 'row', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginLeft: 10,
                                marginRight: 10
                            }} 
                    >
                        <View style={{ flex: 1 }} >
                            <Text style={{ fontSize: 18 }}>Leader</Text>
                        </View>
                        <View style={{ flex: 1 }} >
                            <SplitButton 
                                elements={[
                                        { text: 'My network', id: false, isSelected: true },
                                        { text: 'Company', id: true }
                                ]}
                            />   
                        </View>                     
                    </View>
                    <PersonSelect2 
                        placeholder='Type a leader' 
                        showAll={this.state.showAll}
                        style={{ marginLeft: 5, marginRight: 5 }}
                    />
                </View>
                <View style={rowStyle}>
                    <View 
                        style={{ 
                                flex: 1, 
                                flexDirection: 'row', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginLeft: 10,
                                marginRight: 10
                            }} 
                    >
                        <View style={{ flex: 1 }} >
                            <Text style={{ fontSize: 18 }}>Collaborators</Text>
                        </View>
                        <View style={{ flex: 1 }} >
                            <SplitButton 
                                elements={[
                                        { text: 'My network', id: false, isSelected: true },
                                        { text: 'Company', id: true }
                                ]}
                            />   
                        </View>                     
                    </View>                
                    <PersonSelect2 
                        placeholder='Type a colaborator' 
                        showAll={this.state.showAll}
                        style={{ marginLeft: 5, marginRight: 5 }}
                    />                        
                </View>
                <View 
                    style={[
                                rowStyle, 
                                { 
                                    borderBottomWidth: 2, 
                                    borderBottomColor: colors.lightText,
                                    marginLeft: 10,
                                    marginRight: 10
                                }
                        ]}
                >
                    <Text style={{ fontSize: 20, paddingLeft: 10 }}>GENERAL INFO</Text>
                </View>               
                <View style={rowStyle}>
                    <Input 
                        label={texts.taskName} 
                        returnKeyType='next' 
                        onChangeText={(name) => this.setState({ name })}
                        value={this.state.name}
                        editable
                    />
                </View>
                <View style={rowStyle}>
                    <Input 
                        label={texts.taskDesc} 
                        returnKeyType='next' 
                        height={this.state.descHeight}
                        onChangeText={(description) => {
                            this.setState({ description });
                        }}
                        onContentSizeChange={(event) => this.setState({ descHeight: event.nativeEvent.contentSize.height })}
                        value={this.state.description}
                        editable
                        multiline
                    />     
                </View>
                <View style={rowStyle}>
                    <DatePicker 
                        label={texts.taskStart} 
                        onChangeDate={this.onChangeDateStart.bind(this)}
                        date={Helper.toDate(this.state.startDate)}
                        editable
                    />
                </View>
                <View style={rowStyle}>
                    <DatePicker 
                        label={texts.taskDue} 
                        onChangeDate={this.onChangeDateDue.bind(this)}
                        date={Helper.toDate(this.state.dueDate)}
                        editable
                    />
                </View>
                <View style={rowStyle}>
                    <TouchableOpacity
                        onPress={() => this.setState({ isTeamModalVisible: true })}
                    >
                        <Text>{this.state.project.text}</Text>
                    </TouchableOpacity>
                    <ESModal 
                        title={texts.projectSelect} 
                        visible={this.state.isTeamModalVisible} 
                        onSelection={(this.projectSelected.bind(this))}
                        selectedItem={this.props.taskData.projectId}
                        table='projects'
                    />   
                </View>
                <View style={rowStyle}>
                    <Text>Progress</Text>
                    <Slider minimumValue={0} maximumValue={100} />
                </View>
                <View style={rowStyle}>
                    <Text>Priority</Text>
                    <SplitButton 
                        elements={
                            [
                                { text: 'None', id: 1 },
                                { text: 'Low', id: 2 },
                                { text: 'Medium', id: 3 },
                                { text: 'High', id: 4, isSelected: true },
                                { text: 'Urgent', id: 5 },
                            ]
                        }
                    />
                </View>
                <View style={rowStyle}>
                    <Text>State</Text>
                    <SplitButton 
                        elements={
                            [
                                { text: 'Active', id: 1 },
                                { text: 'Ready', id: 2 },
                                { text: 'Completed', id: 3 }
                            ]
                        }
                    />
                </View>
            </ScrollView>
        );
    }
}

export { EditTaskForm };

const styles = new StyleSheet.create({
    rowStyle: {
        marginTop: 5,
        marginBottom: 10
    }
});
