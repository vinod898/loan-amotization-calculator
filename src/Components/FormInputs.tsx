import * as React from 'react';
import Grid from '@mui/material/Grid';
import InputBox from './InputBox';
import { useState } from 'react';
import { Button } from '@mui/material';
import { FormField, LoanDetails } from '../Domain/FormField';
import { connect, useSelector } from 'react-redux';
import store, { RootState } from '../store/store';



interface TitleProps {
    onSubmit: (loanDetails: LoanDetails) => void;
}


let items: FormField[] = [
    { id: 1, name: "principal", value: 0 },
    { id: 2, name: "interestRate", value: 0 },
    { id: 3, name: "tenure", value: 0 },
    { id: 4, name: "startDate", value: new Date() },
];


export default function FormInputs(props: TitleProps) {

    // store
    const storeState: RootState = store.getState();
    const loanDet = storeState.amortization.loanDet;
    const [inputItems, setInputItems] = useState(items);
    const [showBtn, setShowBtn] = useState(false);

    React.useEffect(() => {
        if (loanDet) {
            items = items.map(x => {
                const key = x.name;
                const value = key === "startDate" ? new Date(loanDet[key]) ?? new Date() : loanDet[key]?? 0;
                x.value = value
                return x;
            });
            setInputItems(items)
        }

    }, items);







    const { onSubmit } = props;
    const handleSubmit = () => {
        let loanDetails: LoanDetails = {};
        for (let item of items) {
            const { name, value } = item;
            if (name == 'startDate') {
                loanDetails[name] = value as Date;
            } else {
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
                {inputItems.map((item, index) => {
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



