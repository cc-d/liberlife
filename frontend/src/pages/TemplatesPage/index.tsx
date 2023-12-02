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
} from '@mui/material';
import apios from '../../utils/apios';
import { GoalTemplateDB } from '../../api';

const TemplatePage = () => {
  const [templates, setTemplates] = useState<GoalTemplateDB[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<GoalTemplateDB | null>(
    null
  );

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
      });
    } else if (currentTemplate) {
      await apios.post('/templates', { text: currentTemplate.text });
    }
    handleCloseDialog();
    fetchTemplates();
  };

  const handleDeleteTemplate = async (templateId: string) => {
    await apios.delete(`/templates/${templateId}`);
    fetchTemplates();
  };

  return (
    <Box>
      <Typography variant="h4">Goal Templates: {templates.length}</Typography>
      <Button onClick={() => handleOpenDialog(null)}>
        Create New Template
      </Button>
      <List>
        {templates.map((iterTemp) => (
          <ListItem key={iterTemp.id}>
            {iterTemp.text}
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
          </ListItem>
        ))}
      </List>

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
