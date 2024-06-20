import React, { useEffect, useState } from 'react'
import AntrianCard from './AntrianCard';
import axios from 'axios';
import { BASE_URL } from '../../../../../server/Url';
import { eventName, pusher } from '../../../../../server/pusherService';
import { Spinner } from '@nextui-org/react';

const AntrianList = () => {
  const [queueNow, setQueueNow] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  const fetchNowQueue = async () => {
    try {
      const response = await axios.get(BASE_URL + "/getQueuedQueue");
      setQueueNow(response.data.data);
      setIsLoading(false);
      console.log('Queue now', response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchNowQueue()
  }, [])

  useEffect(() => {
    // pusher listener
    const channel = pusher.subscribe('queued');
    channel.bind(eventName.notifyNextOrDoneQueue, function () {
      console.log('event received: notifyNextOrDoneQueue')
      fetchNowQueue()
    });

    return () => {
      channel.unbind(eventName.notifyNextOrDoneQueue);
      pusher.unsubscribe('queued');
    };
  }, [])

  if (!isLoading) {
    if (queueNow.length === 0) {
      return (
        <section className='w-full h-40 flex justify-center items-center'>
          <h1 className='w-fit text-center text-2xl bg-orange-300 rounded-2xl p-3'>
            Antrian kosong
          </h1>
        </section>
      )
    } else {
      return (
        <section>
          <div className='flex flex-col w-full h-auto flex-wrap'>
            {queueNow.map((data) => (
              <div key={data.id} className='w-full'>
                <div className='p-2'>
                  <AntrianCard data={data} />
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

export default AntrianList