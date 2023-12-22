import * as React from 'react';
import Grid from '@mui/material/Grid';
import { Button, Paper, TextField } from '@mui/material';
import { FormField, LoanDetails } from '../Domain/FormField';
import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AmortizationMetaData } from '../Domain/AmortizationData';



interface TitleProps {
    onSubmit: (loanDetails: LoanDetails) => void;
    amortizationMetaData: AmortizationMetaData;
}



export default function FormInputs({ amortizationMetaData, onSubmit }: TitleProps) {


    const [principal, setPrincipal] = useState(0);
    const [interestRate, setInterestRate] = useState(0);
    const [tenure, setTenure] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [initialLoanDetails, setInitialLoanDetails] = useState(amortizationMetaData.loanDetails);


    React.useEffect(() => {
        if (amortizationMetaData?.loanDetails) {
            setInitialLoanDetails(amortizationMetaData.loanDetails);
            const { interestRate, principal, startDate, tenure } = amortizationMetaData.loanDetails;
            setPrincipal(principal);
            setInterestRate(interestRate);
            setTenure(tenure);
            setStartDate(startDate ? new Date(startDate) : new Date());
            onSubmit(amortizationMetaData.loanDetails);
        }

    }, [initialLoanDetails]);

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const principal = Number(formData.get("principal"));
        const interestRate = Number(formData.get("interestRate"));
        const tenure = Number(formData.get("tenure"));
        const date = formData.get("startDate") as string;
        const startDate = new Date(date);
        const loanDet1 = { ...amortizationMetaData.loanDetails, principal, interestRate, tenure, startDate };
        onSubmit(loanDet1);

    };

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (name === 'principal') {
            setPrincipal(Number(value));
        } else if (name === 'interestRate') {
            setInterestRate(Number(value));
        } else if (name === 'tenure') {
            setTenure(Number(value));
        } else if (name === 'startDate') {
            setStartDate(new Date(value));
        }
    }
    return (
        <React.Fragment>
            <div>

            </div>
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'auto',
                }}
            >
                <Grid container spacing={1}>
                    <form onSubmit={submit}>
                        <TextField
                            size="small"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="principal"
                            label="Principal"
                            name="principal"
                            autoComplete="principal"
                            type="number"
                            autoFocus
                            value={principal}
                            onChange={handleInputChange}
                        />
                        <TextField
                            size="small"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="interestRate"
                            label="Interest Rate"
                            name="interestRate"
                            autoComplete="interestRate"
                            type=""
                            autoFocus
                            value={interestRate}
                            onChange={handleInputChange}
                        />
                        <TextField
                            size="small"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="tenure"
                            label="Tenure"
                            name="tenure"
                            autoComplete="tenure"
                            type="number"
                            autoFocus
                            value={tenure}
                            onChange={handleInputChange}
                        />
                        <TextField
                            size="small"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="startDate"
                            label="Start Date"
                            name="startDate"
                            autoComplete="startDate"
                            type="date"
                            autoFocus
                            value={formatDate(startDate)}
                            onChange={handleInputChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"

                        >
                            Calculate
                        </Button>
                    </form>
                </Grid>
            </Paper>
        </React.Fragment>
    );
}




function formatDate(date: Date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


