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

        

            var ws = new WebSocket("ws://localhost:9998/echo");

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
            ws.send(msg);
        }

      </script>
		
   </head>
   <body>
   
      <div id="sse">
            <a href="javascript:close()">Close</a><br /><br />
            <input id="message" type="text" />
            <a href="javascript:sendMessage()">Send Message</a>
            <div id="messages">

            </div>
      </div>
      
   </body>
</html>