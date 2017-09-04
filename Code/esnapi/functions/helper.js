module.exports = {
    /** fp* functions - format data for MySQL queries (fp stands for "format parameter")
     * 
     */
        fpVarchar: function(param){

            if(param == undefined)  return "NULL";
            //This allows use of string with single quotes on the content when inserting/updating data
            return "'" + param.replace("'","''") + "'";
        },
        fpDate: function(param){
            if(param == undefined)  return "NULL";
            if(param == "") return "NULL";

            return "'" + param + "'";
        },
        fpInt: function(param){

            if(param == undefined)  return "NULL";
            if(param == "") return "NULL";

            return param;
        },
        fpBool: function(param){

            if(param == undefined)  return "NULL";
            if(param == "") return "NULL";

            return param;
        },
    /** getDateISO - Format date to yyyy-MM-dd
     * 
     */
        getDateISO: function(year, month, day) {
            return year.toString() + '-' + 
                    ('00' + (month + 1).toString()).slice(-2) + '-' + 
                    ('00' + (day).toString()).slice(-2);
        },
    /** getTodayISO - Get current date/time with ISO format (yyyy-MM-dd hh:mm:ss)
     * 
     */
        getTodayISO: function() {
            var date = new Date();
            return date.getFullYear().toString() + '-' + 
                    ('00' + (date.getMonth() + 1).toString()).slice(-2) + '-' + 
                    ('00' + (date.getDate()).toString()).slice(-2) + ' ' +
                    ('00' + (date.getHours()).toString()).slice(-2) + ':' +
                    ('00' + (date.getMinutes()).toString()).slice(-2) + ':' +
                    ('00' + (date.getSeconds()).toString()).slice(-2);
        },
    /** sendNotifications - Send push notifications using Onesignal API 
     * 
     */
        sendNotification: function(data) { 
            // code obtained from documentation at https://documentation.onesignal.com/reference#create-notification 
            var headers = {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": "Basic NTFiOTMxYzctY2RlZS00OGJhLTg5OGItYjZlMjI1MDQ3MWVk"
            };
            
            var options = {
                host: "onesignal.com",
                port: 443,
                path: "/api/v1/notifications",
                method: "POST",
                headers: headers
            };
            
            var https = require('https');
            var req = https.request(options, function(res) {  
                res.on('data', function(data) {
                console.log("Response:");
                console.log(JSON.parse(data));
                });
            });
            
            req.on('error', function(e) {
                console.log("ERROR:");
                console.log(e);
            });
            
            req.write(JSON.stringify(data));
            req.end();
        } 
}