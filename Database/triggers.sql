/*-----------------TRIGGERS--------------------------*/
/*	
-------REGISTER
- when user created: create a post saying new user created (messageType - Log)
	give him a welcome
*/
DROP TRIGGER IF EXISTS `tgNewPerson`;
DELIMITER $$
CREATE TRIGGER `tgNewPerson` AFTER INSERT ON `person`
 FOR EACH ROW BEGIN
 
 	INSERT INTO post (personId,message,messageTypeId,attachment,attachmentTypeId,scopeTypeId,scopeId,creationDate)
	VALUES(NEW.id,CONCAT(NEW.names,' ',NEW.firstLastName,' just joined the company. Type a welcome message!'),2,NULL,NULL,1,NULL,NOW());
    
END$$

/*    
-------TASKS
	- 	when user task created: in the chat add 'user created task'
*/
DROP TRIGGER IF EXISTS `tgNewTask`;
DELIMITER $$
CREATE TRIGGER `tgNewTask` AFTER INSERT ON `task`
 FOR EACH ROW BEGIN
 
	INSERT INTO taskMessage (taskId, personId, message, messageTypeId, attachment, attachmentTypeId, messageDate)
    VALUES(NEW.id, NEW.creatorId, CONCAT('Task created by ',getFullName(NEW.creatorId)), 2, NULL, NULL, NOW() );        
    
END$$
/*    
    -	when something in the task changes: the date changed, text renamed, etc
    -	when status changed (finished, completed, etc)    
    */
DROP TRIGGER IF EXISTS `tgEditTask`;
DELIMITER $$
CREATE TRIGGER `tgEditTask` AFTER UPDATE ON `task`
 FOR EACH ROW BEGIN
 
	DECLARE _state varchar(50);
    
    IF(NEW.name != OLD.name) THEN
		INSERT INTO taskMessage (taskId, personId, message, messageTypeId, attachment, attachmentTypeId, messageDate)
		VALUES(NEW.id, NEW.creatorId, CONCAT(getFullName(NEW.id),' renamed task to ', NEW.name), 2, NULL, NULL, NOW() );           
    END IF;
 
	IF(NEW.dueDate != OLD.dueDate) THEN
		INSERT INTO taskMessage (taskId, personId, message, messageTypeId, attachment, attachmentTypeId, messageDate)
		VALUES(NEW.id, NEW.creatorId, CONCAT(getFullName(NEW.id),' changed due date to ', formatDate(NEW.dueDate)), 2, NULL, NULL, NOW() );      
    END IF;
    
	IF(NEW.projectId != OLD.projectId) THEN
		INSERT INTO taskMessage (taskId, personId, message, messageTypeId, attachment, attachmentTypeId, messageDate)
		VALUES(NEW.id, NEW.creatorId, CONCAT(getFullName(NEW.id),' moved task to a different project '), 2, NULL, NULL, NOW() );      
    END IF;    
    
	IF(NEW.stateId != OLD.stateId) THEN
    		
        SELECT description INTO _state
        FROM stateType
        WHERE id = NEW.stateId;
    
		INSERT INTO taskMessage (taskId, personId, message, messageTypeId, attachment, attachmentTypeId, messageDate)
		VALUES(NEW.id, NEW.creatorId, CONCAT(getFullName(NEW.id),' change task to ',_state), 2, NULL, NULL, NOW() );      
    END IF;      

END$$


/*
    -	when someone added to task: user joined the task
--------USERS
	-	When someone becomes boss or employee of someone (x joined y team)
    -	When someone follows someone else
		
*/
