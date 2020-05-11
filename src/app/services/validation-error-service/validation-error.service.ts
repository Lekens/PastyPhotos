import { Injectable } from '@angular/core';

@Injectable()
export class ValidationErrorService {

    constructor() { }
    public message(validationObj) {
        let msg = ``;
        Object.keys(validationObj).forEach((key) => {
            msg += `${validationObj[key]} <br>`;
        });
        return msg;
    }

    public message2(validationObj) {
        let msg = ``;
        Object.keys(validationObj).forEach((key) => {
            msg += `${validationObj[key]}    `;
        });
        return msg;
    }
}
