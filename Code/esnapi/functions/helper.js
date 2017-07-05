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
    }    
}