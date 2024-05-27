import React, { useEffect, useState } from 'react'
import { FaPhone } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { BASE_URL } from '../../../server/Url'
import { Button } from '@nextui-org/react'
import { Link } from 'react-router-dom'

const ProfilePage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['__USERTOKEN__']);
  const [user, setUser] = useState({
    'name': '',
    'email': '',
    'phone_num': ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const fetchUserData = async () => {
    try {
      const response = await axios.get(BASE_URL + "/user", {
        headers: {
          'Authorization': 'Bearer ' + cookies.__USERTOKEN__
        },
      });
      setUser({
        'name': response.data.data.name,
        'email': response.data.data.email,
        'phone_num': response.data.data.phone_num
      })

    } catch (error) {
      console.log(error)
    }

  }

  const hanldeLogout = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(BASE_URL + '/logout', {
        headers: {
          'Authorization': 'Bearer ' + cookies.__USERTOKEN__
        },
        withCredentials: true
      })
      if (response.data.success) {
        removeCookie('__USERTOKEN__')
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (cookies.__USERTOKEN__ !== undefined) {
      fetchUserData()
    }
  }, [])

  if (cookies.__USERTOKEN__ !== undefined) {
    return (
      <section className='w-full h-full bg-blue-400 relative'>
        <div className='w-full absolute top-0 h-[15%] flex justify-left items-center text-2xl text-white font-bold px-5'>
          Profile
        </div>
        <div className='absolute bottom-0 h-[85%] bg-white w-full rounded-t-3xl p-5 flex flex-col items-center gap-5'>
          <h1 className='text-3xl'>{user.name}</h1>
          <div className='flex w-full justify-center items-center h-auto gap-3'>
            <div className='h-1/2 flex items-center gap-2 justify-center'>
              <MdEmail className='text-xl' />
              <h1>{user.email}</h1>
            </div>
            <div className='h-1/2 flex items-center gap-2'>
              <FaPhone className='text-xl' />
              <h1>{user.phone_num}</h1>
            </div>
          </div>
          <Button color='danger' isLoading={isLoading} onPress={hanldeLogout}>Logout</Button>
        </div>
      </section>
    )
  } else {

    return (
      <section className='w-full h-screen bg-blue-400 relative'>
        <div className='w-full absolute top-0 h-[10%] flex justify-left items-center text-2xl text-white font-bold px-5'>
          Profile
        </div>
        <div className='absolute bottom-0 h-[90%] bg-white w-full rounded-t-3xl p-5 flex justify-center flex-col items-center gap-5'>
          <div className='text-2xl text-center'>Masuk untuk memulai melakukan transaksi!</div>
          <Link to={'/login'}>
            <Button color='primary' size='lg'>MASUK</Button>
          </Link>
        </div>
      </section>
    )
  }
}

export default ProfilePage