import { Config, Database } from './';

const { regex, texts, colors } = Config;

class Helper {

    static getDateISO(year, month, day) {
        return year.toString() + '-' + 
                ('00' + (month + 1).toString()).slice(-2) + '-' + 
                ('00' + (day).toString()).slice(-2);
    }
    
    static toDate(dateString) {
        return new Date(parseInt(dateString.substring(0, 4)),
                        parseInt(dateString.substring(5, 7)) - 1,
                        parseInt(dateString.substring(8, 10)));
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
    }

	static prettyfyDate(uglyDate) {
        if (uglyDate === undefined || uglyDate === null || uglyDate === 'null') {
            return '';
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
}

export { Helper };

/*
module.exports = function helpers() {
    this.getDateISO = function (year, month, day) {
        return year.toString() + '-' + 
                ('00' + (month + 1).toString()).slice(-2) + '-' + 
                ('00' + day.toString()).slice(-2);
    };

    this.isValidEmail = function (email) {
        const re = regex.email;
        return !re.test(email);
    };

    this.isValidText = function (text) {
        const re = regex.textOnly;
        return !re.test(text);
    };

};*/