export class Validator {
  static telephoneNumber(value) {
    var regExp = /^0[0-9]{9}$/
    var phone = value.match(regExp);
    return (phone == null);
  }
}
