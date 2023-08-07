import * as React from 'react';
import Grid from '@mui/material/Grid';
import InputBox from './InputBox';
import { useState } from 'react';
import { Button } from '@mui/material';
import { FormField, LoanDetails } from '../Domain/FormField';

interface TitleProps {
    onSubmit: (loanDetails: LoanDetails) => void;
}


const items: FormField[] = [
    { id: 1, name: "principal", value: 5000000 },
    { id: 2, name: "interestRate", value: 6.6 },
    { id: 3, name: "tenure", value: 25 },
    { id: 4, name: "startDate", value: new Date() },

];


export default function FormInputs(props: TitleProps) {

    const [showBtn, setShowBtn] = useState(true)

    const { onSubmit } = props;
    const handleSubmit = () => {
        let loanDetails: LoanDetails = {};
        for (let item of items) {
            const { name, value } = item;
            if (name == 'startDate') {
                loanDetails[name] = value as Date;
            }else {
                loanDetails[name] = value as number;
            }
        }
        onSubmit(loanDetails);
    };

    const validate = () => {
        let validateFlag = true;
        for (let item of items) {
            const { value } = item;
            if (!value) {
                validateFlag = false;
                break;
            }
        }
        if (validateFlag) setShowBtn(false)
        else setShowBtn(true)

    };

    // Function to set value based on name
    const setValueByName = (name: string, value: number | Date): void => {
        items.forEach((item) => {
            if (item.name === name) {
                item.value = value;
            }
        });
    };
    // initially call validate

    return (
        <React.Fragment>
            <Grid container spacing={1}>
                {items.map((item, index) => {
                    const { name, value } = item;
                    return (
                        <Grid container item spacing={3} xs={12} key={index}>
                            <InputBox name={name}
                                value={value}
                                setValueByName={setValueByName}
                                validate={validate} />
                        </Grid>
                    );
                })}
                <Grid item xs={12}>
                    <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        disabled={showBtn}
                        onClick={handleSubmit}>
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}



