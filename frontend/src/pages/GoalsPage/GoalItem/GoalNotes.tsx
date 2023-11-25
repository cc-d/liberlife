import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Grid,
  Link,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { GoalOut } from '../../../api';
import { useThemeContext } from '../../../contexts/ThemeContext';

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
  const sharedPL = 0.5;

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
      <IconButton onClick={onEdit}>
        <EditIcon />
      </IconButton>
    </Box>
  );
};

const renderFormattedNotes = (goal: GoalOut) => {
  let i = 0;
  const elements: JSX.Element[] = [];
  const notes = goal?.notes || '';

  while (i < notes.length) {
    const startLinkText = notes.indexOf('[', i);
    const endLinkText = notes.indexOf(']', startLinkText + 1); // Ensure we're looking after the start
    const startLinkURL = notes.indexOf('(', endLinkText + 1); // Ensure we're looking after the end of link text
    const endLinkURL = notes.indexOf(')', startLinkURL + 1); // Ensure we're looking after the start of link URL

    // If any of the tags aren't found, break the loop
    if (
      startLinkText === -1 ||
      endLinkText === -1 ||
      startLinkURL === -1 ||
      endLinkURL === -1
    ) {
      break;
    }

    // Push any text before the link
    if (startLinkText > i) {
      elements.push(
        <span key={i}>{removeNewlines(notes.substring(i, startLinkText))}</span>
      );
    }

    // Extract the link text and URL
    const linkText = notes.substring(startLinkText + 1, endLinkText);
    const linkURL = notes.substring(startLinkURL + 1, endLinkURL);

    // Push the link element
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
  }

  // Add any remaining text after the last link
  if (i < notes.length) {
    elements.push(<span key={i}>{removeNewlines(notes.substring(i))}</span>);
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

  return (
    <Box sx={{ m: 0, maxWidth: '100%', p: 0.5 }}>
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
          />
          <IconButton onClick={handleSaveNotes}>
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

              width: '100%',
            }}
          >
            <Typography
              color={goal?.notes ? 'textPrimary' : 'textSecondary'}
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
            >
              <EditIcon />
            </IconButton>
          </Box>
          <Typography
            variant="caption"
            color={theme.theme.palette.text.secondary}
            noWrap
            sx={{
              textAlign: 'right',
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
        <NoNotesView
          latestUpdate={latestUpdate}
          onEdit={() => setIsEditingNotes(true)}
        />
      )}
    </Box>
  );
};

export default GoalNotes;
