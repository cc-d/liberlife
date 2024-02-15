import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useThemeContext } from '../../contexts/ThemeContext';
import apios from '../../utils/apios';
import { GoalTemplateDB } from '../../api';
import { TemplateIcon } from '../../components/common';
import TodayIcon from '@mui/icons-material/Today';

export const GoalCreateBtn: React.FC<{
  newGoalText: string;
  setNewGoalText: React.Dispatch<React.SetStateAction<string>>;
  handleAddGoal: (text?: string, templateId?: string) => void;
  handleTextChange: (val: string, submit?: boolean) => void;
}> = ({ newGoalText, setNewGoalText, handleAddGoal, handleTextChange }) => {
  const { theme } = useThemeContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTodayDate = () => {
    const today = new Date();
    const formattedDate = `${today.toLocaleString('default', {
      month: 'short',
    })} ${today.getDate()}, ${today.getFullYear()}`;

    // Set the new goal text with the formatted date
    handleTextChange(formattedDate, true);
    handleClose();

    return formattedDate;
  };

  const [templates, setTemplates] = useState<GoalTemplateDB[]>([]);
  const textFieldSX = {
    m: 0,
    p: 0,
    py: '17px',
    px: '14px',
  };

  useEffect(() => {
    // Function to fetch templates
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

  const handleTemplateSelect = async (templateId: string) => {
    templates.forEach((template: GoalTemplateDB) => {
      if (template.id.toString() === templateId) {
        // Set the new goal text with the template text
        let newGoalText = template.text;
        if (template.use_todays_date) {
          let curDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
          newGoalText = `${curDate} ${newGoalText}`;
        }
        handleAddGoal(newGoalText, templateId);
        handleClose();
        return;
      }
    });
  };

  const boxSX = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    p: 0.5,
    m: 0,
    justifyContent: 'space-between',
    width: '100%',
  };

  const menuItemIconSX = {
    mr: 1,
    height: '36px',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        m: 0,
        p: 0,
        mb: 1,
      }}
    >
      <TextField
        variant="outlined"
        placeholder="New goal..."
        value={newGoalText}
        onChange={(e) => handleTextChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleAddGoal();
          } else if (e.key === 'Escape') {
            setNewGoalText('');
          }
        }}
        sx={{
          borderRadius: 0,
          borderTopLeftRadius: 1,
          borderBottomLeftRadius: 1,
        }}
      />
      <IconButton
        sx={{
          ...textFieldSX,
          borderRadius: 0,
          borderTopLeftRadius: 1,
          backgroundColor: theme.palette.primary.main,
          alignItems: 'center',
          justifyContent: 'space-between',
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
          },
          '&:active': {
            backgroundColor: theme.palette.primary.main,
          },
        }}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          handleAddGoal();
        }}
      >
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            color: theme.palette.primary.contrastText,
            textAlign: 'center',

            mr: 0.5,
          }}
        >
          Add
        </Typography>
      </IconButton>
      <IconButton
        sx={{
          ...textFieldSX,
          pl: 0.5,
          pr: 0.5,
          backgroundColor: theme.palette.secondary.main,
          borderRadius: 0,
          borderBottomRightRadius: 1,
          borderTopRightRadius: 1,
        }}
        onClick={handleClick}
      >
        <ArrowDownIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} sx={{}}>
        <MenuItem onClick={() => handleTodayDate() && handleAddGoal()}>
          <Box
            sx={{
              ...boxSX,
              maxWidth: '200px',
            }}
          >
            <TodayIcon
              sx={{
                ...menuItemIconSX,
              }}
            />
            <Typography
              variant="body1"
              sx={{
                flexGrow: 1,
                m: 0,
                p: 0,
              }}
            >
              Today's Date
            </Typography>
          </Box>
        </MenuItem>
        {templates &&
          templates !== undefined &&
          templates?.map &&
          templates.map((template: GoalTemplateDB) => (
            <MenuItem
              key={template.id}
              onClick={() => handleTemplateSelect(template.id.toString())}
            >
              <Box
                sx={{
                  ...boxSX,
                }}
              >
                <TemplateIcon
                  sx={{
                    ...menuItemIconSX,
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    flexGrow: 1,
                    m: 0,
                    p: 0,
                  }}
                >
                  {template.text}
                </Typography>
              </Box>
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
};

export default GoalCreateBtn;
