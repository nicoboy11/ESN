$(document).ready(function(){

    window.onload = load();

    function load(){

        if(localStorage['token']) {
            getNetwork();
            $("#loginScreen").css("display", "none");
        } else {
            logOut();
        }
        

    }

    function logIn(){

        $.ajax({    type:"POST",
                    url:"http://ec2-34-211-203-109.us-west-2.compute.amazonaws.com:3001/loginUser",
                    beforeSend:function(){},
                    complete:function(){},
                    data:{email:$("#inpt_email").val(), password:$("#inpt_password").val()},
                    dataType:"json",
                    success:function(data)
        {  
            
           localStorage['token'] = data[0].token;
           localStorage['personId'] = data[0].personId;
           $("#loginScreen").css("display", "none");
            
        },error:function(jqXHR, textStatus, errorThrown){
            console.log("Error, status = " + textStatus + ", " +
            "error thrown: " + jqXHR.responseText);
            alert(JSON.parse(jqXHR.responseText).message);
        }});        
    }

    function getNetwork(){
        $.ajax({    type:"GET",
                    url:"http://ec2-34-211-203-109.us-west-2.compute.amazonaws.com:3001/network/" + localStorage['personId'],
                    headers: {"Authorization": "Bearer " + localStorage['token']},
                    complete:function(){},
                    data:{},
                    dataType:"json",
                    success:function(data)
        {  
            for(var i = 0; i < data.length; i++){
                var listItem = '<DIV class="avtOutterContainer">';
                listItem += '<DIV style="display:flex; flex: 1;height: 55px;">' + avatar(data[i].avatar, data[i].person, data[i].theme, 'veryBig') + '</DIV>';
                listItem += '<DIV style="display:flex; flex: 2;height: 55px;background-color: #F7F9FB">' + progressBar(data[i].ActiveTasks,data[i].Completed,data[i].TotalTasks) + '</DIV>';
                listItem += '</DIV>';
                $("#statsDiv").append(listItem);
            }            
        },error:function(jqXHR, textStatus, errorThrown){
            logOut();
        }});           
    }

    function logOut(){
        localStorage['token'] = undefined;
        localStorage['personId'] = undefined;
        $("#loginScreen").css("display", "block");
    }

    $(document).on("click", "#btn_login", function(){
        logIn();
    });

    $(document).on("click", "#btn_logout", function(){
        logOut();
    });    

});