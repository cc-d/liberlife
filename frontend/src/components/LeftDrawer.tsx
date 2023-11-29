import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Link,
  Typography,
  Box,
  Container,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ArchiveIcon from '@mui/icons-material/Archive';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import TaskSharp from '@mui/icons-material/TaskSharp';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavBarContext } from '../contexts/NavBarContext';
import { useThemeContext } from '../contexts/ThemeContext';

const TextIcon: React.FC<any> = ({ text, icon, theme }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      flexDirection: 'row',
      flexGrow: 1,
      justifyContent: 'left',
      color: theme.theme.palette.text.primary,
    }}
  >
    <ListItemIcon
      sx={{
        display: 'flex',
        p: 0,
        m: 0,
        justifyContent: 'left',
      }}
    >
      {icon}
    </ListItemIcon>
    <ListItemText
      sx={{
        display: 'flex',
        p: 0,
        m: 0,
        textAlign: 'left',
        justifyContent: 'left',
      }}
      primary={text}
    />
  </Box>
);
const ListItemLinkElem: React.FC<any> = ({
  to,
  icon,
  primary,
  onClick,
  theme,
}) => (
  <ListItem
    onClick={onClick}
    sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}
  >
    {to ? (
      <Link component={RouterLink} to={to} color="inherit">
        <TextIcon text={primary} icon={icon} theme={theme} />
      </Link>
    ) : (
      <TextIcon text={primary} icon={icon} theme={theme} />
    )}
  </ListItem>
);

interface LeftDrawerProps {
  dIsOpen: boolean;
  dToggle: () => void; // Corrected function type
  showArchived: boolean;
  setShowArchived: (show: boolean) => void;
}
export const LeftDrawer: React.FC<LeftDrawerProps> = ({
  dIsOpen,
  dToggle,
  showArchived,
  setShowArchived,

  // ... other props
}) => {
  const theme = useThemeContext();
  const { goals } = useNavBarContext(); // Assuming these lists are available
  const SectionTitle: React.FC<any> = ({ title }) => {
    return (
      <Typography
        variant="subtitle1"
        sx={{ marginLeft: 2, marginTop: 2, fontWeight: 'bold' }}
      >
        {title}
      </Typography>
    );
  };

  const archivedGoals = goals.filter((goal: any) => goal.archived);

  return (
    <Drawer open={dIsOpen} onClose={dToggle}>
      <Box sx={{ width: 250 }} role="presentation">
        {/* Header */}
        <Box sx={{ padding: 2, textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', fontFamily: 'Arial', textAlign: 'left' }}
          >
            life.liberfy.ai
          </Typography>
        </Box>
        <Divider />

        <List>
          {/* Static Links */}
          <ListItemLinkElem
            to="/"
            icon={<HomeIcon />}
            primary="Home"
            theme={theme}
          />
          <ListItemLinkElem
            to="/profile"
            icon={<AccountBoxIcon />}
            primary="Profile"
            theme={theme}
          />
          <ListItemLinkElem
            to="/login"
            icon={<LogoutIcon />}
            primary="Logout"
            theme={theme}
          />
          <Divider />

          {/* Dynamic Sections */}
          <SectionTitle title="Goals" />
          {goals.map((goal: any) => (
            <ListItem
              key={goal.id}
              sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
            >
              <ListItemText primary={goal.name} />
            </ListItem>
          ))}
          <SectionTitle title="Archived Goals" />
          {archivedGoals.map((goal: any) => (
            <ListItem
              key={goal.id}
              sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
            >
              <ListItemText primary={goal.name} />
            </ListItem>
          ))}
          <SectionTitle title="Snapshots" />
          {/* Add tasks and snapshots here */}
        </List>
      </Box>
    </Drawer>
  );
};

export default LeftDrawer;
