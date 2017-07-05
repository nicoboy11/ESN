import React, { Component } from 'react';
import Router from './Router';
import { Database } from './settings';

export default class App extends Component {
  componentWillMount() {
      Database.request('GET', 'gender/null', {}, 0,
          this.onHandleResponse.bind(this), 
          this.onSuccessGender.bind(this),
          this.onError.bind(this)
      );  

      Database.request('GET', 'attachmentType/null', {}, 0,
          this.onHandleResponse.bind(this), 
          this.onSuccessAttachmentType.bind(this),
          this.onError.bind(this)
      );  

      Database.request('GET', 'scopeType/null', {}, 0,
          this.onHandleResponse.bind(this), 
          this.onSuccessScopeType.bind(this),
          this.onError.bind(this)
      );  

      Database.request('GET', 'roleType/null', {}, 0,
          this.onHandleResponse.bind(this), 
          this.onSuccessRoleType.bind(this),
          this.onError.bind(this)
      );  

      Database.request('GET', 'stateType/null', {}, 0,
          this.onHandleResponse.bind(this), 
          this.onSuccessStateType.bind(this),
          this.onError.bind(this)
      );  

      Database.request('GET', 'messageType/null', {}, 0,
          this.onHandleResponse.bind(this), 
          this.onSuccessMessageType.bind(this),
          this.onError.bind(this)
      );  

      Database.request('GET', 'priority/null', {}, 0,
          this.onHandleResponse.bind(this), 
          this.onSuccessPriority.bind(this),
          this.onError.bind(this)
      );                          
  }

  onHandleResponse(response) {
      let data = { response: {}, status: {} };
      data.response = response.json();
      data.status = response.status;
      return data;
  }

  onSuccessGender(responseData) {
      if (responseData.status > 299) {
          console.log('error');
      } else {
          Database.realm('Gender', responseData.response, 'create', '');
      }
  }
  
  onSuccessAttachmentType(responseData) {
      if (responseData.status > 299) {
          console.log('error');
      } else {
          Database.realm('AttachmentType', responseData.response, 'create', '');
      }
  }

  onSuccessScopeType(responseData) {
      if (responseData.status > 299) {
          console.log('error');
      } else {
          Database.realm('ScopeType', responseData.response, 'create', '');
      }
  }

  onSuccessRoleType(responseData) {
      if (responseData.status > 299) {
          console.log('error');
      } else {
          Database.realm('RoleType', responseData.response, 'create', '');
      }
  }

  onSuccessStateType(responseData) {
      if (responseData.status > 299) {
          console.log('error');
      } else {
          Database.realm('StateType', responseData.response, 'create', '');
      }
  }

  onSuccessMessageType(responseData) {
      if (responseData.status > 299) {
          console.log('error');
      } else {
          Database.realm('MessageType', responseData.response, 'create', '');
      }
  }

  onSuccessPriority(responseData) {
      if (responseData.status > 299) {
          console.log('error');
      } else {
          Database.realm('Priority', responseData.response, 'create', '');
      }
  }            

  onError(error) {
      console.log(error.message);
  }

  render() {
    return (
        <Router />
    );
  }
}
