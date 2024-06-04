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
        console.log('subscribing to channel "queue-channel" ...')
        // pusher listener
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
        <>
            <div className='w-full h-[80px] bg-gray-100 flex justify-center items-center text-2xl font-bold'>
                ANTRIAN SEKARANG
            </div>
            <div className='w-full h-full bg-red-200 flex flex-col p-3 gap-3'>
                {queueNow.map((data) => (
                    <QueueNowCard key={data.id} data={data} />
                ))}
            </div>
        </>
    )
}

export default QueueNowList