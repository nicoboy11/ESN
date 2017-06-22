<?php
/*
include 'route.php';


echo $_SERVER['REQUEST_URI'];

*/
?>
<!DOCTYPE HTML>
<html>
   <head>
	
      <script type="text/javascript">

        

            var ws = new WebSocket("ws://localhost:9998/task");

            ws.onopen = function()
            {
                console.log('connected');
            };

            ws.onmessage = function (evt) 
            { 
                var received_msg = evt.data;
                var inner = document.getElementById("messages").innerHTML;
                inner += "<br />" + "<div>"+received_msg+"</div>";

                document.getElementById("messages").innerHTML = inner;
                console.log('Message Received');
            };
            
            ws.onclose = function()
            { 

                alert("Connection is closed..."); 
            };            
        function close(){
            ws.send("even salió");
            ws.close();
        }

        function sendMessage() {
            var msg = document.getElementById('message').value;
            var roomId = document.getElementById('room').value;
            var personId = document.getElementById('person').value;
            ws.send('{"room":' + roomId + ',"personId":' + personId + ',"message":"' + msg + '"}');
        }

        function join() {
            var roomId = document.getElementById('room').value;
            var personId = document.getElementById('person').value;
            ws.send('{"newConnectionxxx":0,"room":' + roomId + ',"personId":' + personId + '}');
        }

      </script>
		
   </head>
   <body>
   
      <div id="sse">
            <a href="javascript:close()">Close</a><br /><br />
	    PersonId: <input id="person" type="text" /><br />
	    Room: <input id="room" type="text" />
	    <a href="javascript:join()">Join</a><br /><br />
	    Message: <input id="message" type="text" />
            <a href="javascript:sendMessage()">Send Message</a>
            <div id="messages">

            </div>
      </div>
      
   </body>
</html>
