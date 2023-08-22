import React from 'react';
import { IconButton, Divider, List, Toolbar } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { mainListItems, secondaryListItems } from './listItems';
import MuiDrawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';

const drawerWidth: number = 240;


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: theme.spacing(7),
          [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
          },
        }),
      },
    }),
  );

interface DrawerComponentProps {
    open: boolean; // Explicitly define the type as boolean
    toggleDrawer: () => void;
}

const DrawerComponent: React.FC<DrawerComponentProps> = ({ open, toggleDrawer }) => {
    return (
        <Drawer variant="permanent" open={open}>
            <Toolbar>
                <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
                {mainListItems}
                <Divider sx={{ my: 1 }} />
                {secondaryListItems}
            </List>
        </Drawer>
    );
};

export default DrawerComponent;
