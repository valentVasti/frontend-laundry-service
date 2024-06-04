import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../../server/Url'
import PencuciCard from './PencuciCard'
import { pusher, eventName } from '../../../server/pusherService'
import { useCookies } from 'react-cookie'

const PencuciList = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['__ADMINTOKEN__']);
    const [mesin, setMesin] = useState([]);

    const fetchMesin = async () => {
        try {
            const response = await axios.get(BASE_URL + "/getQueueByLayanan/CUCI", {
                headers: {
                    Authorization: 'Bearer ' + cookies.__ADMINTOKEN__
                }
            });
            setMesin(response.data.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchMesin()
    }, [])

    useEffect(() => {
        console.log('subscribing to channel "queue-channel" ...')
        // pusher listener
        const channel = pusher.subscribe('queue-channel');
        channel.bind(eventName.notifyNextOrDoneQueue, function () {
            console.log('event received: notifyNextOrDoneQueue')
            fetchMesin()
        });

        return () => {
            console.log('unsubscribing queue-channel')
            channel.unbind(eventName.notifyNextOrDoneQueue);
            pusher.unsubscribe('queue-channel');
        };
    }, [])

    return (
        <>
            <div className='w-full h-1/6 px-3 flex justify-center items-center'>
                <h1 className='text-2xl w-full text-center font-bold bg-purple-500 py-1 px-4 rounded-full text-white'>PENCUCI</h1>
            </div>
            <div className='w-full h-5/6 flex py-3 px-2'>
                {mesin.map((data) => (
                    <PencuciCard key={data.id} data={data} />
                ))}
            </div>
        </>
    )
}

export default PencuciList