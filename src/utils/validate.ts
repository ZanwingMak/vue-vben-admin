export function isValidUsername(str: string) {
  const reg = /^\S{1,12}$/;
  return reg.test(str);
}

export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

export function validateLowerCase(str: string) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

export function validateUpperCase(str: string) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

export function isValidateEmail(str: string) {
  const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  return reg.test(str);
}

export function isValidatePhone(str: string) {
  const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
  return reg.test(str);
}

export function isValidatePassword(str: string) {
  const reg = /^\S{1,18}$/;
  return reg.test(str);
}

export function isValidateSmsCode(str: string) {
  const reg = /^\d{4,8}$/;
  return reg.test(str);
}

export function isValidateletter(str: string) {
  const reg = /^[a-zA-Z\d]+$/;
  return reg.test(str);
}
