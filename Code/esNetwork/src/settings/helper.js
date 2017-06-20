import { Config } from './';

const { regex } = Config;

class Helper {

    static getDateISO(year, month, day) {
        return year.toString() + '-' + 
                ('00' + (month + 1).toString()).slice(-2) + '-' + 
                ('00' + day.toString()).slice(-2);
    }
    
    static toDate(dateString) {
        return new Date(parseInt(dateString.substring(0, 4)),
                                parseInt(dateString.substring(5, 7)) - 1,
                                parseInt(dateString.substring(8, 10)) - 1);
    }

    static isValidEmail(email) {
        const re = regex.email;
        return !re.test(email);
    }

    static isValidText(text) {
        const re = regex.textOnly;
        return !re.test(text);
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