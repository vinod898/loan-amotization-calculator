import * as React from 'react';
import { connect, useSelector } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import FormInputs from './FormInputs';
import { LoanDetails } from '../Domain/FormField';
import NestedTable from './nestedTable'; // Update the import path as needed
import { IAmortizationScheduleItem, IAmortizationScheduleItemByYear } from '../type';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import DrawerComponent from './Drawer';
import HeaderComponent from './Header';
import Summery from './summery';
import { AmortizationMetaData } from '../Domain/AmortizationData';
import { calcAmortizationScheduleItems } from '../utils/utils';


const defaultTheme = createTheme();

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [loanDetails, setLoanDetails] = React.useState({} as LoanDetails);
  const [amortizationScheduleItems, setAmortizationScheduleItems] = React.useState([] as IAmortizationScheduleItemByYear[]);
  const { param: profileName = "No Name" } = useParams();



  const [open, setOpen] = React.useState(true);


  const onSubmitCallBack = (loanDet: LoanDetails) => {
    // updateLoadDetails(loanDet);
    // getAmortizationItems();
  };
  const onUpdateCallBack = (updatedItem: IAmortizationScheduleItem) => {

    // updateAmortizationItem(updatedItem);
    // getAmortizationItems();
  };
  const toggleDrawer = () => setOpen(!open);
  const handleSaveClick = () => { } //saveState(profileName);
  const handleSignOut = () => {
    //  resetAmortization();
    navigate('/');
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <HeaderComponent
          {...{
            open,
            toggleDrawer,
            name: profileName,
            handleSaveClick,
            handleSignOut,
          }} />

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
              <Grid item xs={9} md={9} lg={9}>
                <FormInputs onSubmit={onSubmitCallBack} loanDetails={loanDetails} />
              </Grid>

              {/* amortizationScheduleItems */}
              {amortizationScheduleItems.length > 0 && (
                <React.Fragment>
                  <Grid item xs={3} md={3} lg={3}>
                    <Summery data={amortizationScheduleItems} loanDetails={loanDetails} />
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

export default Dashboard;