import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { IAmortizationScheduleItem, IAmortizationScheduleItemByYear } from '../type';
import EditIcon from '@mui/icons-material/Edit';
import FormDataModal from './formModal';

interface RowProps {
  row: IAmortizationScheduleItemByYear;
  edit: (historyRow: IAmortizationScheduleItem) => void;
}

const Row: React.FC<RowProps> = ({ row, edit }) => {
  const [open, setOpen] = useState(false);


  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.finacialYear}
        </TableCell>
        <TableCell align="left">{row.beginingBalance}</TableCell>
        <TableCell align="left">{row.totalEmiPayMent}</TableCell>
        <TableCell align="left">{row.totalPrincipalPaid}</TableCell>
        <TableCell align="left">{row.totalInterestPaid}</TableCell>
        <TableCell align="left">{row.totalExtraPayment}</TableCell>
        <TableCell align="left">{row.endingBalance}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell>Emi Date</TableCell>
                  <TableCell>Begining Balance</TableCell>
                  <TableCell>Emi</TableCell>
                  <TableCell>Principal Paid</TableCell>
                  <TableCell>Interest Paid</TableCell>
                  <TableCell>Part Payment</TableCell>
                  <TableCell>Closing Balance</TableCell>
                  <TableCell>Interest Rate</TableCell>
                  <TableCell>Edit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {row.monthHistory.map((historyRow: IAmortizationScheduleItem) => (
                  <TableRow key={historyRow.month}>
                    <TableCell component="th" scope="row">
                      {historyRow.month}
                    </TableCell>
                    <TableCell>{historyRow.beginingBalance}</TableCell>
                    <TableCell>{historyRow.payment}</TableCell>
                    <TableCell>{historyRow.principalPaid}</TableCell>
                    <TableCell>{historyRow.interestPaid}</TableCell>
                    <TableCell>{historyRow.extraPayment}</TableCell>
                    <TableCell>{historyRow.endingBalance}</TableCell>
                    <TableCell>{historyRow.interestRateMnth}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        size="small" // Set the size to 'small'
                        onClick={() => edit(historyRow)}
                      >
                        <EditIcon />
                      </IconButton>

                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

interface NestedTableProps {
  data: IAmortizationScheduleItemByYear[];
  updateAmortizationItem: (updatedItem: IAmortizationScheduleItem) => void;
}

const NestedTable: React.FC<NestedTableProps> = ({ data, updateAmortizationItem }) => {
  const [openModal, setOpenModal] = useState(false);
  const [amortizationScheduleItem, setAmortizationScheduleItem] = useState({} as IAmortizationScheduleItem);

  const oncloseModal = (item: IAmortizationScheduleItem) => {
    setOpenModal(false);
    // update 
    updateAmortizationItem(item);
    // fetch new values

  }

  const handleEdit = (historyRow: IAmortizationScheduleItem): void => {
    setOpenModal(true);
    setAmortizationScheduleItem(historyRow)
  }
  return (
    <Paper
      sx={{ p: 2, display: 'flex', flexDirection: 'column' }}
    >
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Year</TableCell>
              <TableCell align="left">Begining Balance</TableCell>
              <TableCell align="left">Emi Paid&nbsp;(Yr)</TableCell>
              <TableCell align="left">Principal Paid&nbsp;(Yr)</TableCell>
              <TableCell align="left">Interest Paid&nbsp;(Yr)</TableCell>
              <TableCell align="left">Part Payment&nbsp;(Yr)</TableCell>
              <TableCell align="left">Closing Balance</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: IAmortizationScheduleItemByYear) => (
              <Row key={row.year} row={row} edit={handleEdit} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <FormDataModal open={openModal} onClose={oncloseModal} item={amortizationScheduleItem}></FormDataModal>
    </Paper>

  );
};

export default NestedTable;
