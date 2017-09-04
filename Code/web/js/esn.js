$(document).ready(function(){

    window.onload = load();

    function load(){



            $.ajax({    type:"GET",
                        url:"http://http://ec2-34-211-203-109.us-west-2.compute.amazonaws.com:3001/personTasks/1/1",
                        beforeSend:function(){  },
                        complete:function(){},
                        data:{},
                        dataType:"json",
                        success:function(data)
            {  
                
                var tasks = '';

                for(var i = 0; i < data.length; i++){
                    tasks += '<li>' + task('new task', 'project', {avatar: 'ES', name:'Even Sosa', theme: '#4F5A23', size: 'medium'}) + '</li>';
                }

                $("#leftDiv").html('<ul>' + tasks + '</ul>');                
                
            },error:function(jqXHR, textStatus, errorThrown){
                console.log("Error, status = " + textStatus + ", " +
                "error thrown: " + errorThrown);
            }});
    }

});