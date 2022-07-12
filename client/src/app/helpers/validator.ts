export class Validator {
  static telephoneNumber(value) {
    var regExp = /^0[0-9]{9}$/
    var phone = value.match(regExp);
    return (phone == null);
  }

  static validateJSON = (obj, validations) =>
    validations.every(key => ![undefined, null].includes(key.split('.').reduce((acc, cur) => acc?.[cur], obj)));
}
