CALL CreateCountry('England');
CALL CreateProvince(1,'South Yorkshire');
CALL CreateCity(1,'Sheffield');

CALL CreateGender('Male');
CALL CreateGender('Famale');

CALL CreatePriority('None');
CALL CreatePriority('Low');
CALL CreatePriority('Medium');
CALL CreatePriority('High');
CALL CreatePriority('Urgent');

CALL CreateGender('None');
CALL CreateGender('Low');
CALL CreateGender('Medium');
CALL CreateGender('High');
CALL CreateGender('Urgent');

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
CALL CreateStateType('Ready');
CALL CreateStateType('Finished');
CALL CreateStateType('Public');
CALL CreateStateType('Private');

CALL CreateAttachmentType('File');
CALL CreateAttachmentType('Photo');
CALL CreateAttachmentType('Audio');
CALL CreateAttachmentType('Video');

CALL CreateMessageType('Message');
CALL CreateMessageType('Log');




/*--------------------------MINIMAL UNTIL HERE---------------------------------------------------*/

CALL CreatePerson('Even','Sosa','Rodríguez','1985-10-23','even.sosa@gmail.com','07731917608','','','password',1,NULL,'','token123',1);
CALL CreatePerson('Paulina','Orihuela','Pérez','1988-04-20','paulina_o_16@hotmail.com','0448341414939','','1334','password',2,1,'','token123',1);

CALL CreatePerson('Julianne','Hadyn','Fear','1970-02-20','julianne@testcorp.com','8341263004','0432684512','','password',2,1,'','token123',3);
CALL CreatePerson('Hailee','Murray','Aaron','1978-04-02','hailee@testcorp.com','8341263004','985324565','','password',2,1,'','token123',3);
CALL CreatePerson('Jeremiah','Betony','Stack','1981-06-10','jeremiah@testcorp.com','8341263004','8542312565','1220','password',1,2,'','token123',3);
CALL CreatePerson('Kaelea','Shelly','Blanchard','1973-08-24','kaelea@testcorp.com','8341263004','7845463204','1222','password',2,2,'','token123',3);
CALL CreatePerson('Cary','Lainey','Linwood','1950-09-14','cary@testcorp.com','8341263004','1305246852','1210','password',2,3,'','token123',3);
CALL CreatePerson('Sara','Cleve','Denzil','1991-07-01','sara@testcorp.com','8341263004','2105684565','1210','password',2,3,'','token123',3);
CALL CreatePerson('Harvie','Flower','Carlisle','1988-04-18','harvie@testcorp.com','8341263004','2013254865','1211','password',1,4,'','token123',3);
CALL CreatePerson('Bernard','Greg','Dukes','1990-12-06','bernard@testcorp.com','8341263004','4652465204','1332','password',1,4,'','token123',3);
CALL CreatePerson('Sandy','Wendy','Banks','1986-11-19','sandy@testcorp.com','8341263004','9874563152','1332','password',2,5,'','token123',3);
CALL CreatePerson('Barbara','Jamie','Macy','1988-03-13','barbara@testcorp.com','8341263004','0546253512','1215','password',2,11,'','token123',3);
CALL CreatePerson('Katy','James','Morrison','1982-03-21','katy@testcorp.com','8341263004','46525795','1215','password',2,11,'','token123',3);
CALL CreatePerson('Santiago','Narvaez','González','1949-05-12','santiago@testcorp.com','8341263004','9958745852','1210','password',1,11,'','token123',3);

/*---------------------HASTA AQUI ALCANZA---------------------------------*/
CALL CreatePerson('Alan','Wright','','1980-05-05','alan@testcorp.com','2403968376','','1000','password',1,1,'','token123',3);


CALL CreatePerson('Evan','Cole','','1981-05-05','evan@testcorp.com','555-0000','','1210','password',1,8,'','token123',3);
CALL CreatePerson('Michael','Weber','','1982-11-08','michael@testcorp.com','555-0000','','1210','password',1,8,'','token123',3);
CALL CreatePerson('Melissa','McDonnell','','1982-12-05','melissa@testcorp.com','555-0000','','1210','password',2,8,'','token123',3);
CALL CreatePerson('James','Fowler','','1986-02-02','james@testcorp.com','555-0000','','1210','password',1,8,'','token123',3);

CALL CreatePerson('Charles','Moore','','1970-08-13','charles@testcorp.com','555-1111','','1210','password',1,10,'','token123',3);
CALL CreatePerson('Jessica','Long','','1973-11-15','jessica@testcorp.com','555-2222','','1210','password',2,10,'','token123',3);
CALL CreatePerson('Erick','Green','','1982-09-09','erick@testcorp.com','555-3333','1210','','password',1,10,'','token123',3);
CALL CreatePerson('Amanda','Washington','','1990-05-01','amanda@testcorp.com','555-4444','','1210','password',2,10,'','token123',3);
CALL CreatePerson('Erik','Davis','','1985-10-29','erick.davis@testcorp.com','555-5555','','1210','password',1,10,'','token123',3);
CALL CreatePerson('John','Mark','','1985-10-29','john.mark@testcorp.com','555-5555','','1210','password',1,10,'','token123',3);
/*---------------------HASTA AQUI ALCANZA---------------------------------*/
select * from post

CALL CreatePost(1,'This is my first post. Welcome!', 1, NULL, NULL, 1, NULL);

CALL CreateFollower(2,1);
CALL CreateFollower(1,2);
CALL CreateFollower(3,1);
CALL CreateFollower(3,2);

CALL CreatePostMessage(1,2,'cheers!',1,NULL,NULL);
CALL CreatePostMessage(1,3,'cool!',1,NULL,NULL);
CALL CreatePost(2,'I am posting too!', 1, NULL, NULL, 1, NULL);

CALL CreatePost(5,'This is my new post', 1, NULL, NULL, 1, NULL);
CALL CreatePost(7,'Here is a link: http://bit.ly/2sxuVam interpret it', 1, NULL, NULL, 1, NULL);
CALL CreatePost(23,'There are many things I could be sharing here to help the rest of the team. You can help to! post something', 1, NULL, NULL, 1, NULL);
CALL CreatePost(12,'Un post en español par aprobar la inovación teconlógica', 1, NULL, NULL, 1, NULL);
CALL CreatePost(6,'We need to upload something', 1, NULL, NULL, 1, NULL);
CALL CreatePost(6,'Upload stuff', 1, NULL, NULL, 1, NULL);
CALL CreatePost(8,'Great changes', 1, NULL, NULL, 1, NULL);
CALL CreatePost(1,'This is the new schedule', 1, NULL, NULL, 1, NULL);
CALL CreatePost(4,'Tomorrow the annual party at 3:30 in...', 1, NULL, NULL, 1, NULL);
CALL CreatePost(5,'Does anyone has the phone for HHRR', 1, NULL, NULL, 1, NULL);
CALL CreatePost(9,'this is my phone you should be able to call me 8341263004', 1, NULL, NULL, 1, NULL);
CALL CreatePost(12,'Hello', 1, NULL, NULL, 1, NULL);
CALL CreatePost(10,'Posting more posts', 1, NULL, NULL, 1, NULL);
CALL CreatePost(11,'Help me post this more', 1, NULL, NULL, 1, NULL);
CALL CreatePost(16,'You should pin this', 1, NULL, NULL, 1, NULL);



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
CALL CreateProject('Human resources stuff', 'HRS', '2017-01-01', 1, '2017-02-01', 'hrs.png');
CALL EditProject(1,'Secretaría de Seguridad Pública', 'SSP', '2017-02-01', 1, '2017-03-30', 'ssp.png');

CALL CreateProjectTeam(1,1,'2016-01-01','2016-05-05');
CALL CreateProjectTeam(1,2,'2016-05-05','2016-08-01');
CALL EditProjectTeam(1,2,'2016-05-05','2016-10-01');
CALL CreateProjectTeam(2,2,'2016-05-05','2016-08-01');

CALL CreateProjectMember(1,1,1,NOW(),'2018-01-01');
CALL CreateProjectMember(1,2,1,NOW(),'2018-01-01');

CALL CreateProjectMember(2,1,1,NOW(),'2018-01-01');
CALL CreateProjectMember(2,2,1,NOW(),'2018-01-01');

CALL EditProjectMember(1,2,1,NOW(),'2016-01-01','2018-01-01');

CALL CreateTask('Prepare ESN App', 'Write requirements and Design database', '2016-12-21', '2017-06-21', 1, NULL, NULL, 1);
/*CALL CreateTask('Prepare ESN App', 'Write requirements and Design database', '2017-12-21', '2017-06-21', NOW(), 1, NULL, NULL); --Date Error*/
CALL CreateTask('Get new people', 'Advertise company to get new employees', '2016-12-21', '2017-06-21', 1, 2, NULL,1);
CALL CreateTask('Training on IOS', 'Preparation for the IOS training', '2016-12-21', '2017-06-21', 1, 2, NULL,2);
CALL CreateTask('Training on Android', 'Preparation for the Android training', '2016-12-21', '2017-06-21', 1, 2, NULL,3);
CALL CreateTask('September Conference', 'Review everything wrt the conference', '2016-12-21', '2017-06-21', 1, 2, NULL,4);
CALL CreateTask('Organizing data', 'Organize all data in folders', '2016-12-21', '2017-06-21', 1, 2, NULL,5);
CALL CreateTask('Create new method', 'create new method', '2016-12-21', '2017-06-21', 1, 2, NULL,5);

CALL EditTask(1, 'Prepare Enterprise Social Network', 'Write requirements, design database and application', NULL, NULL, NULL, NULL, NULL, NULL);
CALL EditTask(1, 'Prepare ESN App', 'Write requirements, design database and applicatio', '2017-01-01', '2017-09-15', 2, 1, NULL, NULL);

CALL CreateTaskMember(1, 2, 2, NOW(), '2017-09-01');
CALL CreateTaskMember(1, 3, 3, NOW(), '2017-09-01');

CALL CreateTaskMember(1, 6, 3, NOW(), '2017-09-01');
CALL CreateTaskMember(1, 7, 3, NOW(), '2017-09-01');
CALL CreateTaskMember(1, 8, 3, NOW(), '2017-09-01');

CALL CreateTaskMessage(1, 1, 'Welcome everyone', 1, NULL, NULL);

CALL CreateTaskMessage(1, 2, 'Hi', 1, NULL, NULL);
CALL CreateTaskMessage(1, 3, 'Hi', 1, NULL, NULL);
CALL CreateTaskMessage(1, 4, 'Hi', 1, NULL, NULL); /* Should Fail */



CALL CreateCheckList(1, 'Even Tasks', '2017-09-10', 2);
CALL EditCheckList(1, 'Paulinas Tasks','2017-09-27 10:00:00',2);
CALL CreateCheckList(1, 'Even Tasks', '2017-09-10', 2);
CALL CreateCheckList(1, 'Nicolas Tasks', '2017-09-10', 2);

CALL CreateCheckListItem (1, 'Do this first', 1);
CALL CreateCheckListItem (1, 'Do this second', 1);
CALL CreateCheckListItem (1, 'Do this third', 1);
CALL EditCheckListItem (1,3,NULL,NULL,true,2,NOW());


