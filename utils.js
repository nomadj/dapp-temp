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

export const rscUpload = (str) => {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/
  let formattedStr = str;
  for (let i = 0; i < str.length; i++) {
    if (specialChars.test(str[i]) === true) {
      formattedStr = formattedStr.replace(str[i], '');
    }
  }
  return formattedStr;
}

export const proString = (str) => {
  const trimStr = str.trim();
  const rmSpacesStr = trimStr.replaceAll(' ', '');
  const rmSpecCharsStr = rmSpecChars(rmSpacesStr);
  return rmSpecCharsStr;
}

export const proAlphaLower = (str) => {
  var trimmed = str;
  if (str[0] === ' ') {
    trimmed = str.replace(str[0], '')
  }
  trimmed = trimmed.replace('  ', ' ');
  const lowered = trimmed.toLowerCase();
  const rmSpecCharsStr = rmSpecChars(trimmed);
  return rmSpecCharsStr;  
}

export const proAlpha = (str) => {
  const trimStr = str.trim();
  const rmSpacesStr = trimStr.replaceAll('  ', ' ');
  const rmSpecCharsStr = rscUpload(rmSpacesStr);
  return rmSpecCharsStr;
}

export const proAlphaSpaces = (str) => {
  var trimmed = str;
  if (str[0] === ' ') {
    trimmed = str.replace(str[0], '')
  }
  trimmed = trimmed.replace('  ', ' ');
  const rmSpecCharsStr = rscCommas(trimmed);
  return rmSpecCharsStr;  
}

export const rscCommas = (str) => {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|<>\/?~]/
  let formattedStr = str;
  for (let i = 0; i < str.length; i++) {
    if (specialChars.test(str[i]) === true) {
      formattedStr = formattedStr.replace(str[i], '');
    }
  }
  return formattedStr;  
}

export const floatsOnly = (str) => {
  let formattedStr = str;
  const validChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']
  for (let i = 0; i < str.length; i++) {
    if (!validChars.includes(str[i])) {
      formattedStr = formattedStr.replace(str[i], '');
    } else if (str[i] == '.') {
      if (formattedStr.match(/\./g).length != null && formattedStr.match(/\./g).length > 1) {
	formattedStr = formattedStr.replace(str[i], '');
      }
    }
  }
  return formattedStr;
}

// export function downloadFile(url, fileName) {
//   fetch(url, { mode: 'no-cors' })
//     .then(res => res.blob())
//     .then(blob => {
//       let blobUrl = window.URL.createObjectURL(blob);
//       let a = document.createElement('a');
//       a.download = url.replace(/^.*[\\\/]/, '');
//       a.href = blobUrl;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//     });
// }
