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
import { calcAmortizationScheduleItems, getFinancialYear } from '../utils/utils';


const defaultTheme = createTheme();

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // AmortizationMetaData amortizationMetaData?.amortizationScheduleItemsByYear
  const [amortizationMetaData, setAmortizationMetaData] = React.useState<AmortizationMetaData | null>(null);
  const [amortizationScheduleItemsByYear, setAmortizationScheduleItemsByYear] = React.useState<IAmortizationScheduleItemByYear[]>([]);

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
            setAmortizationMetaData(actualAmortizationData);
            if (actualAmortizationData?.amortizationScheduleItemsByYear && actualAmortizationData?.amortizationScheduleItemsByYear.length > -1)
              setAmortizationScheduleItemsByYear(actualAmortizationData.amortizationScheduleItemsByYear)

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


  const onSubmitCallBack = () => {
    if (amortizationMetaData?.loanDetails) {
      // calcAmortizationScheduleItems
      calcAmortizationScheduleItems(amortizationMetaData);;
      // calculate graph details
      setAmortizationMetaData(amortizationMetaData);

      if (amortizationMetaData?.amortizationScheduleItemsByYear && amortizationMetaData?.amortizationScheduleItemsByYear.length > -1)
        setAmortizationScheduleItemsByYear(amortizationMetaData.amortizationScheduleItemsByYear)
    }

  };

  const onUpdateCallBack = (updatedItem: IAmortizationScheduleItem) => {
    if (amortizationMetaData) {

      if (!amortizationMetaData.emiMap) amortizationMetaData.emiMap = new Map<number, number>();
      if (!amortizationMetaData.interestMap) amortizationMetaData.interestMap = new Map<number, number>();
      if (!amortizationMetaData.extraPaymentMap) amortizationMetaData.extraPaymentMap = new Map<number, number>();


      amortizationMetaData.emiMap.set(updatedItem.id, updatedItem.payment);
      amortizationMetaData.interestMap.set(updatedItem.id, updatedItem.interestRateMnth);
      amortizationMetaData.extraPaymentMap.set(updatedItem.id, updatedItem.extraPayment);

      // calcAmortizationScheduleItems
      calcAmortizationScheduleItems(amortizationMetaData);;
      // calculate graph details
      setAmortizationMetaData(amortizationMetaData);

      if (amortizationMetaData?.amortizationScheduleItemsByYear && amortizationMetaData?.amortizationScheduleItemsByYear.length > -1)
        setAmortizationScheduleItemsByYear(amortizationMetaData.amortizationScheduleItemsByYear)

    }




    // const fnYear = getFinancialYear(updatedItem.currentDate);

    // const foundYear = amortizationMetaData?.amortizationScheduleItemsByYear?.find(
    //   (yearItem) => fnYear === yearItem.finacialYear
    // );

    // if (foundYear) {
    //   const foundMonthIndex = foundYear.monthHistory.findIndex(
    //     (monthItem) => monthItem.id === updatedItem.id
    //   );

    //   if (foundMonthIndex !== -1) {
    //     foundYear.monthHistory[foundMonthIndex] = { ...updatedItem };
    //   }
    // }

    console.log(updatedItem);
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
                  <Summery amortizationMetaData={amortizationMetaData} />
                </Grid>
              }
              {
                amortizationScheduleItemsByYear?.length &&

                <Grid item xs={12}>
                  <NestedTable
                    data={amortizationScheduleItemsByYear}
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