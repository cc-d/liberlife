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
              maxWidth: 'fit-content',
              border: `1px solid ${theme.palette.divider}`,

              flexWrap: 'wrap',
              borderRadius: '5px',
              flexGrow: 1,
              flexShrink: 1,
              alignSelf: 'flex-start',
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Box
              key={iterTemp.id}
              display="flex"
              flexDirection="row"
              sx={{
                fontSize: '1.5rem',
              }}
            >
              <Typography variant="h5">
                <TemplateIcon sx={{ mr: 1 }} />
                {iterTemp.text}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                m: 0,
                p: 0,
                width: '100%',
              }}
            >
              <Button
                variant="contained"
                onClick={() => handleOpenDialog(iterTemp)}
                color="primary"
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                onClick={() =>
                  iterTemp &&
                  iterTemp.id &&
                  handleDeleteTemplate(iterTemp.id.toString())
                }
                color="error"
              >
                Delete
              </Button>
            </Box>
            <Divider
              sx={{
                height: '4px',
                width: '100%',
                backgroundColor: theme.palette.divider,
                my: 1,
              }}
            />

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
                    width: '100%',
                    m: 0,
                    p: 0,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',

                      m: 0,
                      p: 0,
                    }}
                  >
                    {iterTemp.tasks.map((task, index) => (
                      <Box
                        key={index}
                        sx={{
                          Display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: '100%',
                          flexWrap: 'wrap',
                          p: 1,
                          justifyContent: 'left',
                          textAlign: 'left',
                          //border: '1px solid pink',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Typography
                          sx={{
                            display: 'inline-flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            flexGrow: 1,
                            flexWrap: 'nowrap',
                          }}
                        >
                          <Task
                            sx={{
                              mr: 1,
                            }}
                          />
                          {task.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : null}
            </Box>
          </Box>
        ))}
      </Box>

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
    </Box>
  );
};

export default TemplatePage;
