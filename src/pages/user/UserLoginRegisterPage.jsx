import React, { useState } from 'react'
import { Button, Input, Tab, Tabs, select, Link } from '@nextui-org/react'
import { Link as LinkReactDom, redirect, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { BASE_URL } from '../../server/Url';
import { useCookies } from 'react-cookie';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../assets/logo.png';

const UserLoginRegisterPage = () => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [selected, setSelected] = useState('login');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNum, setPhoneNum] = useState('');
    const [name, setName] = useState('');

    const [emailInvalid, setEmailInvalid] = useState(false);
    const [emailRegisterInvalid, setEmailRegisterInvalid] = useState(false);
    const [passwordInvalid, setPasswordInvalid] = useState(false);
    const [passwordRegisterInvalid, setPasswordRegisterInvalid] = useState(false);
    const [nameInvalid, setNameInvalid] = useState(false);
    const [phoneNumInvalid, setPhoneNumInvalid] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [emailRegisterError, setEmailRegisterError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordRegisterError, setPasswordRegisterError] = useState('');
    const [nameError, setNameError] = useState('');
    const [phoneNumError, setPhoneNumError] = useState('');
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handlePhoneNumChange = (e) => {
        setPhoneNum(e.target.value);
    }

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const submitLogin = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(BASE_URL + "/login/user", {
                email: email,
                password: password
            });
            console.log(response.data.data);
            if (response.data.message) {
                setCookie('__USERTOKEN__', response.data.token, { path: '/' });
                setCookie('__USERNAME__', response.data.data.name, { path: '/' });
                setCookie('__USERID__', response.data.data.id, { path: '/' });
                navigate('/');
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


            if (!error.response.data.message['email'] && !error.response.data.message['password'] && !error.response.data.message['role'] && !error.response.data.message['name'] && !error.response.data.message['phone_num']) {
                toast.error('Server error: ' + error.response.data.message);
            }

            setIsLoading(false);
        }
    }

    const submitRegister = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(BASE_URL + "/register", {
                name: name,
                email: email,
                password: password,
                phone_num: phoneNum,
                role: 'KONSUMEN'
            });
            console.log(response.data);
            if (response.data.message) {
                toast.success('Akun berhasil dibuat!', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    pauseOnHover: false,
                    closeOnClick: false,
                    closeButton: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                });
                setSelected('login');
                setIsLoading(false);
            } else {
                console.log('Login failed');
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(error.response.data.message);

            if (error.response.data.message['name']) {
                setNameInvalid(true);
                setNameError(error.response.data.message['name'][0]);
            }

            if (error.response.data.message['email']) {
                setEmailRegisterInvalid(true);
                setEmailRegisterError(error.response.data.message['email'][0]);
            }

            if (error.response.data.message['phone_num']) {
                setPhoneNumInvalid(true);
                setPhoneNumError(error.response.data.message['phone_num'][0]);
            }

            if (error.response.data.message['password']) {
                setPasswordRegisterInvalid(true);
                setPasswordRegisterError(error.response.data.message['password'][0]);
            }


            if (!error.response.data.message['email'] && !error.response.data.message['password'] && !error.response.data.message['role'] && !error.response.data.message['name'] && !error.response.data.message['phone_num']) {
                toast.error('Server error: ' + error.response.data.message);
            }

            setIsLoading(false);
        }
    }

    return (
        <section className='w-full h-screen bg-gray-100 flex justify-center items-center'>
            <section className='bg-blue-400 h-screen w-full md:w-[500px] overflow-hidden relative'>
                <div className='w-full h-[15%] flex justify-center items-center text-3xl font-bold text-white'>
                    <img src={logo} className='h-[80%] bg-white rounded-b-xl p-2 shadow-2xl self-start' />
                </div>
                <div className='absolute bottom-0 bg-white w-full h-[85%] rounded-t-3xl px-5 py-10'>
                    <ToastContainer
                        position="bottom-center"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        draggable
                        theme="light"
                        transition:Slide
                    />
                    <Tabs
                        fullWidth
                        size="md"
                        aria-label="Tabs form"
                        selectedKey={selected}
                        onSelectionChange={(e) => setSelected(e)}
                    >
                        <Tab key="login" title="Masuk">
                            <form className="flex flex-col gap-7 mt-5">
                                <Input isRequired label="Email" placeholder="Masukkan email terdaftar" type="email" onChange={handleEmailChange} isInvalid={emailInvalid} errorMessage={emailError} />
                                <Input
                                    isRequired
                                    label="Password"
                                    placeholder="Masukkan password"
                                    type="password"
                                    onChange={handlePasswordChange}
                                    isInvalid={passwordInvalid}
                                    errorMessage={passwordError}
                                />
                                <p className="text-center text-small cursor-pointer">
                                    Belum buat akun?{" "}
                                    <Link size="sm" onPress={() => setSelected("sign-up")}>
                                        Daftar
                                    </Link>
                                </p>
                                <div className="flex gap-2 justify-end">
                                    <Button fullWidth color="primary" onPress={submitLogin} isLoading={isLoading}>
                                        Masuk
                                    </Button>
                                </div>
                            </form>
                        </Tab>
                        <Tab key="sign-up" title="Daftar">
                            <form className="flex flex-col gap-7 mt-5">
                                <Input isRequired label="Name" placeholder="Masukkan nama anda" type="text" onChange={handleNameChange} isInvalid={nameInvalid} errorMessage={nameError} />
                                <Input isRequired label="Email" placeholder="Masukkan email anda" type="email" onChange={handleEmailChange} isInvalid={emailRegisterInvalid} errorMessage={emailRegisterError} />
                                <Input isRequired label="Phone number" placeholder="Masukkan nomor telepon anda" type="number" onChange={handlePhoneNumChange} isInvalid={phoneNumInvalid} errorMessage={phoneNumError} />
                                <Input
                                    isRequired
                                    label="Password"
                                    placeholder="Masukkan password"
                                    type="password"
                                    onChange={handlePasswordChange}
                                    isInvalid={passwordRegisterInvalid}
                                    errorMessage={passwordRegisterError}
                                />
                                <p className="text-center text-small cursor-pointer">
                                    Sudah punya akun?{" "}
                                    <Link size="sm" onPress={() => setSelected("login")} >
                                        Login
                                    </Link>
                                </p>
                                <div className="flex gap-2 justify-end">
                                    <Button fullWidth color="primary" onPress={submitRegister} isLoading={isLoading}>
                                        Daftar
                                    </Button>
                                </div>
                            </form>
                        </Tab>
                    </Tabs>
                    <LinkReactDom to={'/'} size="sm" className='text-gray-400 underline underline-offset-2'>
                        <p className="text-center text-small underline">
                            Kembali ke halaman utama
                        </p>
                    </LinkReactDom>

                </div>

            </section>
        </section>
    )
}

export default UserLoginRegisterPage