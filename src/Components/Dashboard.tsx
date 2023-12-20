import * as React from 'react';
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
import { getAmortizationactualMetaData } from '../Services/amortizationService';
import { AmortizationMetaData } from '../Domain/AmortizationData';
import { calcAmortizationScheduleItems } from '../utils/utils';


const defaultTheme = createTheme();

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // AmortizationMetaData
  const [amortizationMetaData, setAmortizationMetaData] = React.useState<AmortizationMetaData | null>(null);
  const { param: userId = "" } = useParams();

  React.useEffect(() => {
    // Define an async function to fetch forecast data
    const fetchForecastData = async () => {
      try {
        // Fetch forecast data for the logged-in user (assuming user ID is available)
        if (userId) {
          const actualAmortizationDataList: AmortizationMetaData[] = await getAmortizationactualMetaData(userId);
          if (actualAmortizationDataList.length > 0) {
            const actualAmortizationData: AmortizationMetaData = actualAmortizationDataList[0];
            // calcAmortizationScheduleItems
            calcAmortizationScheduleItems(actualAmortizationData);;
            // calculate graph details
            setAmortizationMetaData(actualAmortizationData);

          }

        }
      } catch (error) {
        console.error('Error fetching forecast data:', error);
        // Handle errors if needed (e.g., show an error message)
      }
    };

    // Call the function to fetch forecast data when the component mounts
    fetchForecastData();
  }, []); // Empty dependency array to run the effect only once on mount


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
            name: "profileName",
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
              {amortizationMetaData?.loanDetails && (<Grid item xs={9} md={9} lg={9}>
                <FormInputs onSubmit={onSubmitCallBack} amortizationMetaData={amortizationMetaData} />
              </Grid>)}

              {amortizationMetaData?.graphDetails &&
                <Grid item xs={3} md={3} lg={3}>
                  <Summery  amortizationMetaData={amortizationMetaData} />
                </Grid>
              }
              {
                amortizationMetaData?.amortizationScheduleItemsByYear?.length &&

                <Grid item xs={12}>
                  <NestedTable
                    data={amortizationMetaData?.amortizationScheduleItemsByYear}
                    updateAmortizationItem={onUpdateCallBack} />
                </Grid>
              }




            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;