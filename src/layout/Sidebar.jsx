import React, { useState } from 'react'
import { RxDashboard } from 'react-icons/rx'
import { Link } from 'react-router-dom'
import { TbLogout } from "react-icons/tb";
import { Button } from '@nextui-org/react';
import { BASE_URL } from '../server/Url';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const Sidebar = ({ sidebar, sidebarData }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [cookies, setCookie] = useCookies(['__ADMINTOKEN__'])

  const logout = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(BASE_URL + '/logout', {
        headers: {
          'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
        },
        withCredentials: true
      })
      if (response.data.success) {
        document.cookie = '__ADMINTOKEN__=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = '__ROLE__=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/admin/login'
        setIsLoading(false)

      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  return (
    <div ref={sidebar} className='w-[20%] h-full will-change-transform'>
      <div className='h-full w-full bg-gray-300 flex flex-col'>
        <div id='logo' className='h-16  flex justify-center items-center text-2xl font-bold p-5'>
          <div>Logo Here</div>
        </div>
        <nav id='menu' className='h-full p-3 px-6 flex flex-col justify-between'>
          <li className="list-none space-y-5 text-lg">
            {sidebarData.map((data, index) => (
              <ol key={index} className="flex items-center gap-1 justify-start">
                <span className="text-2xl">{data.icon}</span>
                <Link className='line-clamp-1 truncate' to={data.link}>{data.title}</Link>
              </ol>
            ))}
          </li>
          <div className='w-full h-32'>
            <Button isLoading={isLoading} color="danger" radius='sm' className='text-xl mt-10 flex gap-5 justify-start items-center w-full' onClick={logout}>
              <TbLogout className='text-2xl' />Logout
            </Button>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar