import * as React from 'react';
import { LinearProgress, Tooltip, Typography } from '@mui/material';
import '../styles/MonthProgressBar.css'; // Import a separate CSS file for styling

interface MonthProgressBarProps {
    completed: number;
    remaining: number;
}

const MonthProgressBar: React.FC<MonthProgressBarProps> = ({
    completed, remaining
}) => {
    const total = completed + remaining;
    const completionPercentage = (completed / total) * 100;

    return (
        <Tooltip title={`Completed: ${completionPercentage.toFixed(0)} % - Remaining: ${(100 - completionPercentage).toFixed(0)} %`} placement="top">
            <div className="progress-container">
                <LinearProgress
                    variant="determinate"
                    value={completionPercentage}
                    sx={{
                        height: 20, // Increase the height to adjust the thickness
                        borderRadius: 10, // Optional: add rounded corners
                        position: 'relative', // Position relative for the absolute positioning of numbers
                    }}
                />
                <Typography variant="caption" align="center"> Completed [{completed}] out of [{total}]
                </Typography>
            </div>
        </Tooltip>
    );
}

export default MonthProgressBar;
