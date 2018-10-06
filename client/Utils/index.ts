import * as sanitizeHtml from 'sanitize-html';

export const textFromHTML = (html: string) => {
  const parserDiv = document.createElement('div');
  parserDiv.innerHTML = sanitizeHtml(html);
  return parserDiv.textContent || parserDiv.innerText || '';
};