import React, { useEffect, useState } from 'react'
import { FaPhone } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { BASE_URL } from '../../../server/Url'
import { Button, Chip, Divider, Input } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import { IoEye, IoEyeOffSharp } from 'react-icons/io5'
import { ToastContainer, toast, Slide } from 'react-toastify';


const ProfilePage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['__USERTOKEN__']);
  const [user, setUser] = useState({
    'name': '',
    'email': '',
    'phone_num': ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isVisibleNowPass, setIsVisibleNowPass] = useState(false)
  const [isVisibleConfirmPass, setIsVisibleConfirmPass] = useState(false)
  const [isVisibleNewPass, setIsVisibleNewPass] = useState(false)
  const [nowPass, setNowPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [changePasswordDisabled, setChangePasswordDisabled] = useState({
    'nowPass': true,
    'confirmPass': true,
    'newPass': true
  })

  const [nowPassError, setNowPassError] = useState(false)
  const [nowPassErrorMessage, setNowPassErrorMessage] = useState('')

  const [confirmPassError, setConfirmPassError] = useState(false)
  const [confirmPassErrorMessage, setConfirmPassErrorMessage] = useState('')

  const [newPassError, setNewPassError] = useState(false)
  const [newPassErrorMessage, setNewPassErrorMessage] = useState('')

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

  // const hanldeLogout = async () => {
  //   setIsLoading(true)
  //   try {
  //     const response = await axios.get(BASE_URL + '/logout', {
  //       headers: {
  //         'Authorization': 'Bearer ' + cookies.__USERTOKEN__
  //       },
  //       withCredentials: true
  //     })
  //     if (response.data.success) {
  //       removeCookie('__USERTOKEN__')
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     setIsLoading(false)
  //   }
  // }

  const toggleVisibilityNowPass = () => setIsVisibleNowPass(!isVisibleNowPass);
  const toggleVisibilityConfirmPass = () => setIsVisibleConfirmPass(!isVisibleConfirmPass);
  const toggleVisibilityNewPass = () => setIsVisibleNewPass(!isVisibleNewPass);

  const handleNowPassInput = (e) => {
    if (e.target.value.length > 0) {
      setChangePasswordDisabled({ ...changePasswordDisabled, 'nowPass': false })
    } else {
      setChangePasswordDisabled({ ...changePasswordDisabled, 'nowPass': true })
    }
    setNowPass(e.target.value)
  }

  const handleConfirmPassInput = (e) => {
    if (e.target.value.length > 0) {
      setChangePasswordDisabled({ ...changePasswordDisabled, 'confirmPass': false })
    } else {
      setChangePasswordDisabled({ ...changePasswordDisabled, 'confirmPass': true })
    }
    setConfirmPass(e.target.value)
  }

  const handleNewPassInput = (e) => {
    if (e.target.value.length > 0) {
      setChangePasswordDisabled({ ...changePasswordDisabled, 'newPass': false })
    } else {
      setChangePasswordDisabled({ ...changePasswordDisabled, 'newPass': true })
    }
    setNewPass(e.target.value)
  }

  const submitChangePassword = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(BASE_URL + "/changePassword", {
        old_password: nowPass,
        confirm_password: confirmPass,
        new_password: newPass,
      }, {
        headers: {
          'Authorization': 'Bearer ' + cookies.__USERTOKEN__
        }
      });
      if (response.data.success) {
        toast.success('Berhasil mengubah password!');
        setIsLoading(false)
        clearState()
      }
    } catch (error) {
      if (error.response != undefined) {
        if (error.response.data.message['old_password']) {
          setNowPassError(true);
          setNowPassErrorMessage(error.response.data.message['old_password'][0])
        }

        if (error.response.data.message['confirm_password']) {
          setConfirmPassError(true);
          setConfirmPassErrorMessage(error.response.data.message['confirm_password'][0])
        }

        if (error.response.data.message['new_password']) {
          setNewPassError(true);
          setNewPassErrorMessage(error.response.data.message['new_password'][0])
        }

        if (!error.response.data.message['old_password'] && !error.response.data.message['confirm_password'] && !error.response.data.message['new_password']) {
          toast.error('Server error: ' + error.response.data.message);
        }
      }

      setIsLoading(false);
    }
  }

  const clearState = () => {
    setNowPassError(false)
    setNowPassErrorMessage('')
    setConfirmPassError(false)
    setConfirmPassErrorMessage('')
    setNewPassError(false)
    setNewPassErrorMessage('')
    setNowPass('')
    setConfirmPass('')
    setNewPass('')
    
    setChangePasswordDisabled({
      'nowPass': true,
      'confirmPass': true,
      'newPass': true
    })
  }

  useEffect(() => {
    if (cookies.__USERTOKEN__ !== undefined) {
      fetchUserData()
    }
  }, [])

  if (cookies.__USERTOKEN__ !== undefined) {
    return (
      <section className='w-full h-full bg-blue-400 relative'>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          theme="light"
          transition:Slide
        />
        <div className='w-full absolute top-0 h-[15%] flex justify-left items-center text-2xl text-white font-bold px-5'>
          Profil
        </div>
        <div className='absolute bottom-0 h-[85%] bg-white w-full rounded-t-3xl p-5 flex flex-col items-center justify-start gap-5'>
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
          <Divider></Divider>
          <div className='w-full flex flex-col gap-4 justify-center items-center'>
            <h1 className='text-xl'>Ubah Password</h1>
            <Input
              label='Password sekarang'
              onChange={handleNowPassInput}
              value={nowPass}
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibilityNowPass}>
                  {isVisibleNowPass ? (
                    <IoEyeOffSharp className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <IoEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisibleNowPass ? "text" : "password"}
              isInvalid={nowPassError} errorMessage={nowPassErrorMessage}
            ></Input>

            <Input label='Password baru'
              onChange={handleNewPassInput}
              value={newPass}
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibilityNewPass}>
                  {isVisibleNewPass ? (
                    <IoEyeOffSharp className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <IoEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisibleNewPass ? "text" : "password"}
              isInvalid={newPassError} errorMessage={newPassErrorMessage}
            ></Input>
            <Input
              label='Konfirmasi password'
              value={confirmPass}
              onChange={handleConfirmPassInput}
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibilityConfirmPass}>
                  {isVisibleConfirmPass ? (
                    <IoEyeOffSharp className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <IoEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisibleConfirmPass ? "text" : "password"}
              isInvalid={confirmPassError} errorMessage={confirmPassErrorMessage}
            ></Input>
            <Button
              isLoading={isLoading}
              fullWidth
              color='primary'
              isDisabled={changePasswordDisabled.nowPass || changePasswordDisabled.confirmPass || changePasswordDisabled.newPass}
              onPress={submitChangePassword}>Ubah Password</Button>
          </div>
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