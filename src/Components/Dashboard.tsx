import * as React from 'react';
import { connect, useSelector } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Deposits from './Deposits';
import FormInputs from './FormInputs';
import { LoanDetails } from '../Domain/FormField';
import NestedTable from './nestedTable'; // Update the import path as needed
import { IAmortizationScheduleItem } from '../type';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";

import {
  getAmortizationItems,
  getState,
  saveState,
  updateAmortizationItem,
  updateLoadDetails,
  resetAmortization
} from '../store/actions';
import { RootState } from '../store/store';
import { showTableSelector } from '../store/AmortizationSelectors';
import DrawerComponent from './Drawer';
import HeaderComponent from './Header';



interface DashboardProps {
  getAmortizationItems: () => void;
  updateLoadDetails: (loanDet: LoanDetails) => void;
  updateAmortizationItem: (updatedItem: IAmortizationScheduleItem) => void;
  saveState: (user: string) => void;
  getState: (user: string) => void;
  resetAmortization: () => void;
}
// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const Dashboard: React.FC<DashboardProps> = ({
  getAmortizationItems,
  updateLoadDetails,
  updateAmortizationItem,
  saveState,
  getState,
  resetAmortization
  // ... (rest of the props)
}) => {
  const navigate = useNavigate();

  const { param: profileName = "No Name" } = useParams();

  React.useEffect(() => {
    getState(profileName);
  }, []); // Empty dependency array to run only on mount



  const showTable = useSelector(showTableSelector);
  const amortizationScheduleItems = useSelector(
    (state: RootState) => state.amortization.amortizationScheduleItems
  );
  const initialLoanDet: LoanDetails = useSelector((state: RootState) => state.amortization.loanDet);
  
  const [open, setOpen] = React.useState(true);


  const onSubmitCallBack = (loanDet: LoanDetails) => {
    updateLoadDetails(loanDet);
    getAmortizationItems();
  };
  const onUpdateCallBack = (updatedItem: IAmortizationScheduleItem) => {
    updateAmortizationItem(updatedItem);
    getAmortizationItems();
  };
  const toggleDrawer = () => setOpen(!open);
  const handleSaveClick = () => saveState(profileName);
  const handleSignOut = () => {
    resetAmortization();
    navigate('/');
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <HeaderComponent
          {...{
            open,
            showTable,
            toggleDrawer,
            name: profileName,
            handleSaveClick,
            handleSignOut,
          }}
        />

        <DrawerComponent open={open} toggleDrawer={toggleDrawer}></DrawerComponent>
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
              {/*  form input */}
              <Grid item xs={12} md={8} lg={9}>
                <FormInputs onSubmit={onSubmitCallBack} loanDetails={initialLoanDet} />
              </Grid>

              {/* amortizationScheduleItems */}
              {showTable && (
                <React.Fragment>
                  <Grid item xs={12} md={4} lg={3}>
                    <Deposits />
                  </Grid>
                  <Grid item xs={12}>
                    <NestedTable
                      data={amortizationScheduleItems}
                      updateAmortizationItem={onUpdateCallBack} />
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
  getState,
  resetAmortization
})(Dashboard);