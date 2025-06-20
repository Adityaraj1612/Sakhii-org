import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface BBTEntry {
  date: string;
  temperature: number;
}

interface BBTChartProps {
  data: BBTEntry[];
}

const BBTChart: React.FC<BBTChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[96, 100]} />
        <Tooltip />
        <Line type="monotone" dataKey="temperature" stroke="#ff69b4" dot />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BBTChart;
