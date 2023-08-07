import * as React from 'react';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { TextField } from '@mui/material';
import Slider from '@mui/material/Slider';
import { ChangeEvent, useState } from 'react';



const config: Config = {
    principal: {
        label: 'Principal',
        placeholder: 'Principal Amount',
        type: "number",
        min: 10000,
        max: 10000000,
        step: 100000,
        defaultValue: 5000000,
        marks: [
            {
                value: 1000000,
                label: '10L',
            },
            {
                value: 2000000,
                label: '20L',
            },
            {
                value: 5000000,
                label: '50L',
            },
            {
                value: 10000000,
                label: '1C',
            },
        ]
    },
    interestRate: {
        label: 'Interest Rate',
        placeholder: 'Interest Rate',
        type: "number",
        min: 0.0,
        max: 100.0,
        step: 0.1,
        defaultValue: 10,
        marks: [
            {
                value: 5,
                label: '5%',
            },
            {
                value: 10,
                label: '10%',
            },
            {
                value: 20,
                label: '20%',
            }
        ]
    },
    tenure: {
        label: 'Tenure',
        placeholder: 'Tenure in Yrs',
        type: "number",
        min: 0,
        max: 30,
        step: 1,
        defaultValue: 10,
        marks: [
            {
                value: 10,
                label: '10 Years',
            },
            {
                value: 15,
                label: '15 Years',
            },
            {
                value: 20,
                label: '20 Years',
            },
            {
                value: 25,
                label: '25 Years',
            },
            {
                value: 30,
                label: '30 Years',
            },
        ]
    },
    startDate: {
        label: 'Start Date',
        placeholder: 'choose date',
        type: "date"
    }
}


function valuetext(value: number) {
    return `${value}`;
}


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

interface TitleProps {
    name: string;
    value: number | Date;
    children?: React.ReactNode;
    setValueByName: (name: string, value: number | Date) => void;
    validate: () => void;
}



export default function InputBox(props: TitleProps) {

    const { name, value, setValueByName, validate } = props;
    const [inputValue, setInputValue] = useState<number | Date>(value ?? 0);
    const { label, placeholder, min, max, marks, type } = (config[name] as InputProps);
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleChange(event.target.value)
    };

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        handleChange(newValue as number)
    };

    const handleChange = (value: string | Date | number) => {
        let val: number | Date = 0;

        if (typeof value === 'string' && value !== '') {
            switch (name) {
                case 'interestRate':
                    val = parseFloat(value);
                    break;
                case 'principal':
                case 'tenure':
                    val = parseInt(value);
                    break;
                default:
                    val = new Date(value);
                    break;
            }

        } else if (typeof value === 'number' && !isNaN(value)) {
            val = value
        }
        setInputValue(val);
        setValueByName(name, val);
        validate()
    }


    return (
        <React.Fragment>
            <Grid item xs={4}>
                <TextField
                    size="small"
                    required
                    id={`${name}-TextField`}
                    label={label}
                    value={typeof inputValue === 'number' ? inputValue : formatDate(inputValue)} // Convert Date to string
                    inputProps={{ min, max }}
                    placeholder={placeholder}
                    type={typeof value === 'number' ? 'number' : 'date'}
                    fullWidth
                    onChange={handleInputChange}
                />
            </Grid>
            {typeof value === 'number' && (<Grid item xs={8}>
                <Slider
                    id={`${name}-Slider`}
                    aria-label={label}
                    onChange={handleSliderChange}
                    getAriaValueText={valuetext}
                    step={10}
                    value={typeof inputValue === 'number' ? inputValue : inputValue.getTime()} // Convert Date to number (Unix timestamp)
                    valueLabelDisplay="auto"
                    marks={marks}
                    min={min}
                    max={max}
                />
            </Grid>)}
        </React.Fragment>
    );
}


type Config = {
    [key: string]: InputProps
}

interface InputProps {
    label: string;
    placeholder: string;
    type: string;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    marks?: Mark[];
}

interface Mark {
    value: number;
    label: string;
}


function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}