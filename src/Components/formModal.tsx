import React, { useEffect, useState } from 'react';
import {
    Button,
    Modal,
    TextField,
    Typography,
    Grid,
    Box,
} from '@mui/material';
import { IAmortizationScheduleItem } from '../type';

const modalStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const modalContentStyles: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '600px',
};

interface FormDataModalProps {
    open: boolean;
    onClose: (item: IAmortizationScheduleItem, changeParameter: string) => void;
    item: IAmortizationScheduleItem;
}

const FormDataModal: React.FC<FormDataModalProps> = ({ open, onClose, item }) => {
    const {
        month = '0',
        beginingBalance = 0,
        endingBalance = 0,
        principalPaid = 0,
        interestPaid = 0,
    } = item;

    const [emi, setEmi] = useState<number>(item.payment ?? 0);
    const [partPayment, setPartPayment] = useState<number>(item.extraPayment ?? 0);
    const [interestRate, setInterestRate] = useState<number>(item.interestRateMnth ?? 0.0);
    const [changeParameter, setChangeParameter] = useState<string>('');
    // Use useEffect to update the state when item.payment becomes available
    useEffect(() => {
        if (item.payment !== undefined) {
            setEmi(item.payment);
        }
        if (item.extraPayment !== undefined) {
            setPartPayment(item.extraPayment);
        }
        if (item.interestRateMnth !== undefined) {
            setInterestRate(item.interestRateMnth);
        }
    }, [item.payment, item.extraPayment, item.interestRateMnth]);

    const handleSave = () => {
        item = { ...item, 
                payment: emi,
                extraPayment: partPayment,
                interestRateMnth: interestRate
               };
        onClose(item,changeParameter);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            style={modalStyles}
        >
            <div style={modalContentStyles}>
                <Typography variant="h6">Enter Details</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Box style={{ color: 'gray', padding: '2px 0' }}>
                                    <Typography variant="subtitle1">
                                        <strong>Month</strong>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={8}>
                                : {month}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Box style={{ color: 'gray', padding: '2px 0' }}>
                                    <Typography variant="subtitle1">
                                        <strong>Beginning Balance</strong>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={8}>
                                : {beginingBalance}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Box style={{ color: 'gray', padding: '2px 0' }}>
                                    <Typography variant="subtitle1">
                                        <strong>Ending Balance</strong>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={8}>
                                : {endingBalance}
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Box style={{ color: 'gray', padding: '2px 0' }}>
                                    <Typography variant="subtitle1">
                                        <strong>Principal Paid</strong>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={8}>
                                : {principalPaid}
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Box style={{ color: 'gray', padding: '2px 0' }}>
                                    <Typography variant="subtitle1">
                                        <strong>Interest Paid</strong>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={8}>
                                : {interestPaid}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField
                            label="Interest Rate Monthly"
                            type='number'
                            fullWidth
                            value={interestRate}
                            onChange={(e) => {
                                setInterestRate(parseFloat(e.target.value));
                                setChangeParameter('interestRate');
                            }}
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <TextField
                            label="Payment"
                            type='number'
                            fullWidth
                            value={emi}
                            onChange={(e) => {
                                setEmi(parseFloat(e.target.value));
                                setChangeParameter('emiPayment');
                            }}
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <TextField
                            label="Extra Payment"
                            type='number'
                            fullWidth
                            value={partPayment}
                            onChange={(e) => {
                                setPartPayment(parseFloat(e.target.value));
                                setChangeParameter('extraPayment');
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container justifyContent="center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        style={{ marginTop: '16px', padding: '10px', maxWidth: '200px' }} // Adjust width as needed
                    >
                        Save
                    </Button>
                </Grid>
            </div>
        </Modal>
    );
};

export default FormDataModal;
