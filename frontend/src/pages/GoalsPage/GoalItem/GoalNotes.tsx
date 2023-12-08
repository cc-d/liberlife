import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Link,
  Divider,
  Tooltip,
} from '@mui/material';
import { GoalOut } from '../../../api';
import { useThemeContext } from '../../../contexts/ThemeContext';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SyncIcon from '@mui/icons-material/Sync';

interface GoalNotesProps {
  goal: GoalOut;
  onSaveNotes: (notes: string | null) => void;
  latestUpdate: string | null;
}

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

const covertDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', // 3-letter month
    day: 'numeric', // 1-2 length day
  });
};

const CreateUpdateElem: React.FC<{ goal: GoalOut; isType: string }> = ({
  goal,
  isType,
}) => {
  const dIconSX = {
    fontSize: '0.8rem',
    m: 0,
    p: 0,
    mr: 0.25,
  };

  const elemType = isType.toLocaleLowerCase().includes('create')
    ? 'created'
    : 'updated';

  const dIcon =
    elemType === 'created' ? (
      <AddCircleOutlineIcon sx={dIconSX} />
    ) : (
      <SyncIcon sx={dIconSX} />
    );
  return (
    <Tooltip title={`${elemType} on`} arrow placement="top-start">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flexGrow: 0,
          alignSelf: 'bottom',
          justifyContent: 'bottom',
          p: 0.25,
          pl: elemType === 'created' ? 0.25 : 0.75,
        }}
      >
        {dIcon}
        <Typography
          variant="caption"
          sx={{
            display: 'flex',
            m: 0,
            p: 0,
          }}
          noWrap
        >
          {covertDate(
            isType.toLocaleLowerCase().includes('create')
              ? goal.created_on
              : goal.updated_on
          )}
        </Typography>
      </Box>
    </Tooltip>
  );
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

  const iBtnSX = {
    borderRadius: 0,

    overflow: 'visible',
  };

  return (
    <Box
      sx={{
        m: 0,
        maxWidth: '100%',
        p: 0,
        backgroundColor: theme.theme.palette.background.paper,
      }}
    >
      {isEditingNotes ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
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
              width: `calc(${longestNoteLine} * 6px)`,
              resize: 'both',
              overflow: 'auto',
            }}
          />
          <IconButton
            sx={{
              ...iBtnSX,
            }}
            onClick={handleSaveNotes}
            aria-label="save notes"
          >
            <SaveAsIcon />
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
                p: 0.5,

                m: 0,
                lineHeight: 1.25,
                pb: 3.5,
              }}
            >
              {goal?.notes ? renderFormattedNotes(goal) : 'add notes...'}
            </Typography>
            <IconButton
              onClick={() => setIsEditingNotes(true)}
              sx={{
                ...iBtnSX,
              }}
              aria-label="edit notes"
            >
              <EditNoteIcon />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexGrow: 1,
            justifyContent: 'flex-end',
          }}
        >
          <Tooltip title="Add Note" arrow>
            <IconButton
              onClick={() => setIsEditingNotes(true)}
              sx={{
                ...iBtnSX,
                justifyContent: 'flex-end',
              }}
              aria-label="add notes"
            >
              <EditNoteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {!isEditingNotes && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',

            position: 'absolute',
            m: 0,

            border: '0px solid orange',
            p: 0,
            mt: -3,
          }}
        >
          <CreateUpdateElem goal={goal} isType="created" />
          {latestUpdate && <CreateUpdateElem goal={goal} isType="updated" />}
        </Box>
      )}
    </Box>
  );
};

export default GoalNotes;
