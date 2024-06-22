import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input } from '@nextui-org/react'
import React, { useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../server/Url';
import { useCookies } from 'react-cookie';
import logo from '../../assets/logo.png'
import { IoEye, IoEyeOffSharp } from 'react-icons/io5';

const LoginPage = () => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [emailInvalid, setEmailInvalid] = useState(false)
    const [passwordInvalid, setPasswordInvalid] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [isVisible, setIsVisible] = useState(false);

    const handleEmail = (e) => {
        resetForm('email')
        setEmail(e.target.value)
    }

    const handlePassword = (e) => {
        resetForm('password')
        setPassword(e.target.value)
    }

    const resetForm = (key) => {
        switch (key) {
            case 'email':
                setEmailInvalid(false)
                setEmailError('')
                break;

            case 'password':
                setPasswordInvalid(false)
                setPasswordError('')
                break;

            default:
                true
                break;
        }
    }

    const submitLogin = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(BASE_URL + "/login/admin", {
                email: email,
                password: password
            });
            console.log(response.data);
            if (response.data.message) {
                setCookie('__ADMINTOKEN__', response.data.token, { path: '/' });
                setCookie('__ROLE__', response.data.data.role, { path: '/' })
                window.location.href = '/admin';
            } else {
                console.log('Login failed');
            }
        } catch (error) {
            if (error.response.data.message['email']) {
                setEmailInvalid(true);
                setEmailError(error.response.data.message['email'][0])
            }

            if (error.response.data.message['password']) {
                setPasswordInvalid(true);
                setPasswordError(error.response.data.message['password'][0])
            }

            if (error.response.data.message['role']) {
                setEmailInvalid(true);
                setEmailError(error.response.data.message['role'][0])
            }

            setIsLoading(false);
        }
    }

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <>
            <div className='h-screen w-full flex justify-center items-center'>
                <Card className='w-96'>
                    <CardHeader>
                        <div className='flex flex-col w-full gap-4'>
                            <div className='w-full h-[15%] flex justify-center items-center text-3xl font-bold text-white bg-gray-200 rounded-xl self-start pb-4'>
                                <img src={logo} className='h-20 bg-white rounded-b-xl p-2' />
                            </div>
                            <p className='text-2xl text-center w-full'>LOGIN ADMIN PAGE</p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className='flex flex-col gap-8 py-5'>
                        <Input label="Email" placeholder='Masukkan Email ...' labelPlacement='outside' onInput={handleEmail} isInvalid={emailInvalid} errorMessage={emailError}></Input>
                        <Input label="Password" placeholder='Masukkan password ...' labelPlacement='outside' onInput={handlePassword} isInvalid={passwordInvalid} errorMessage={passwordError}
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <IoEyeOffSharp className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <IoEye className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}></Input>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                        <Button color='primary' fullWidth onPress={submitLogin} isLoading={isLoading}>Login</Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}

export default LoginPage