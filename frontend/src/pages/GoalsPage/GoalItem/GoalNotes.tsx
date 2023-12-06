import React, { useState } from 'react';
import { Box, Typography, TextField, IconButton, Link } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { GoalOut } from '../../../api';
import { useThemeContext } from '../../../contexts/ThemeContext';
import green from '@mui/material/colors/green';

interface GoalNotesProps {
  goal: GoalOut;
  onSaveNotes: (notes: string | null) => void;
  latestUpdate: string | null;
}

interface NoNotesViewProps {
  latestUpdate: string | null;
  onEdit: () => void;
}
const NoNotesView: React.FC<NoNotesViewProps> = ({ latestUpdate, onEdit }) => {
  const { theme } = useThemeContext();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="textSecondary" sx={{ p: 0, m: 0 }}>
          add notes...
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: theme.palette.text.secondary, p: 0, m: 0 }}
        >
          {latestUpdate}
        </Typography>
      </Box>
      <IconButton onClick={onEdit} aria-label="edit notes">
        <EditIcon />
      </IconButton>
    </Box>
  );
};
const renderFormattedNotes = (goal: GoalOut) => {
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

export const GoalNotes: React.FC<GoalNotesProps> = ({
  goal,
  onSaveNotes,
  latestUpdate,
}) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(goal?.notes);

  const handleSaveNotes = () => {
    const updatedNotes = editedNotes?.trim() || null;
    onSaveNotes(updatedNotes);
    setIsEditingNotes(false);
  };

  const theme = useThemeContext();

  let longestNoteLine = 0;
  if (goal?.notes) {
    const lines = goal.notes.split('\n');
    lines.forEach((line) => {
      // Match and remove URLs enclosed in square brackets, but keep the text after them
      const modifiedLine = line.replace(/\[(.*?)\]\(.*?\)/g, '$0');

      if (modifiedLine.length > longestNoteLine) {
        longestNoteLine = modifiedLine.length;
      }
    });
  }

  return (
    <Box
      sx={{
        m: 0,
        maxWidth: '100%',
        p: 0.5,
        backgroundColor: theme.theme.palette.background.paper,
      }}
    >
      {isEditingNotes ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            flexGrow: 1,
          }}
        >
          <TextField
            value={editedNotes || ''}
            onChange={(e) => setEditedNotes(e.target.value)}
            multiline
            rows={editedNotes?.split('\n').length || 1}
            fullWidth
            margin="none"
            InputProps={{ disableUnderline: true }}
            // allow resizing

            sx={{
              flexGrow: 1,
              width: `${longestNoteLine}ch`,
            }}
          />
          <IconButton
            sx={{
              borderRadius: 0,
            }}
            onClick={handleSaveNotes}
            aria-label="save notes"
          >
            <SaveIcon />
          </IconButton>
        </Box>
      ) : goal?.notes ? (
        <Box
          sx={{
            flexDirection: 'column',
            display: 'flex',
            flexGrow: 1,
          }}
        >
          <Box
            display="flex"
            alignItems="stretch"
            flexDirection="row"
            sx={{
              flexGrow: 1,
              maxWidth: '100%',
              width: '100%',
            }}
          >
            <Typography
              color={theme.theme.palette.text.primary}
              sx={{
                flexGrow: 1,
                width: '100%',
                whiteSpace: 'pre-wrap',
                p: 0,
                m: 0,
                lineHeight: 1.25,
              }}
            >
              {goal?.notes ? renderFormattedNotes(goal) : 'add notes...'}
            </Typography>
            <IconButton
              onClick={() => setIsEditingNotes(true)}
              sx={{
                alignSelf: 'stretch',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 0,
              }}
              aria-label="edit notes"
            >
              <EditIcon />
            </IconButton>
          </Box>
          <Typography
            variant="caption"
            color={theme.theme.palette.text.primary}
            noWrap
            sx={{
              textAlign: 'left',
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'flex-end',
              fontVariant: 'small-caps',
              m: 0,
              p: 0,
              mr: 0.5,
            }}
          >
            {latestUpdate}
          </Typography>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default GoalNotes;
