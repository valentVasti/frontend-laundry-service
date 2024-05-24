import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Grafik Antrian Hari Ini',
        },
    },
};

const labels = ['07.00', '08.00', '09.00', '10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00', '17.00', '18.00', '19.00', '20.00'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Online',
            data: labels.flatMap(() => Array.from({ length: 1 }, () => Math.floor(Math.random() * 500))), borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Offline',
            data: labels.flatMap(() => Array.from({ length: 1 }, () => Math.floor(Math.random() * 500))), borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

console.log(data.datasets[0].data)

const TodayQueueChart = () => {
    return (
        <div className='w-full h-full'>
            <Line options={options} data={data} className='size-full' />
        </div>
    )
}

export default TodayQueueChart