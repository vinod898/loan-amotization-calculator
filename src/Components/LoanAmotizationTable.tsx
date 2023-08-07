import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import IconButton from '@mui/material/IconButton/IconButton';
import EditIcon from '@mui/icons-material/Edit';



function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

interface Props {
  amortizationScheduleItems: IAmortizationScheduleItem[];
}


export default function LoanAmotization(props: Props) {
  const { amortizationScheduleItems } = props;
  return (
    <React.Fragment>
      <Title>Amortization Schedule Items</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>S.NO</TableCell>
            <TableCell>Month</TableCell>
            <TableCell>Begining Balance</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell>Principal Paid</TableCell>
            <TableCell>Interest Paid</TableCell>
            <TableCell>Extra Payment</TableCell>
            <TableCell>Ending Balance</TableCell>
            <TableCell>Interest Rate</TableCell>
            <TableCell>Edit</TableCell>


          </TableRow>
        </TableHead>
        <TableBody>
          {amortizationScheduleItems.map((item) => (
            <TableRow key={item.month}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.month}</TableCell>
              <TableCell>{item.beginingBalance}</TableCell>
              <TableCell>{item.payment}</TableCell>
              <TableCell>{item.principalPaid}</TableCell>
              <TableCell>{item.interestPaid}</TableCell>
              <TableCell>{item.extraPayment}</TableCell>
              <TableCell>{item.endingBalance}</TableCell>
              <TableCell>{item.interestRateMnth}</TableCell>
              <TableCell>
                <IconButton color="primary" aria-label="add to shopping cart">
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
