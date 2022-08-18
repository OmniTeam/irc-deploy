import { Pipe, PipeTransform } from '@angular/core';
import * as libphonenumber from 'google-libphonenumber';

@Pipe({name: 'phone'})
export class PhonePipe implements PipeTransform {

  transform(value: string) {

    let PNF = libphonenumber.PhoneNumberFormat;

    // Get an instance of `PhoneNumberUtil`.
    let phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

    // Add a leading '+' sign if not available. Assumption is all numbers contain country code prefixed.
    //let newValue = value.length > 0 && value.charAt(0) != "+" ? "+" + value : value;

    // Format the number.
    // let parsedPhoneObj = phoneUtil.parse(newValue, 'US');
    let parsedPhoneObj = phoneUtil.parse(value, 'UG');

    return phoneUtil.format(parsedPhoneObj, PNF.INTERNATIONAL);
  }

}
