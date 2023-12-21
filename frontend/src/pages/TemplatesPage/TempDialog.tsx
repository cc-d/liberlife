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
import { Delete } from '@mui/icons-material';

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
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setCurrentTemplate({
                    ...currentTemplate,
                    use_todays_date: !useTodaysDate,
                  });
                  setUseTodaysDate(!useTodaysDate);
                }}
              />

              <Typography>Use today's date?</Typography>
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

          {currentTemplate &&
            currentTemplate.tasks &&
            currentTemplate.tasks.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  maxWidth: 'calc(min(100vw, 500px) - 32px)',

                  overflow: 'auto',
                  m: 1,
                  p: 1,
                }}
              >
                {currentTemplate.tasks.map((task, index) => (
                  <Box
                    key={`${task.text}-${index}`}
                    sx={{
                      display: 'inline-flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      flexGrow: 1,
                      maxWidth: '100%',
                      p: 1,
                      minWidth: '100px',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <IconButton
                      sx={{
                        display: 'inline-flex',
                        float: 'left',
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
