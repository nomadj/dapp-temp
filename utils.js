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

export function downloadFile(url, fileName) {
  fetch(url, { method: 'get', mode: 'no-cors', referrerPolicy: 'no-referrer' })
    .then(res => res.blob())
    .then(res => {
      const aElement = document.createElement('a');
      aElement.setAttribute('download', fileName);
      const href = URL.createObjectURL(res);
      aElement.href = href;
      aElement.setAttribute('target', '_blank');
      aElement.click();
      URL.revokeObjectURL(href);
    });
}
