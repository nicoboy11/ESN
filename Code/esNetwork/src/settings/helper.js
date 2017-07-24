import { Config, Database } from './';

const { regex, texts, colors } = Config;

class Helper {

    static getDateISO(year, month, day) {
        return year.toString() + '-' + 
                ('00' + (month + 1).toString()).slice(-2) + '-' + 
                ('00' + (day).toString()).slice(-2);
    }   

    static getDateISOfromDate(date) {
        return date.getFullYear().toString() + '-' + 
                ('00' + (date.getMonth() + 1).toString()).slice(-2) + '-' + 
                ('00' + (date.getDate()).toString()).slice(-2);
    }   

    static toDate(dateString) {
        if (dateString) {
            return new Date(parseInt(dateString.substring(0, 4)),
                            parseInt(dateString.substring(5, 7)) - 1,
                            parseInt(dateString.substring(8, 10)));
        }

        return null;
    }

    static isValidEmail(email) {
        const re = regex.email;
        return !re.test(email);
    }

    static isValidText(text) {
        const re = regex.textOnly;
        return !re.test(text);
    }

    static logout() {
        Database.realm('Session', { }, 'delete', '');        
        Database.realm('Person', { }, 'delete', '');   
        Database.realm('Project', { }, 'delete', '');  
    }

	static prettyfyDate(uglyDate) {
        if (uglyDate === undefined || uglyDate === null || uglyDate === 'null') {
            return {
                color: colors.main,
                date: ''
            };
        }

        const date = this.toDate(uglyDate);

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const diff = this.getDifference(date, today) / (3600 * 24 * 1000);
		if (diff === 0) {
			return { color: colors.main, date: 'Today' };
		} else if (diff === 1) {
			return { color: colors.main, date: 'Tomorrow' };
		} else if (diff === -1) {
			return { color: colors.error, date: 'Yesterday' };
		} else if (diff > -6 && diff < 6) {
			return { color: (diff > 0) ? colors.main : colors.error, date: this.getDayOfWeek(date) };		
		} 

        return {
                    color: (diff > 0) ? colors.main : colors.error, 
                    date: date.getDate().toString() + ' ' + texts.month[date.getMonth()] + ((date.getYear() !== today.getYear()) ? (', ' + date.getFullYear().toString()) : '')
                };		
	}

	static getDayOfWeek(date) {
		return texts.days[date.getDay()];
	}
	
	static getDifference(date1, date2) {
		return date1 - date2;
    }    
    
    static loadRealms(sessionId) {
        Database.request2('GET', 'network', {}, 2, (err, response) => {
            if (err) {
                console.log(response.message);
            } else {
                let people = [];

                for (let row of response) {
                    people.push({
                        personId: row.personId,
                        names: row.names,
                        firstLastName: row.firstLastName,
                        secondLastName: row.secondLastName,
                        person: row.person,
                        dateOfBirth: Helper.toDate(row.dateOfBirth),
                        email: row.email,
                        mobile: row.mobile,
                        genderId: row.genderId,
                        gender: row.gender,                    
                        phone: row.phone,
                        ext: row.ext,
                        startDate: Helper.toDate(row.startDate),
                        endDate: Helper.toDate(row.endDate),
                        higherPersonId: row.higherPersonId,
                        higherPerson: row.higherPerson,
                        parentLevelKey: row.parentLevelKey,
                        lastLogin: Helper.toDate(row.lastLogin),
                        avatar: row.avatar,
                        description: row.description,
                        job: row.job,
                        roleId: row.roleId,
                        abbr: row.abbr,  
                        levelKey: row.levelKey,
                        theme: row.theme,
                        isParent: (row.isParent === 1),
                        isSync: true
                    });         
                }
                
                Database.realm('Person', people, 'create', '');                
            }
        });  
        
        Database.request2('GET', `personProjects/${sessionId}`, {}, 2, (err, response) => {
            if (err) {
                console.log(response.message);
            } else {
                let projects = [];

                for (let row of response) {
                    const membersJSON = JSON.parse(row.members);
                    let membersRealm = [];
                    
                    for (let member of membersJSON) {
                        membersRealm.push(Database.realmToObject(Database.realm('Person', { }, 'select', `personId=${member.personId}`), 'Person')[0]);
                    }

                    projects.push({
                        projectId: row.projectId,
                        name: row.name,
                        abbr: row.abbr,
                        startDate: Helper.toDate(row.startDate),
                        creatorId: row.creatorId,
                        dueDate: Helper.toDate(row.dueDate),
                        logo: row.logo,
                        lastChanged: new Date(),
                        activeTasks: row.activeTasks,
                        totalTasks: row.totalTasks,
                        progress: row.progress,
                        members: membersRealm           
                    });         
                }
                
                Database.realm('Project', projects, 'create', '');                
            }
        });              
    }
}

export { Helper };
