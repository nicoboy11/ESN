CALL CreateScopeType('All');
CALL CreateScopeType('Team');
CALL CreateScopeType('Project');
CALL CreateScopeType('Users');

CALL CreateRoleType('Creator');
CALL CreateRoleType('Leader');
CALL CreateRoleType('Collaborator');
CALL CreateRoleType('Administrator');

CALL CreateStateType('Active');
CALL CreateStateType('Inactive');
CALL CreateStateType('In progress');

CALL CreateAttachmentType('File');
CALL CreateAttachmentType('Photo');
CALL CreateAttachmentType('Audio');
CALL CreateAttachmentType('Video');

CALL CreateMessageType('Message');
CALL CreateMessageType('Log');

CALL CreatePerson('Even','Sosa','Rodríguez','1985-10-23','even.sosa@gmail.com','07731917608','','password',NULL,'','token123',1);
CALL CreatePerson('Paulina','Orihuela','Pérez','1988-04-20','paulina_o_16@hotmail.com','0448341414939','1334','password',1,'avt/xjalkd.png','token123',1);

CALL CreatePerson('Julianne','Hadyn','Fear','1970-02-20','julianne@testcorp.com','0432684512','','password',1,'avt/xjalkd1.png','token123',3);
CALL CreatePerson('Hailee','Murray','Aaron','1978-04-02','hailee@testcorp.com','985324565','','password',1,'avt/xjalkd2.png','token123',3);
CALL CreatePerson('Jeremiah','Betony','Stack','1981-06-10','jeremiah@testcorp.com','8542312565','1220','password',2,'avt/xjalkd3.png','token123',3);
CALL CreatePerson('Kaelea','Shelly','Blanchard','1973-08-24','kaelea@testcorp.com','7845463204','1222','password',2,'avt/xjalkd4.png','token123',3);
CALL CreatePerson('Cary','Lainey','Linwood','1950-09-14','cary@testcorp.com','1305246852','1210','password',3,'avt/xjalkd5.png','token123',3);
CALL CreatePerson('Sara','Cleve','Denzil','1991-07-01','sara@testcorp.com','2105684565','1210','password',3,'avt/xjalkd6.png','token123',3);
CALL CreatePerson('Harvie','Flower','Carlisle','1988-04-18','harvie@testcorp.com','2013254865','1211','password',4,'avt/xjalkd7.png','token123',3);
CALL CreatePerson('Bernard','Greg','Dukes','1990-12-06','bernard@testcorp.com','4652465204','1332','password',4,'avt/xjalkd8.png','token123',3);
CALL CreatePerson('Sandy','Wendy','Banks','1986-11-19','sandy@testcorp.com','9874563152','1332','password',5,'avt/xjalkd.png9','token123',3);
CALL CreatePerson('Barbara','Jamie','Macy','1988-03-13','barbara@testcorp.com','0546253512','1215','password',11,'avt/xjalkd.png10','token123',3);
CALL CreatePerson('Katy','James','Morrison','1982-03-21','katy@testcorp.com','46525795','1215','password',11,'avt/xjalkd.png10','token123',3);
CALL CreatePerson('Santiago','Narvaez','González','1949-05-12','santiago@testcorp.com','9958745852','1210','password',11,'avt/xjalkd11.png','token123',3);

CALL CreatePost(1,'This is my first post. Welcome!', 1, NULL, NULL, 1, NULL);

CALL CreateFollower(2,1);
CALL CreateFollower(1,2);
CALL CreateFollower(3,1);
CALL CreateFollower(3,2);

CALL CreatePostMessage(1,2,'cheers!',1,NULL,NULL);
CALL CreatePostMessage(1,3,'cool!',1,NULL,NULL);

CALL CreatePost(2,'I am posting too!', 1, NULL, NULL, 1, NULL);


