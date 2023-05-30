import React  from 'react';
import { PieChart, Pie, Legend, Cell, ResponsiveContainer } from 'recharts';
  

  
  const PieChartAccount = () => {
    const data = [
        { name: 'Apple', value: 400 },
        { name: 'Starbucks', value: 300 },
        { name: 'McDonalds', value: 300 },
        { name: 'Pinterest', value: 200 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <>
            <div>
                <div class="PieChart">
                   
                    <div className="col-md-8">
                        <ResponsiveContainer width={300} height={300} className="text-center">
                            <PieChart width={200} height={200}>
                                <Legend layout="vertical" verticalAlign="center" align="center" />
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    )
}
  
  export default PieChartAccount;