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

CALL CreatePerson('Paulina','Orihuela','Pérez','1988-04-20','paulina_o_16@hotmail.com','0448341414939','1334','password',1,'avt/xjalkd.png',1);

SELECT getLevel(2);


