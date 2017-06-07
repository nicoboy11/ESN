CALL CreateCountry('England');
CALL CreateProvince(1,'South Yorkshire');
CALL CreateCity(1,'Sheffield');

CALL CreateGender('Male');
CALL CreateGender('Famale');

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
CALL CreateStateType('Public');
CALL CreateStateType('Private');

CALL CreateAttachmentType('File');
CALL CreateAttachmentType('Photo');
CALL CreateAttachmentType('Audio');
CALL CreateAttachmentType('Video');

CALL CreateMessageType('Message');
CALL CreateMessageType('Log');

CALL CreatePerson('Even','Sosa','Rodríguez','1985-10-23','even.sosa@gmail.com','07731917608','','password',1,NULL,'','token123',1);
CALL CreatePerson('Paulina','Orihuela','Pérez','1988-04-20','paulina_o_16@hotmail.com','0448341414939','1334','password',2,1,'avt/xjalkd.png','token123',1);

CALL CreatePerson('Julianne','Hadyn','Fear','1970-02-20','julianne@testcorp.com','0432684512','','password',2,1,'avt/xjalkd1.png','token123',3);
CALL CreatePerson('Hailee','Murray','Aaron','1978-04-02','hailee@testcorp.com','985324565','','password',2,1,'avt/xjalkd2.png','token123',3);
CALL CreatePerson('Jeremiah','Betony','Stack','1981-06-10','jeremiah@testcorp.com','8542312565','1220','password',1,2,'avt/xjalkd3.png','token123',3);
CALL CreatePerson('Kaelea','Shelly','Blanchard','1973-08-24','kaelea@testcorp.com','7845463204','1222','password',2,2,'avt/xjalkd4.png','token123',3);
CALL CreatePerson('Cary','Lainey','Linwood','1950-09-14','cary@testcorp.com','1305246852','1210','password',2,3,'avt/xjalkd5.png','token123',3);
CALL CreatePerson('Sara','Cleve','Denzil','1991-07-01','sara@testcorp.com','2105684565','1210','password',2,3,'avt/xjalkd6.png','token123',3);
CALL CreatePerson('Harvie','Flower','Carlisle','1988-04-18','harvie@testcorp.com','2013254865','1211','password',1,4,'avt/xjalkd7.png','token123',3);
CALL CreatePerson('Bernard','Greg','Dukes','1990-12-06','bernard@testcorp.com','4652465204','1332','password',1,4,'avt/xjalkd8.png','token123',3);
CALL CreatePerson('Sandy','Wendy','Banks','1986-11-19','sandy@testcorp.com','9874563152','1332','password',2,5,'avt/xjalkd.png9','token123',3);
CALL CreatePerson('Barbara','Jamie','Macy','1988-03-13','barbara@testcorp.com','0546253512','1215','password',2,11,'avt/xjalkd.png10','token123',3);
CALL CreatePerson('Katy','James','Morrison','1982-03-21','katy@testcorp.com','46525795','1215','password',2,11,'avt/xjalkd.png10','token123',3);
CALL CreatePerson('Santiago','Narvaez','González','1949-05-12','santiago@testcorp.com','9958745852','1210','password',1,11,'avt/xjalkd11.png','token123',3);

CALL CreatePerson('Alan','Wright','','1980-05-05','alan@testcorp.com','2403968376','1000','password',1,1,'avt/xjalkd11.png','token123',3);


CALL CreatePerson('Evan','Cole','','1981-05-05','evan@testcorp.com','555-0000','1210','password',1,8,'avt/xjalkd11.png','token123',3);
CALL CreatePerson('Michael','Weber','','1982-11-08','michael@testcorp.com','555-0000','1210','password',1,8,'avt/xjalkd11.png','token123',3);
CALL CreatePerson('Melissa','McDonnell','','1982-12-05','melissa@testcorp.com','555-0000','1210','password',2,8,'avt/xjalkd11.png','token123',3);
CALL CreatePerson('James','Fowler','','1986-02-02','james@testcorp.com','555-0000','1210','password',1,8,'avt/xjalkd11.png','token123',3);

CALL CreatePerson('Charles','Moore','','1970-08-13','charles@testcorp.com','555-1111','1210','password',1,10,'avt/xjalkd11.png','token123',3);
CALL CreatePerson('Jessica','Long','','1973-11-15','jessica@testcorp.com','555-2222','1210','password',2,10,'avt/xjalkd11.png','token123',3);
CALL CreatePerson('Erick','Green','','1982-09-09','erick@testcorp.com','555-3333','1210','password',1,10,'avt/xjalkd11.png','token123',3);
CALL CreatePerson('Amanda','Washington','','1990-05-01','amanda@testcorp.com','555-4444','1210','password',2,10,'avt/xjalkd11.png','token123',3);
CALL CreatePerson('Erik','Davis','','1985-10-29','erick.davis@testcorp.com','555-5555','1210','password',1,10,'avt/xjalkd11.png','token123',3);



CALL CreatePost(1,'This is my first post. Welcome!', 1, NULL, NULL, 1, NULL);

CALL CreateFollower(2,1);
CALL CreateFollower(1,2);
CALL CreateFollower(3,1);
CALL CreateFollower(3,2);

CALL CreatePostMessage(1,2,'cheers!',1,NULL,NULL);
CALL CreatePostMessage(1,3,'cool!',1,NULL,NULL);

CALL CreatePost(2,'I am posting too!', 1, NULL, NULL, 1, NULL);

/*---------------------HASTA AQUI ALCANZA---------------------------------*/

CALL CreateTeam('Test Corp','TC','Be at the service of the software.',NULL,	'main@testcorp.com','13 Main Street',
				'S1 4ET',1,'055-030302','1010','','',
				'53.379287','-1.476412','',1,5	);

CALL CreateTeam('Human Resources','H.R.','Recruit and retain diverse workforce to meet the needs of the organization',
				1,'hr@testcorp.com','13 Main Street',
				'S1 4ET',1,'055-030302','1010','','',
				'53.379287','-1.476412','',2,5	);


CALL CreateTeamMember(1,1,2);
CALL CreateTeamMember(1,2,3);
CALL CreateTeamMember(1,3,3);
CALL CreateTeamMember(1,15,3);

CALL CreateTeamMember(2,2,2);
CALL CreateTeamMember(2,5,4);
CALL CreateTeamMember(2,6,3);
CALL CreateTeamMember(2,11,3);
CALL CreateTeamMember(2,12,3);
CALL CreateTeamMember(2,13,3);
CALL CreateTeamMember(2,14,3);

CALL CreateProject('Secretaría de Seguridad Pública', 'SSP', '2017-01-01', 1, '2017-02-01', 'ssp.png');
CALL EditProject(1,'Secretaría de Seguridad Pública', 'SSP', '2017-02-01', 1, '2017-03-30', 'ssp.png');

CALL CreateProjectGroup(1,1,'2016-01-01','2016-05-05');
CALL CreateProjectGroup(1,2,'2016-05-05','2016-08-01');
CALL EditProjectGroup(1,2,'2016-05-05','2016-10-01');

CALL CreateProjectMember(1,1,1,NOW(),'2018-01-01');
CALL CreateProjectMember(1,2,1,NOW(),'2018-01-01');

CALL EditProjectMember(1,2,1,NOW(),'2016-01-01','2018-01-01');
