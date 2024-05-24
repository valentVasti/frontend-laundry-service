import React, { useEffect, useState } from 'react'
import { FiMenu } from "react-icons/fi";
import { Chip } from '@nextui-org/react';
import { IoIosTime } from 'react-icons/io';
import { MdCalendarToday } from 'react-icons/md';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../server/Url';
import { useStore } from '../server/store';
import { useCookies } from 'react-cookie';

const Topbar = ({ toggleSidebar, dateTime, options }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['__ADMINTOKEN__']);

  const [queueStatus, setQueueStatus] = useState({
    text: '',
    color: ''
  })
  const setIsTodayOpened = useStore((state) => state.setIsTodayOpened)
  const setIsTodayClosed = useStore((state) => state.setIsTodayClosed)
  const notifyIsTodayQueue = useStore((state) => state.notifyIsTodayQueue)
  const isTodayOpenFetch = async () => {

    try {
      const response = await axios.get(BASE_URL + "/isTodayLogOpened", {
        headers: {
          'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
        },
      });

      console.log(response.data.data)

      if (response.data.data.opened && !response.data.data.closed) {
        // udah dibuka, belom ditutup
        const statusQueue = {
          text: 'Antrian Hari Ini Telah Dibuka',
          color: 'success'
        }
        setQueueStatus(statusQueue)

      } else if (response.data.data.opened && response.data.data.closed) {
        // udah dibuka, udah ditutup
        const statusQueue = {
          text: 'Antrian Hari Ini Telah Ditutup',
          color: 'warning'
        }
        setQueueStatus(statusQueue)

      } else if (!response.data.data.opened && !response.data.data.closed) {
        // belom dibuka, belom ditutup
        const statusQueue = {
          text: 'Antrian Hari Ini Belum Dibuka',
          color: 'danger'
        }
        setQueueStatus(statusQueue)

      } else {
        // belom dibuka, udah ditutup
        const statusQueue = {
          text: 'Invalid Status',
          color: 'warning'
        }
        setQueueStatus(statusQueue)

      }

      setIsTodayOpened(response.data.data.opened)
      setIsTodayClosed(response.data.data.closed)

    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    isTodayOpenFetch()
  }, [notifyIsTodayQueue])

  return (
    <div className='w-full h-auto will-change-transform'>
      <nav className='w-full h-[10%] bg-white border-b-1 border-gray-300 p-5 flex justify-between items-center'>
        <button onClick={toggleSidebar} className="bg-black text-white p-1 rounded-lg">
          <FiMenu size={30} />
        </button>
        <div className="flex gap-4">
          <Chip size="lg" color={queueStatus.color} className="text-white">
            {queueStatus.text}
          </Chip>
          <Chip size="lg" className="text-lg">
            <div className="flex items-center gap-1">
              <IoIosTime />
              {dateTime.toLocaleTimeString("en-US", options)}
            </div>
          </Chip>
          <Chip size="lg">
            <div className="flex items-center gap-1">
              <MdCalendarToday />
              {dateTime.toLocaleDateString()}
            </div>
          </Chip>
        </div>
      </nav>
      <div className='bg-white h-[90%] overflow-auto p-5'>
        <div id="content" className="h-auto">
          <div className="flex gap-5">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topbar