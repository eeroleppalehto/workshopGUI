import React from 'react';
import { Line } from 'react-chartjs-2';
import app from '../firebaseConfig';
import { getDatabase, ref, onValue } from 'firebase/database';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface TemperatureGraphProps {
    data: ChartData<'line'>;
}

const TemperatureGraph: React.FC<TemperatureGraphProps> = ({ data }) => {
    return <Line data={data} />;
};

export default TemperatureGraph;
