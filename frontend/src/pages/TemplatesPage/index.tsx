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
  }, [templates]);

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
          sx={{
            //backgroundColor: theme.palette.background.paper,
            p: 1,
            m: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: 'fit-content',
            border: '1px solid',

            flexWrap: 'wrap',
            borderRadius: '5px',
            flexGrow: 1,
            flexShrink: 1,
            alignSelf: 'flex-start',
          }}
        >
          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            Template
          </Typography>
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

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              m: 0,
              p: 0,
            }}
          >
            {iterTemp.tasks && iterTemp.tasks.length > 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  alignSelf: 'right',

                  m: 0,
                  p: 0,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    alignSelf: 'flex-start',

                    m: 0,
                    p: 0,
                  }}
                >
                  {iterTemp.tasks.map((task, index) => (
                    <ListItem key={index}>
                      <Task />
                      <Typography>{task.text}</Typography>
                    </ListItem>
                  ))}
                </Box>
              </Box>
            ) : null}

            {/* Add template dialog */}
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
              </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleSaveTemplate()}
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default TemplatePage;
