import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SaveIcon from '@mui/icons-material/Save';
import Avatar from '@mui/material/Avatar'; // Import Avatar component

const drawerWidth: number = 240;


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


interface HeaderComponentProps {
  open: boolean; // Explicitly define the type as boolean
  toggleDrawer: () => void;
  handleSaveClick: () => void;
  name: string;
  handleSignOut: () => void;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  open,
  toggleDrawer,
  handleSaveClick,
  name,
  handleSignOut,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);


  React.useEffect(() => {
    // Add a click event listener to the document
    const handleDocumentClick = (event: MouseEvent) => {
      // Check if the clicked element is not the avatar or the menu
      if (
        anchorEl &&
        !anchorEl.contains(event.target as Node) &&
        !document.getElementById('menu-anchor')?.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    // Attach the event listener
    document.addEventListener('click', handleDocumentClick);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [anchorEl]);
  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <AppBar position="absolute" open={open} >
      <Toolbar
        sx={{
          pr: '24px', // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: '36px',
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          Loan Amortization
        </Typography>
        {<IconButton color="inherit" onClick={handleSaveClick}>
          <SaveIcon sx={{ color: 'white' }} />
        </IconButton>}
        <Avatar
          id="avatar-anchor" // Assign an ID to the Avatar element
          alt={name}
          src="/path/to/avatar-image.jpg" // Replace with the actual image URL
          sx={{
            marginLeft: '10px',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8,
            },
          }}
          onClick={(event) => {
            setAnchorEl(event.currentTarget)
          }}
        />
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleClose}>
            <Typography variant="body1">
              Welcome, {name}
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>
            <Typography variant="body2" color="textSecondary">
              Profile
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Typography variant="body2" color="textSecondary">
              Settings
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleSignOut}>
            <Typography variant="body2" color="error">
              Sign Out
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderComponent;
