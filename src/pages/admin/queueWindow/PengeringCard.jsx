import React, { useEffect, useState } from 'react'
import { Chip } from '@nextui-org/react'
import clsx from 'clsx';

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
        } else {
            timeLeft = {
                hours: 0,
                minutes: 0,
                seconds: 0
            }
        }

        return timeLeft
    }

    const flagKedatangan = () => {
        if (data.transaction == null) {
            return 'bg-gray-500'
        } else if (data.transaction.transaction_token == null) {
            return 'bg-green-500'
        } else if (data.transaction.transaction_token.is_used == 0) {
            return 'bg-yellow-500'
        } else if (data.transaction.transaction_token.is_used == 1) {
            return 'bg-green-500'
        } else {
            return 'bg-gray-500'
        }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft);
        }, 1000);

        return () => clearInterval(timer);
    }, [data]);

    return (
        <div key={data.id} className='w-1/4 h-full p-2'>
            <div className='w-full h-full bg-gray-100 rounded-xl flex flex-col relative'>
                <div className='w-full h-1/4 flex rounded-t-xl text-3xl justify-center items-center'>
                    {"MESIN " + data.mesin.kode_mesin}
                </div>
                <div className='w-full h-3/4 rounded-b-xl'>
                    <div className='w-full h-1/2 bg-gray-200 flex justify-center items-center text-6xl'>
                        {data.nomor_antrian != 0 ? data.nomor_antrian : '--'}
                    </div>
                    <div className='w-full h-1/2 flex justify-center items-center gap-2'>
                        <Chip color='primary' className='text-3xl p-6'>
                            {`${timeLeft.minutes != 0 && !isNaN(timeLeft.minutes) == true ? timeLeft.minutes : '--'} : ${timeLeft.seconds != 0 && !isNaN(timeLeft.seconds) == true ? timeLeft.seconds : '--'}`}
                        </Chip>
                    </div>
                </div>
                <div className={clsx('absolute top-3 left-0 w-4 h-8 text-xs rounded-r-xl text-center py-2 ', flagKedatangan())}></div>
            </div>
        </div>
    )
}

export default PengeringCard