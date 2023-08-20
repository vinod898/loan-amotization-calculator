import * as React from 'react';
import { connect, useSelector } from 'react-redux';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SaveIcon from '@mui/icons-material/Save';
import Avatar from '@mui/material/Avatar'; // Import Avatar component
import { mainListItems, secondaryListItems } from './listItems';
import Deposits from './Deposits';
import FormInputs from './FormInputs';
import { LoanDetails } from '../Domain/FormField';
import NestedTable from './nestedTable'; // Update the import path as needed
import { IAmortizationScheduleItem } from '../type';
import { useNavigate } from 'react-router-dom';
import { Outlet, useParams } from "react-router-dom";

import {
  getAmortizationItems,
  getState,
  saveState,
  updateAmortizationItem,
  updateLoadDetails
} from '../store/actions';
import { RootState } from '../store/store';
import { showTableSelector } from '../store/AmortizationSelectors';



interface DashboardProps {
  getAmortizationItems: () => void;
  updateLoadDetails: (loanDet: LoanDetails) => void;
  updateAmortizationItem: (updatedItem: IAmortizationScheduleItem) => void;
  saveState: (user: string) => void;
  getState: (user: string) => void;
}


const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

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

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const Dashboard: React.FC<DashboardProps> = ({
  getAmortizationItems,
  updateLoadDetails,
  updateAmortizationItem,
  saveState,
  getState
  // ... (rest of the props)
}) => {
  const navigate = useNavigate();

  const { param } = useParams();
  const [profileData, setProfileData] = React.useState({
    name: param?? 'No Name', // Replace with actual user's name
    // Add other profile info here
  });
  React.useEffect(() => {
    getState(profileData.name);
  }, []); // Empty dependency array to run only on mount

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);


  const showTable = useSelector(showTableSelector);
  const amortizationScheduleItems = useSelector(
    (state: RootState) => state.amortization.amortizationScheduleItems
  );
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const onSubmitCallBack = (loanDet: LoanDetails) => {
    updateLoadDetails(loanDet);
    getAmortizationItems();
  };


  const onUpdateCallBack = (updatedItem: IAmortizationScheduleItem) => {
    updateAmortizationItem(updatedItem);
    getAmortizationItems();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleSaveClick = () => {
   
    saveState(profileData.name);
  };

  const handleSignOut = () => {
    
    navigate('/');
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
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
            {showTable && <IconButton color="inherit" onClick={handleSaveClick}>
              <SaveIcon sx={{ color: 'white' }} />
            </IconButton>}
            <Avatar
              alt={profileData.name}
              src="/path/to/avatar-image.jpg" // Replace with the actual image URL
              sx={{
                marginLeft: '10px',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
              onClick={(event) => setAnchorEl(event.currentTarget)}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleClose}>
                <Typography variant="body1">
                  Welcome, {profileData.name}
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
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
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
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'auto',
                  }}
                >
                  <FormInputs onSubmit={onSubmitCallBack} />
                </Paper>
              </Grid>

              {/* Recent Deposits */}
              {showTable && (
                <React.Fragment>
                  <Grid item xs={12} md={4} lg={3}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                      }}
                    >
                      <Deposits />
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper
                      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}
                    >
                      <NestedTable data={amortizationScheduleItems}
                        updateAmortizationItem={onUpdateCallBack} />
                    </Paper>
                  </Grid>
                </React.Fragment>
              )}

            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
const mapStateToProps = (state: RootState) => ({
  amortizationScheduleItems: state.amortization.amortizationScheduleItems,
  showTable: showTableSelector(state),
});

export default connect(mapStateToProps, {
  getAmortizationItems,
  updateLoadDetails,
  updateAmortizationItem,
  saveState,
  getState
})(Dashboard);