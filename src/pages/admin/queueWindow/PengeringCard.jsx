import React, { useEffect, useState } from 'react'
import { Chip } from '@nextui-org/react'

const PengeringCard = ({ data }) => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    const calculateTimeLeft = () => {
        const created_at = data.nomor_antrian != 0 ? data.updated_at : '--';
        const startTimeString = new Date(created_at).toTimeString().split(' ')[0]

        let [hours, minutes, seconds] = startTimeString.split(":").map(Number);
        let startTimeDate = new Date();

        startTimeDate.setHours(hours, minutes, seconds);
        const endDate = new Date(startTimeDate.getTime() + data.mesin.durasi_penggunaan * 60000);
        const difference = endDate - new Date();
        let timeLeft = {};
        
        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }else{
            timeLeft = {
                hours: 0,
                minutes: 0,
                seconds: 0
            }
        }

        return timeLeft
    }

    useEffect(() => {       
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft);
        }, 1000);

        return () => clearInterval(timer);
    }, [data]);

    return (
        <div key={data.id} className='w-1/4 h-full p-2'>
            <div className='w-full h-full bg-yellow-200 flex flex-col'>
                <div className='w-full h-1/3 bg-yellow-500 flex text-4xl justify-center items-center'>
                    {"MESIN " + data.mesin.kode_mesin}
                </div>
                <div className='w-full h-2/3 bg-yellow-400'>
                    <div className='w-full h-2/3 bg-red-100 flex justify-center items-center text-6xl'>
                        {data.nomor_antrian != 0 ? data.nomor_antrian : '--'}
                    </div>
                    <div className='w-full h-1/3 flex justify-center items-center gap-2'>
                        <Chip color='primary'>
                            {`${timeLeft.minutes != 0 && !isNaN(timeLeft.minutes) == true ? timeLeft.minutes : '--'} : ${timeLeft.seconds != 0 && !isNaN(timeLeft.seconds) == true ? timeLeft.seconds : '--'}`}
                        </Chip>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PengeringCard