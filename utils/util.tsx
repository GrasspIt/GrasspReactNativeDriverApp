export const formatPhone = (phonenum) => {
  var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (regexObj.test(phonenum)) {
    var parts = phonenum.match(regexObj);
    var phone = '';
    if (parts[1]) {
      phone += '(' + parts[1] + ') ';
    }
    phone += parts[2] + '-' + parts[3];
    return phone;
  } else {
    //invalid phone number
    return phonenum;
  }
};
