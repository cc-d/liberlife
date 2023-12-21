import React from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';
import { GoalTemplateDB } from '../../api';
import { useThemeContext } from '../../contexts/ThemeContext';
import Task from '@mui/icons-material/Task';
import { TemplateIcon } from '../../components/common';

const TemplateItem: React.FC<{
  templates: GoalTemplateDB[];
  handleOpenDialog: (template: GoalTemplateDB) => void;
  handleDeleteTemplate: (templateId: string) => void;
}> = ({ templates, handleOpenDialog, handleDeleteTemplate }) => {
  const { theme } = useThemeContext();

  return (
    <>
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
    </>
  );
};

export default TemplateItem;
