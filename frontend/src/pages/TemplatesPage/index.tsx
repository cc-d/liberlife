import React, { useState, useEffect, useMemo } from 'react';
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
  Checkbox,
  IconButton,
} from '@mui/material';
import apios from '../../utils/apios';
import { GoalTemplateDB, TemplateTaskDB } from '../../api';
import { useThemeContext } from '../../contexts/ThemeContext';
import { TemplateIcon } from '../../components/common';
import { Delete, Task } from '@mui/icons-material';
import TemplateItem from './TemplateItem';
import TemplateDialog from './TempDialog';

const TemplatePage = () => {
  const [templates, setTemplates] = useState<GoalTemplateDB[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<GoalTemplateDB | null>(
    null
  );
  const [newTask, setNewTask] = useState('');
  const [useTodaysDate, setUseTodaysDate] = useState(false);
  const { theme } = useThemeContext();

  useEffect(() => {
    fetchTemplates();
  }, []);

  useMemo(() => {
    if (currentTemplate) {
      setUseTodaysDate(currentTemplate.use_todays_date);
    }
  }, [templates, openDialog]);

  useMemo(() => {
    // set open dialog correctly
  }, [currentTemplate?.tasks]);

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
    console.log('currentTemplate', currentTemplate);
    if (currentTemplate && currentTemplate.id) {
      const newTemp = await apios.put(`/templates/${currentTemplate.id}`, {
        text: currentTemplate.text,
        tasks: currentTemplate.tasks,
        use_todays_date: useTodaysDate,
      });
      setCurrentTemplate(null);
      setTemplates(
        templates.map((template) =>
          template.id === newTemp.data.id ? newTemp.data : template
        )
      );
    } else {
      if (!currentTemplate) {
        return;
      }
      const newTemp = await apios.post('/templates', {
        text: currentTemplate.text,
        tasks: currentTemplate.tasks,
        use_todays_date: useTodaysDate,
      });
      setCurrentTemplate(null);
      setTemplates([...templates, newTemp.data]);
    }
    handleCloseDialog();
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
        maxWidth: '100vw',
      }}
    >
      <Typography variant="h4">Goal Templates</Typography>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleOpenDialog(null);
        }}
        variant="contained"
        sx={{ my: 1 }}
      >
        Create New Template
      </Button>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          maxWidth: '100vw',
          flexWrap: 'wrap',
        }}
      >
        <TemplateItem
          templates={templates}
          handleOpenDialog={handleOpenDialog}
          handleDeleteTemplate={handleDeleteTemplate}
        />
      </Box>
      <TemplateDialog
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        currentTemplate={currentTemplate}
        setCurrentTemplate={setCurrentTemplate}
        newTask={newTask}
        useTodaysDate={useTodaysDate}
        setUseTodaysDate={setUseTodaysDate}
        handleAddTask={handleAddTask}
        handleDeleteTask={handleDeleteTask}
        handleSaveTemplate={handleSaveTemplate}
        handleTemplateChange={handleTemplateChange}
        handleTaskChange={handleTaskChange}
      />
    </Box>
  );
};

export default TemplatePage;
