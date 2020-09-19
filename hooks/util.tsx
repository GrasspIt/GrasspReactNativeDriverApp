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

export const parseDate = (date) => {
  if (!date) return undefined;
  if (date instanceof Date) return date;
  if (typeof date === 'number') return new Date(date);

  const parsed = Date.parse(date);
  if (!isNaN(parsed)) return new Date(parsed);

  // An RFC 822 date string, e.g. "2018-02-06T20:00:00.000+0400", won't work with Safari
  // Safari can parse ISO 8601 date strings, e.g. "2018-02-06T20:00:00.000+04:00" - notice the colon near the end
  if (date && date.length === 28) return new Date(`${date.substring(0, 26)}:${date.substring(26)}`);

  throw new Error(`Invalid Date : ${date}`);
};
