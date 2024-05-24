import { Chip } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'

const PencuciCard = ({ data }) => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft);
        }, 1000);

        return () => clearInterval(timer);

    }, [data]);

    const calculateTimeLeft = () => {
        const created_at = data.nomor_antrian != 0 ? data['updated_at'] : '--';
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
        } else {
            timeLeft = {
                hours: 0,
                minutes: 0,
                seconds: 0
            }
        }

        return timeLeft
    }

    return (
        <section className='bg-slate-200 shadow-md shadow-gray-100 h-auto rounded-xl relative'>
            <div id='card-header' className='text-center border-b-1 border-black top-0 w-full py-2 flex items-center justify-center gap-2'>
                <div className={data.status == 'IDLE' ? 'size-3 bg-green-400 rounded-full animate-pulse' : 'size-3 bg-red-400 rounded-full animate-pulse'}></div>
                <h1>{"MESIN "}</h1>
                <Chip className='text-white' color='secondary'>{data.mesin.kode_mesin}</Chip>
            </div>
            <div id='card-body' className='text-center min-h-16 text-2xl flex justify-center items-center'>
                <div className=' bg-blue-600 text-white h-8 min-w-8 max-w-fit rounded-lg flex justify-center px-1'>
                    {data.nomor_antrian}
                </div>
            </div>
            <div id='card-footer' className='text-center border-t-1 border-black py-2'>
                {`${timeLeft.minutes != 0 && !isNaN(timeLeft.minutes) == true ? timeLeft.minutes : '--'} : ${timeLeft.seconds != 0 && !isNaN(timeLeft.seconds) == true ? timeLeft.seconds : '--'}`}
            </div>
        </section>
    )
}

export default PencuciCard