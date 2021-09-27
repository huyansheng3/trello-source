// escapes (adds leading escape slash) every character inside the outer [ ]
// e.g: ? -> \?, } -> \}, ' ' -> \' '

export const escapeForRegex = (text: string): string =>
  text && text.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&');
