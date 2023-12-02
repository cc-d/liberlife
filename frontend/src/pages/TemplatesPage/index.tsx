import React, { useState, useEffect } from 'react';
import { Box, Button, List, ListItem, Typography } from '@mui/material';
import apios from '../../utils/apios';
import { GoalTemplateDB } from '../../api';

const TemplatePage = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await apios.get('/templates');
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates', error);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <Box>
      <Typography variant="h4">Goal Templates: {templates.length}</Typography>
      <List>
        {templates.map((template: GoalTemplateDB) => (
          <ListItem key={template.id}>
            {template.text}
            {/* Add buttons for editing and deleting templates */}
          </ListItem>
        ))}
      </List>
      {/* Add a button to create a new template */}
    </Box>
  );
};

export default TemplatePage;
