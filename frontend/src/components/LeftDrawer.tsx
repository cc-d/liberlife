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
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ArchiveIcon from '@mui/icons-material/Archive';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import TaskSharp from '@mui/icons-material/TaskSharp';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const TextIcon: React.FC<any> = ({ text, icon }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      flexGrow: 1,
      justifyContent: 'flex-start',
    }}
  >
    <ListItemIcon
      sx={{
        display: 'flex',
        p: 0,
        m: 0,
      }}
    >
      {icon}
    </ListItemIcon>
    <ListItemText
      sx={{
        display: 'flex',
        p: 0,
        m: 0,
      }}
      primary={text}
    />
  </Box>
);

const ListItemLink: React.FC<any> = ({ to, icon, primary, onClick }) => (
  <ListItem
    onClick={onClick}
    sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}
  >
    {to ? (
      <Link component={RouterLink} to={to} color="inherit">
        <TextIcon text={primary} icon={icon} />
      </Link>
    ) : (
      <TextIcon text={primary} icon={icon} />
    )}
  </ListItem>
);

const UserTopLeft: React.FC<any> = ({ user }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <AccountCircleIcon sx={{ height: '3rem', width: '3rem' }} />
      <Typography
        variant="h6"
        sx={{ ml: 1, color: 'inherit', flexGrow: 1, alignSelf: 'center' }}
      >
        {user}
      </Typography>
    </Box>
  );
};

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
}) => {
  const auth = useAuth();

  return (
    <Drawer open={dIsOpen} onClose={dToggle}>
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={dToggle}
        onKeyDown={dToggle}
      >
        <UserTopLeft user="User" />
        <List>
          <ListItemLink
            to="/"
            icon={<HomeIcon />}
            primary="Home"
            onClick={() => setShowArchived(false)}
          />
          <ListItemLink
            to="/profile"
            icon={<AccountCircleIcon />}
            primary="Profile"
            onClick={() => setShowArchived(false)}
          />

          <ListItemLink
            to="/login"
            icon={<LogoutIcon />}
            primary="Logout"
            onClick={() => setShowArchived(false)}
          />
        </List>
      </Box>
    </Drawer>
  );
};
export default LeftDrawer;
