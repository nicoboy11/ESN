var formidable = require("formidable");
var config = require('../config.json');

var self = module.exports = {
        
    db: function(sql,conn,callback){
        try{
            conn.connect(function(err){

                if(err) console.log(err.message);

                console.log("Executing: " + sql);
                console.log("conected!");

                conn.query(sql,callback);

            });
        }
        catch(err){
            console.log("sqlErr" + err.message);
        }
    },

    /** handle - Error Handling 
     * 
     *      Returns True if everything is OK, false if there was an Error
     * 
     *  @param {If there is an error in the database}    error (object)
     *  @param {The response from the server}            res   (object)
     *  @param {It this is the error I want to show}     show  (bool)
        */
        handle: function(error,res,show){
            if(error){
                var message = error.message.replace(error.code,"").replace(":","").trim();

                console.log("Error Handle: " + message);

                if(show){
                    res.status(422).end( self.responseMsg(message) );
                }
                console.log("is returning")
                return false;
            }

            return true;
        },
    /** responseMsg -
     * 
     */
        responseMsg: function(mensaje){
            return JSON.stringify({"message":mensaje});
        },

    /** handleResponse -
     * 
     */
        handleResponse: function(result,res,errorMessage){

            if(errorMessage == undefined) errorMessage = "";

            if(result != undefined && result[0] != undefined ){
                if(result[0].length == 0){
                    if(errorMessage == ""){
                        res.status(200).end( "[]" );
                    }
                    else{
                        res.status(401).end( self.responseMsg(errorMessage) );
                    }
                }
                else{
                    res.status(200).end( JSON.stringify(result[0]) );
                }
            }
            else{
                res.status(200).end( self.responseMsg("Ok") );
            }
        },

    /** reqUpload - Upload files
     * 
     * @param {The http request} req 
     * @param {What is the file for? (avatar, post, post message, group, Task, Task Message, Chat)} type 
     * @param {What field needs to be read to name the uploaded file} field 
     * @param {Callback function} callback
     */
        reqUpload: function(req, type, field, callback){
            /**

            file structure

            uploads/

                avatars: avt_[personId]
                
                photo in post: ph_pst_[postId]
                file in post:  fl_pst_[postId]

                photo in post message: ph_pstm_[postMessageId]
                file in post message:  fl_pstm_[postMessageId]

                photo in group: ph_grp_[groupId]
                file in group: fl_grp_[groupId]
                photo in task: ph_tk_[taskMessageId]
                file in task: fl_tk_[taskMessageId]
                photo in chat: ph_ch_[postId]
                file in task: fl_ch_[postId]
            */

            var form = new formidable.IncomingForm();
            var fileName = '';
            var uniq = new Date().getTime() / 1000;
            var params = {};

            form.parse(req);
            form.on('field', function(name, value){
                params[name] = value;
            }) 
            .on('fileBegin',function(name, file){
                fileName = config.prefixes[type]
                fileName = fileName + (isNaN(field)?params[field]:field) + '_' + uniq + '.' + file.type.split('/')[1];
                file.path = './uploads/' + fileName;
                params['fileName'] = fileName;
                console.log('file created!');
            })
            .on('progress',function(bytesReceived, bytesExpected){
                console.log('progress: ' + bytesReceived + ' : ' + bytesExpected);
            })        
            .on('end',function(){
                if(fileName === ''){
                    fileName = undefined;
                    callback(fileName, params);
                } else {//If file exists - create a thumb copy
                    if(type=='avatar') {
                        console.log('started small thumb');
                        self.resize(fileName, 'small', function(success) {
                            console.log('finished small thumb');
                        });
                        console.log('started big thumb');
                        self.resize(fileName, 'big', function(success){
                            console.log('finished big thumb');
                            callback(fileName, params);
                        });
                    } else {
                        self.dequalify(fileName,function(success) {
                            callback(fileName, params);
                        });
                    }
                }

                
            })
            .on('error', function(err){
                console.log('upload Error:' + err.message);
                callback();
            })
        },

        resize: function (fileName, size, callback) {
            require('lwip').open('./uploads/' + fileName, function(err, image) {
                if(err) {
                    console.log('Could not generate thumb');
                } else {
                    var maxWidth;
                    
                    switch(size) {
                        case 'small':
                            maxWidth = 96
                            break;
                        case 'big':
                            maxWidth = 349
                            break;
                        default:
                            maxWidth = 44
                            break;
                    }

                    image.batch()
                        .cover(maxWidth,maxWidth)
                        .writeFile('./uploads/thumbs/' + size + '/' + fileName, function(err) {
                            if(err) {
                                callback(false);
                            } else {
                                callback(true);
                            }
                        });                             
                }
            });           
        },

       dequalify: function (fileName, callback) {
           console.log('opening: ' + fileName);
            require('lwip').open('./uploads/' + fileName, function(err, image) {
                if(err) {
                    console.log('Could not generate thumb');
                } else {
                    image.batch()
                        .cover(200,200)
                        .blur(5)
                        .writeFile('./uploads/thumbs/blured/' + fileName, function(err) {
                            if(err) {
                                callback(false);
                            } else {
                                callback(true);
                            }
                        });                             
                }
            });  
       }       
}