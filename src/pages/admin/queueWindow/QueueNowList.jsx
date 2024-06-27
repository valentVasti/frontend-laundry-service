import React, { useEffect, useState } from 'react'
import QueueNowCard from './QueueNowCard'
import { BASE_URL } from '../../../server/Url';
import axios from 'axios';
import { pusher, eventName } from '../../../server/pusherService.jsx';
import { useCookies } from 'react-cookie';

const QueueNowList = () => {
    const [queueNow, setQueueNow] = useState([]);

    const fetchNowQueue = async () => {
        try {
            const response = await axios.get(BASE_URL + "/getQueuedQueue");
            setQueueNow(response.data.data);
            console.log('Queue now', response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchNowQueue()
    }, []);

    useEffect(() => {
        const channel = pusher.subscribe('queue-channel');
        channel.bind(eventName.notifyNextOrDoneQueue, function () {
            console.log('event received: notifyNextOrDoneQueue')
            fetchNowQueue()
        });

        return () => {
            console.log('unsubscribing queue-channel')
            channel.unbind(eventName.notifyNextOrDoneQueue);
            pusher.unsubscribe('queue-channel');
        };
    }, [])

    return (
        <div className='h-full'>
            <div className='w-full h-[11%] flex justify-center items-center text-2xl font-bold'>
                <h1 className='bg-red-500 text-white py-1 px-4 rounded-full'>ANTRIAN SEKARANG</h1>
            </div>
            <div className='w-full h-[89%] rounded-l-2xl bg-gray-200 flex flex-col p-3 gap-3'>
                {queueNow.map((data) => (
                    <QueueNowCard key={data.id} data={data} />
                ))}
            </div>
        </div>
    )
}

export default QueueNowList