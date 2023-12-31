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
import FormattedGoalNotes from './FormattedGoalNotes';

interface GoalNotesProps {
  goal: GoalOut;
  onSaveNotes: (notes: string | null) => void;
  latestUpdate: string | null;
}

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
        {elemType === 'created' ? (
          <AddCircleOutlineIcon sx={dIconSX} />
        ) : (
          <SyncIcon sx={dIconSX} />
        )}
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
      ) : (
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
            <FormattedGoalNotes goal={goal} />
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
