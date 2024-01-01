import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  IconButton,
} from '@mui/material';
import { GoalTemplateDB } from '../../api';
import { useThemeContext } from '../../contexts/ThemeContext';
import Task from '@mui/icons-material/Task';
import { TemplateIcon } from '../../components/common';
import { Delete, DisabledByDefaultTwoTone } from '@mui/icons-material';
import { isDisabled } from '@testing-library/user-event/dist/utils';

const TemplateDialog: React.FC<{
  openDialog: boolean;
  handleCloseDialog: () => void;
  currentTemplate: GoalTemplateDB | null;
  setCurrentTemplate: React.Dispatch<
    React.SetStateAction<GoalTemplateDB | null>
  >;
  newTask: string;
  useTodaysDate: boolean;
  setUseTodaysDate: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddTask: () => void;
  handleDeleteTask: (index: number) => void;
  handleSaveTemplate: () => void;
  handleTemplateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleTaskChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({
  openDialog,
  handleCloseDialog,
  currentTemplate,
  setCurrentTemplate,
  newTask,
  useTodaysDate,
  setUseTodaysDate,
  handleAddTask,
  handleDeleteTask,
  handleSaveTemplate,
  handleTemplateChange,
  handleTaskChange,
}) => {
  const { theme } = useThemeContext();
  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <DialogTitle>
        {currentTemplate?.id ? 'Edit Template' : 'New Template'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="templateText"
          label="Template Text"
          fullWidth
          variant="outlined"
          value={currentTemplate?.text || ''}
          onChange={handleTemplateChange}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            p: 0,
            m: 0,
            justifyContent: 'flex-start',
            width: '100%',
          }}
        >
          {currentTemplate ? (
            <>
              <Checkbox
                checked={useTodaysDate}
                disabled={true}
                onClick={(e) => {
                  return;
                  /* commented out as it no longer should be updatable */
                  //e.stopPropagation();
                  //e.preventDefault();
                  //setCurrentTemplate({
                  //  ...currentTemplate,
                  //  use_todays_date: !useTodaysDate,
                  //});
                  //setUseTodaysDate(!useTodaysDate);
                }}
              />

              <Typography>Include today's date in title?</Typography>
            </>
          ) : null}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            m: 0,
            p: 0,
          }}
        >
          <TextField
            margin="dense"
            id="templateTask"
            label="Add Task"
            fullWidth
            variant="outlined"
            value={newTask}
            onChange={handleTaskChange}
          />

          <Button
            variant="contained"
            sx={{
              p: 0,
              m: 0,
              minWidth: '100px',
              height: '60px',
              alignSelf: 'flex-end',
            }}
            onClick={handleAddTask}
          >
            Add Task
          </Button>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            m: 0,
            p: 0,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              m: 0,
              p: 0,
              py: 1,
              color: theme.palette.text.primary,
            }}
          >
            Tasks
          </Typography>

          {currentTemplate && currentTemplate.tasks && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                maxWidth: 'min(98vw, 500px)',
                overflow: 'hidden',
              }}
            >
              {currentTemplate.tasks.map((task, index) => (
                <Box
                  key={`${task.text}-${index}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    p: 1,

                    pl: 0,
                  }}
                >
                  <IconButton
                    sx={{
                      p: 0,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleDeleteTask(index);
                    }}
                  >
                    <Delete />
                  </IconButton>
                  <Typography sx={{}}>{task.text}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleCloseDialog}>
          Cancel
        </Button>
        <Button variant="contained" onClick={() => handleSaveTemplate()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TemplateDialog;
