import React, { useEffect, useState } from 'react'
import PengeringList from './PengeringList';
import PencuciList from './PencuciList';
import QueueNowList from './QueueNowList';
import logo from '../../../assets/logo.png';
import { Chip } from '@nextui-org/react';
import { IoIosTime } from 'react-icons/io';
import { MdCalendarToday } from 'react-icons/md';

const QueueWindow = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    const options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    };

    useEffect(() => {

        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);

    }, []);

    return (
        <div className='w-full h-screen'>
            <div className='w-full h-[10%] border-b-gray-400 border-b-2 flex justify-between items-center px-5'>
                <div className='w-20 h-full relative'>
                    <div className='top-0 h-[85%] shadow-md rounded-b-xl flex justify-center items-center'>
                        <img src={logo} className='h-full rounded-b-xl p-2' />
                    </div>
                </div>
                <div className='space-x-3'>
                    <Chip size="lg" className="text-2xl">
                        <div className="flex items-center gap-3">
                            <IoIosTime />
                            {currentDateTime.toLocaleTimeString("en-US", options)}
                        </div>
                    </Chip>
                    <Chip size="lg" className='text-2xl'>
                        <div className="flex items-center gap-3">
                            <MdCalendarToday />
                            {currentDateTime.toLocaleDateString()}
                        </div>
                    </Chip>
                </div>
            </div>
            <div className='w-full h-[90%] overflow-hidden flex gap-2'>
                <div className='h-full w-9/12 py-3'>
                    <div className='w-full h-1/2'>
                        <PengeringList />
                    </div>
                    <div className='w-full h-1/2'>
                        <PencuciList />
                    </div>
                </div>
                <div className='h-full w-3/12 py-3'>
                    <QueueNowList />
                </div>
            </div>
        </div>
    )
}

export default QueueWindow