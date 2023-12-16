import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  IconButton,
} from '@mui/material';
import apios from '../../utils/apios';
import { GoalTemplateDB, TemplateTaskDB } from '../../api';
import { useThemeContext } from '../../contexts/ThemeContext';
import { TemplateIcon } from '../../components/common';
import { Delete, Task } from '@mui/icons-material';

const TemplatePage = () => {
  const [templates, setTemplates] = useState<GoalTemplateDB[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<GoalTemplateDB | null>(
    null
  );
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await apios.get('/templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates', error);
    }
  };

  const handleTemplateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTemplate({
      ...currentTemplate,
      text: event.target.value,
    } as GoalTemplateDB);
  };

  const handleOpenDialog = (template: GoalTemplateDB | null) => {
    setOpenDialog(true);
    setCurrentTemplate(template ?? null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTemplate(null);
  };

  const handleSaveTemplate = async () => {
    if (currentTemplate && currentTemplate.id) {
      await apios.put(`/templates/${currentTemplate.id}`, {
        text: currentTemplate.text,
        tasks: currentTemplate.tasks, // Include tasks when updating
      });
    } else if (currentTemplate) {
      await apios.post('/templates', {
        text: currentTemplate.text,
        tasks: currentTemplate.tasks, // Include tasks when creating
      });
    }
    handleCloseDialog();
    fetchTemplates();
  };
  const handleDeleteTemplate = async (templateId: string) => {
    await apios.delete(`/templates/${templateId}`);
    fetchTemplates();
  };

  const handleTaskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask(event.target.value);
  };
  const handleAddTask = () => {
    if (currentTemplate) {
      const newTasks = [
        ...(currentTemplate.tasks || []),
        { text: newTask } as TemplateTaskDB,
      ];
      setCurrentTemplate({ ...currentTemplate, tasks: newTasks });
      setNewTask('');
    }
  };

  const handleDeleteTask = (index: number) => {
    if (currentTemplate) {
      const newTasks = [...(currentTemplate.tasks || [])];
      newTasks.splice(index, 1);
      setCurrentTemplate({ ...currentTemplate, tasks: newTasks });
    }
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        m: 0,
        p: 0,
        mb: 1,
      }}
    >
      <Typography variant="h4">Goal Templates</Typography>
      <Button
        onClick={() => handleOpenDialog(null)}
        variant="outlined"
        sx={{ my: 1 }}
      >
        Create New Template
      </Button>

      {templates.map((iterTemp) => (
        <Box
          key={iterTemp.id}
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          <TemplateIcon sx={{ mr: 1 }} />
          <Typography>{iterTemp.text}</Typography>
          <Button onClick={() => handleOpenDialog(iterTemp)}>Edit</Button>
          <Button
            onClick={() =>
              iterTemp &&
              iterTemp.id &&
              handleDeleteTemplate(iterTemp.id.toString())
            }
          >
            Delete
          </Button>
        </Box>
      ))}

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
              alignItems: 'flex-start',
              m: 0,
              p: 0,
              mb: 1,
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
          {currentTemplate?.tasks?.map((task, index) => (
            <Box
              key={index}
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              <Typography
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexGrow: 1,
                }}
              >
                <Task sx={{ mr: 1 }} />
                {task.text}
              </Typography>
              <IconButton onClick={() => handleDeleteTask(index)}>
                <Delete />
              </IconButton>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTemplate}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TemplatePage;
