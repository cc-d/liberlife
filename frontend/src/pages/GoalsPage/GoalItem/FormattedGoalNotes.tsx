import { GoalOut } from '../../../api';
import React from 'react';
import { useThemeContext } from '../../../contexts/ThemeContext';
import { Typography, Link, Box } from '@mui/material';

const NoteLine: React.FC<{ line: string }> = ({ line }) => {
  // Regular expression to find Markdown and raw URLs
  const regex = /(https?:\/\/[^\s]+)|(\[[^\]]+\]\([^\)]+\))/g;

  // Split the line into parts
  const parts = line.split(regex).filter(Boolean);

  const linkSX = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  };

  const typoSX = {
    m: 0,
    p: 0,
    lineHeight: 1.25,
    maxWidth: 'calc(min(100%, 800px))',
    overflow: 'hidden',
    display: 'inline-flex',
    flexGrow: 1,
    flexDirection: 'row',
  };

  // Render each part
  const renderPart = (part: string, index: number) => {
    // Check if the part is a Markdown link
    if (part.startsWith('[')) {
      const [text, url] = part.slice(1, -1).split('](');
      return (
        <Typography key={`typo-${index}`} sx={typoSX}>
          <Link component={'a'} sx={linkSX} key={`link-${index}`} href={url}>
            {text}
          </Link>
        </Typography>
      );
    }
    // Check if the part is a raw URL
    else if (part.startsWith('http')) {
      return (
        <Typography key={`typo-${index}`} sx={typoSX}>
          <Link component={'a'} sx={linkSX} key={`link-${index}`} href={part}>
            {part}
          </Link>
        </Typography>
      );
    }
    // Otherwise, return as normal text
    return <span key={`span-${index}`}>{part}</span>;
  };

  return <Box>{parts.map((part, index) => renderPart(part, index))}</Box>;
};

const FormattedGoalNotes: React.FC<{ goal: GoalOut }> = ({ goal }) => {
  const { theme } = useThemeContext();

  const notes = goal?.notes ? removeNewlines(goal.notes) : '';

  return (
    <Box
      color={theme.palette.text.primary}
      sx={{
        flexGrow: 1,
        maxWidth: 'calc(min(100%, 100vw - 70px))',
        whiteSpace: 'pre-wrap',
        p: 0.5,

        m: 0,
        lineHeight: 1.25,
        pb: 3.5,
      }}
    >
      {!notes ? (
        <NoteLine line="add notes..." />
      ) : (
        notes.split('\n').map((line, i) => {
          return <NoteLine key={i} line={line} />;
        })
      )}
    </Box>
  );
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

export default FormattedGoalNotes;
