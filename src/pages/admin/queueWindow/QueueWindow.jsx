import React, { useEffect } from 'react'
import PengeringList from './PengeringList';
import PencuciList from './PencuciList';
import QueueNowList from './QueueNowList';

const QueueWindow = () => {

    return (
        <div className='w-full h-screen overflow-hidden flex gap-2'>
            <div className='h-full w-3/12'>
                <QueueNowList />
            </div>
            <div className='h-full w-9/12'>
                <div className='w-full h-1/2 bg-red-100'>
                    <PengeringList />
                </div>
                <div className='w-full h-1/2'>
                    <PencuciList />
                </div>
            </div>
        </div>
    )
}

export default QueueWindow