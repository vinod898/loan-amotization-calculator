import * as React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LabelList } from 'recharts';


interface PIGraphProps {
    principal: number,
    interest: number
}

const PIGraph: React.FC<PIGraphProps> = ({
    principal, interest
}) => {
    const COLORS = ['#0088FE', '#FF8042'];

    const formatter = (value: number) => {
        const totalAmount = principal + interest;
        const percentage =  (value / totalAmount) * 100;
        return `${percentage.toFixed(1)} %`
    };

    return (

        <ResponsiveContainer width="100%" height={185}>
            <PieChart>
                <Pie
                    data={[
                        { name: 'Principal', value: principal },
                        { name: 'Interest', value: interest }
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"

                >
                    {[principal, interest].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                    <LabelList dataKey="value" position="inside" formatter={(value: number) => formatter(value)} fill="dark-green" /> {/* Add value label */}

                </Pie>
                <Tooltip formatter={(value) => `${value}`} /> // Display value on hover
            </PieChart>
        </ResponsiveContainer>
    );
}

export default PIGraph;
