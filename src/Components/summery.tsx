import * as React from 'react';
import { IAmortizationScheduleItemByYear } from '../type';
import Typography from '@mui/material/Typography';
import Title from './Title';
// import { LinearProgress, Paper, Tooltip } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Label, LabelList } from 'recharts';
import { Paper } from '@mui/material';
import { LoanDetails } from '../Domain/FormField';
import moment from 'moment';
import PIGraph from './principalInterestgraph';
import MonthProgressBar from './MonthProgressBar';



interface SummeryProps {
    data: IAmortizationScheduleItemByYear[];
    loanDetails: LoanDetails;
}

const Summary: React.FC<SummeryProps> = ({
    data, loanDetails
}) => {
    const emiPaidMonths: number = moment().diff(moment(loanDetails.startDate), 'months');
    let months = 0;
    let interest = 0;
    data.forEach(((yearItem: IAmortizationScheduleItemByYear) => {
        interest += yearItem.totalInterestPaid;
        months += (yearItem.monthHistory.length)
    }));
    const remaining = (months - emiPaidMonths);
    const completed = (loanDetails.tenure * 12) - remaining;
    console.log({completed,remaining})
 
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
            <PIGraph principal={loanDetails.principal} interest={interest} ></PIGraph>
            <Title>Tenure <small>in months</small> </Title>
            <MonthProgressBar completed={completed} remaining={remaining}></MonthProgressBar>
        </Paper>
    );
}

export default Summary;
