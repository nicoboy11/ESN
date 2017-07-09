module.exports = {
    fpVarchar: function(param){

        if(param == undefined)  return "NULL";

        return "'" + param + "'";
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
    getDateISO: function(year, month, day) {
        return year.toString() + '-' + 
                ('00' + (month + 1).toString()).slice(-2) + '-' + 
                ('00' + (day).toString()).slice(-2);
    },
    getTodayISO: function() {
        var date = new Date();
        return date.getFullYear().toString() + '-' + 
                ('00' + (date.getMonth() + 1).toString()).slice(-2) + '-' + 
                ('00' + (date.getDate()).toString()).slice(-2) + ' ' +
                ('00' + (date.getHours()).toString()).slice(-2) + ':' +
                ('00' + (date.getMinutes()).toString()).slice(-2) + ':' +
                ('00' + (date.getSeconds()).toString()).slice(-2);
    }        
}