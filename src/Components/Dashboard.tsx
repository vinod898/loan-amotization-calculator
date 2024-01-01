import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import FormInputs from './FormInputs';
import NestedTable from './nestedTable'; // Update the import path as needed
import { IAmortizationScheduleItem, IAmortizationScheduleItemByYear } from '../type';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import DrawerComponent from './Drawer';
import HeaderComponent from './Header';
import Summery from './summery';
import { getAmortizationactualMetaData, upsertAmortizationData } from '../Services/amortizationService';
import { AmortizationMetaData, EnrichedMetaData } from '../Domain/AmortizationData';
import { calcAmortizationScheduleItems } from '../utils/utils';


const defaultTheme = createTheme();

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [enrichedAmortizationMetaData, setEnrichedAmortizationMetaData] = React.useState<EnrichedMetaData | null>(null);
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
            const enrichedMetaData: EnrichedMetaData = calcAmortizationScheduleItems(actualAmortizationData);;
            setEnrichedAmortizationMetaData(enrichedMetaData);
            const hasAmortizationScheduleItems = enrichedMetaData?.amortizationScheduleItemsByYear?.length ?? 0 > 0;
            if (hasAmortizationScheduleItems)
              setAmortizationScheduleItemsByYear(enrichedMetaData.amortizationScheduleItemsByYear ?? [])

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
    if (enrichedAmortizationMetaData?.loanDetails) {
      // calcAmortizationScheduleItems
      calcAmortizationScheduleItems(enrichedAmortizationMetaData);;
      // calculate graph details
      setEnrichedAmortizationMetaData(enrichedAmortizationMetaData);

      if (enrichedAmortizationMetaData?.amortizationScheduleItemsByYear && enrichedAmortizationMetaData?.amortizationScheduleItemsByYear.length > -1)
        setAmortizationScheduleItemsByYear(enrichedAmortizationMetaData.amortizationScheduleItemsByYear)
    }

  };

  const onUpdateCallBack = (updatedItem: IAmortizationScheduleItem, changeParameter: string) => {
    console.log(changeParameter)

    if (changeParameter && enrichedAmortizationMetaData) {
      const { amortizationScheduleItemsByYear, graphDetails, ...actualAmortizationData } = enrichedAmortizationMetaData;
      const maxMonths = amortizationScheduleItemsByYear?.reduce((total, yearItem) => {
        return total + yearItem.monthHistory.length
      }, 0) ?? 0;
      switch (changeParameter) {
        case 'interestRate':
          for (let i = updatedItem.id; i <= maxMonths; i++)
            enrichedAmortizationMetaData.interestMap.set(i, updatedItem.interestRateMnth);
          break;
        case 'emiPayment':
          for (let i = updatedItem.id; i <= maxMonths; i++)
            enrichedAmortizationMetaData.emiMap.set(i, updatedItem.payment);
          break;
        case 'extraPayment':
          enrichedAmortizationMetaData.extraPaymentMap.set(updatedItem.id, updatedItem.extraPayment);
          break;

        default:
          break;
      }


      // calcAmortizationScheduleItems
      const updatedMetaData: EnrichedMetaData = calcAmortizationScheduleItems(actualAmortizationData);;
      // calculate graph details
      setEnrichedAmortizationMetaData(updatedMetaData);

      if (updatedMetaData?.amortizationScheduleItemsByYear && updatedMetaData?.amortizationScheduleItemsByYear.length > -1)
        setAmortizationScheduleItemsByYear(updatedMetaData.amortizationScheduleItemsByYear)

    }
    console.log(updatedItem);
  };

  const toggleDrawer = () => setOpen(!open);

  const handleSaveClick = async () => {
    if (enrichedAmortizationMetaData) {
      const { amortizationScheduleItemsByYear, graphDetails, ...actualAmortizationData } = enrichedAmortizationMetaData;
      console.log('save', actualAmortizationData);
      await upsertAmortizationData(actualAmortizationData)
    }
  }

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
              {enrichedAmortizationMetaData?.loanDetails && (<Grid item xs={9} md={9} lg={9}>
                <FormInputs onSubmit={onSubmitCallBack} amortizationMetaData={enrichedAmortizationMetaData} />
              </Grid>)}

              {enrichedAmortizationMetaData?.graphDetails &&
                <Grid item xs={3} md={3} lg={3}>
                  <Summery amortizationMetaData={enrichedAmortizationMetaData} />
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