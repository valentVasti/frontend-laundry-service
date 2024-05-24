import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input } from '@nextui-org/react'
import React, { useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../server/Url';
import { useCookies } from 'react-cookie';

const LoginPage = () => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [emailInvalid, setEmailInvalid] = useState(false)
    const [passwordInvalid, setPasswordInvalid] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

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
            if(error.response.data.message['email']){
                setEmailInvalid(true);
                setEmailError(error.response.data.message['email'][0])
            }

            if(error.response.data.message['password']){
                setPasswordInvalid(true);
                setPasswordError(error.response.data.message['password'][0])
            }

            if(error.response.data.message['role']){
                setEmailInvalid(true);
                setEmailError(error.response.data.message['role'][0])
            }

            setIsLoading(false);
        }
    }

    return (
        <>
            <div className='h-screen w-full flex justify-center items-center'>
                <Card className='w-96'>
                    <CardHeader>
                        <p className='text-3xl text-center w-full'>LOGIN PAGE</p>
                    </CardHeader>
                    <Divider />
                    <CardBody className='flex flex-col gap-8 py-5'>
                        <Input label="Email" placeholder='Masukkan Email ...' labelPlacement='outside' onInput={handleEmail} isInvalid={emailInvalid} errorMessage={emailError}></Input>
                        <Input type='password' label="Password" placeholder='Masukkan password ...' labelPlacement='outside' onInput={handlePassword} isInvalid={passwordInvalid} errorMessage={passwordError}></Input>
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