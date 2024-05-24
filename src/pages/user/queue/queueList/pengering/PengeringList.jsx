import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../../../../server/Url'
import PengeringCard from './PengeringCard';
import { Spinner } from '@nextui-org/react';
import { pusher, eventName } from '../../../../../server/pusherService'

const PengeringList = () => {
    const [mesin, setMesin] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    const fetchMesin = async () => {
        try {
            const response = await axios.get(BASE_URL + "/getQueueByLayanan/KERING");
            console.log('Pengering', response.data.data)
            setMesin(response.data.data);
            setIsLoading(false)
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

    if (!isLoading) {
        if (mesin.length === 0) {
            return (
                <section className='w-full h-40 flex justify-center items-center'>
                    <h1 className='w-fit text-center text-2xl bg-orange-300 rounded-2xl p-3'>
                        Antrian hari ini<br /> belum dibuka/sudah tutup!
                    </h1>
                </section>
            )
        } else {
            return (
                <section>
                    <div className='flex w-full h-auto flex-wrap'>
                        {mesin.map((data) => (
                            <div key={data.id} className='w-1/2'>
                                <div className='p-2'>
                                    <PengeringCard data={data} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )
        }
    } else {
        return (
            <section>
                <div className='w-full flex justify-center items-center'>
                    <Spinner size='large' />
                </div>
            </section>
        )
    }
}

export default PengeringList