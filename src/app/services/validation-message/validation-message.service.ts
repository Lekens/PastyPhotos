/**
 * Created By Arokoyu Olalekan Ojo <arokoyuolalekan@gmail.com> @ 8/9/2017
 */
import { Injectable } from '@angular/core';

@Injectable()
export class ValidationMessageService {

  constructor() {
    /**
     * All our validation messages go in here to ensure uniformity
     */
    return {
      'firstName': {
        'required': 'First Name is required.',
        'minLength': 'First Name must be at least 3 Characters Long'
      },
      'orgName': {
        'required': 'Organisation Name is required.',
        'minLength': 'Organisation Name must be at least 6 Characters Long'
      },
      'orgAcronym': {
        'required': 'Organisation Acronym is required.'
      },
      'lastName': {
        'required': 'Last Name is required.',
        'minLength': 'Last Name must be at least 3 Characters Long.'
      },
      'email': {
        'required': 'Email is required.',
        'invalid': 'Email is invalid.',
        'minLength': 'Email must be at least 6 Characters Long'
      },
      'orgEmail': {
        'required': 'Organisation Email is required.',
        'invalid': 'Organisation Email is invalid.',
        'minLength': 'Organisation Email must be at least 6 Characters Long'
      },
      'password': {
        'required': 'Password is required.',
        'invalidFormat': 'Password must be at least 6 Characters Long.',
        'invalidFormat_Login': 'Password must be at least 4 Characters Long.',
        'minLength': 'Password must be at least 6 Characters Long',
        'weakPassword': 'Password is weak',
        'strongPassword': 'Password is strong',
      },
      'telephone': {
        'required': 'Telephone field is required.',
        'invalid': 'Telephone is invalid.',
        'minLength': 'Telephone must be at least 6 Characters Long'
      },
      'orgPhone': {
        'required': '.Phone field is required.',
        'invalid': 'Phone is invalid.',
        'minLength': 'Phone must be at least 6 Characters Long'
      },
      'orgAddress': {
        'required': 'Address field is required.'
      },
      'city': {
        'required': 'City field is required.'
      },
      'state': {
        'required': 'State field is required.'
      },
      'country': {
        'required': 'Country field is required, Please Select'
      },
      'orgType': {
        'required': 'Organisation type is required.',
        'invalid': 'Organisation type must be Selected.'
      },
      'memberRange': {
        'required': 'Member Range is required.',
        'invalid': 'Member Range must be Selected.'
      },
      'catName': {
        'required': 'Category Name is required.',
        'minLength': 'Category must be at least 3 Characters Long.'
      },
      'alphaFuturePeople': {
        'required': 'Alpha Future field is required.',
        'minLength': 'Alpha Future must be at least 6 Characters Long.'
      },
      'formErrorTitle': {
        'errorWrong': 'Form Error'
      },
      'bankName': {
        'required': 'Bank Name is required.'
      },
      'bankAccount': {
        'required': 'Account Number is required.',
        'minLength': 'Account Number must be at least 10 Digits Long.',
        'maxLength': 'Account Number must be at most 10 Digits Long.',
        'invalid': 'Invalid account number.'
      },
    };
  }
}
