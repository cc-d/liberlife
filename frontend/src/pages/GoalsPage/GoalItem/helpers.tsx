import { GoalOut } from '../../../api';
import { Link } from '@mui/material';

export const renderFormattedNotes = (goal: GoalOut) => {
  let i = 0;
  const elements: JSX.Element[] = [];
  const notes = goal?.notes || '';
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  while (i < notes.length) {
    const startLinkText = notes.indexOf('[', i);
    const endLinkText = notes.indexOf(']', startLinkText + 1);
    const startLinkURL = notes.indexOf('(', endLinkText + 1);
    const endLinkURL = notes.indexOf(')', startLinkURL + 1);

    if (
      startLinkText !== -1 &&
      endLinkText !== -1 &&
      startLinkURL !== -1 &&
      endLinkURL !== -1
    ) {
      if (startLinkText > i) {
        elements.push(
          <span key={i}>
            {removeNewlines(notes.substring(i, startLinkText))}
          </span>
        );
      }

      const linkText = notes.substring(startLinkText + 1, endLinkText);
      const linkURL = notes.substring(startLinkURL + 1, endLinkURL);

      elements.push(
        <Link
          href={linkURL}
          key={endLinkText}
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkText}
        </Link>
      );

      i = endLinkURL + 1;
    } else {
      const remainingText = notes.substring(i);
      const urlMatch = remainingText.match(urlRegex);

      if (urlMatch) {
        const urlIndex = remainingText.indexOf(urlMatch[0]);
        if (urlIndex > 0) {
          elements.push(
            <span key={i}>
              {removeNewlines(remainingText.substring(0, urlIndex))}
            </span>
          );
        }

        elements.push(
          <Link
            href={urlMatch[0]}
            key={i + urlIndex}
            target="_blank"
            rel="noopener noreferrer"
          >
            {urlMatch[0]}
          </Link>
        );

        i += urlIndex + urlMatch[0].length;
      } else {
        elements.push(<span key={i}>{removeNewlines(remainingText)}</span>);
        break;
      }
    }
  }

  return elements;
};

const removeNewlines = (
  text: string,
  removeChars: string = '\n\n',
  replaceChars: string = '\n'
) => {
  let newText = text.replaceAll('\r\n', '\n');
  while (newText.includes(removeChars)) {
    newText = newText.replaceAll(removeChars, '\n');
  }
  return newText;
};
