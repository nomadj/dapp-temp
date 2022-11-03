export const rmSpecChars = (str) => {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
  let formattedStr = str;
  for (let i = 0; i < str.length; i++) {
    if (specialChars.test(str[i]) === true) {
      formattedStr = formattedStr.replace(str[i], '');
    }
  }
  return formattedStr;
}

export const proString = (str) => {
  const lowercaseStr = str.toLowerCase();
  const trimStr = lowercaseStr.trim();
  const rmSpacesStr = trimStr.replaceAll(' ', '');
  const rmSpecCharsStr = rmSpecChars(rmSpacesStr);
  return rmSpecCharsStr;
}
