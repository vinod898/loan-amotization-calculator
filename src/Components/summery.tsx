import * as React from 'react';
import { GraphDetails, IAmortizationScheduleItemByYear } from '../type';
import Title from './Title';
// import { LinearProgress, Paper, Tooltip } from '@mui/material';
import { Paper } from '@mui/material';
import PIGraph from './principalInterestgraph';
import MonthProgressBar from './MonthProgressBar';
import { AmortizationMetaData } from '../Domain/AmortizationData';
import { useState } from 'react';



interface SummeryProps {
    amortizationMetaData: AmortizationMetaData;
}

const Summary: React.FC<SummeryProps> = ({
    amortizationMetaData
}) => {

    const { completedMonths = 0, remainingMonths = 0, interest = 0, principal = 0 } = amortizationMetaData.graphDetails as GraphDetails;
    const [completed_Months, setCompletedMonths] = useState(0);
    const [remaining_Months, setRemainingMonths] = useState(0);
    const [overAllInterest, setInterest] = useState(0);
    const [overAllPrincipal, setPrincipal] = useState(0);

    React.useEffect(() => {
        if (amortizationMetaData?.graphDetails) {
            const { completedMonths = 0, remainingMonths = 0, interest = 0, principal = 0 } = amortizationMetaData.graphDetails as GraphDetails;
            setPrincipal(principal);
            setCompletedMonths(completedMonths);
            setRemainingMonths(remainingMonths);
            setInterest(interest);
        }

    }, [completedMonths, remainingMonths, interest, principal]);

    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: '250',
            }}
        >
            <Title>Principal and Interest</Title>
            <PIGraph principal={overAllPrincipal} interest={overAllInterest} ></PIGraph>
            <Title>Tenure <small>in months</small> </Title>
            <MonthProgressBar completed={completed_Months} remaining={remaining_Months}></MonthProgressBar>
        </Paper>
    );
}

export default Summary;

