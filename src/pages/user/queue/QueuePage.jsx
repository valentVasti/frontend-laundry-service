import React, { useEffect, useState } from 'react'
import { Tabs, Tab, Chip, Divider } from "@nextui-org/react";
import PengeringList from './queueList/pengering/PengeringList';
import PencuciList from './queueList/pencuci/PencuciList';
import AntrianList from './queueList/antrian/AntrianList';
import logo from '../../../assets/logo.png';
import { MdLogout } from 'react-icons/md';
import axios from 'axios';
import { BASE_URL } from '../../../server/Url';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const TabsComponent = ({ selected }) => {

    return (
        <>
            {selected === 'pencuci' && (
                <div className='py-3'>
                    <h1 className='text-xl w-full text-center mb-2'>Mesin Cuci Hari Ini</h1>
                    <div className='flex justify-start items-center gap-2 px-3 my-3 flex-wrap'>
                        <h1>Ket.</h1>
                        <Chip color='secondary' className='text-white'>
                            Kode Mesin
                        </Chip>
                        <Chip color='primary' className='w-full'>
                            Nomor Antrian Berjalan
                        </Chip>
                    </div>
                    <div className='flex justify-start items-center gap-2 px-3 my-3 flex-wrap'>
                        <div className='flex justify-center items-center gap-1'>
                            <div className=' bg-green-500 text-white rounded-full size-3'>
                            </div>
                            <h1>Siap Digunakan</h1>
                        </div>
                        <div className='flex justify-center items-center gap-1'>
                            <div className=' bg-red-500 text-white rounded-full size-3'>
                            </div>
                            <h1>Sedang Digunakan</h1>
                        </div>
                    </div>
                    <PencuciList />
                </div>)}
            {selected === 'pengering' && (
                <div className='py-3'>
                    <h1 className='text-xl w-full text-center mb-2'>Mesin Pengering Hari Ini</h1>
                    <div className='flex justify-start items-center gap-2 px-3 my-3 flex-wrap'>
                        <h1>Ket.</h1>
                        <Chip color='warning' className='text-white'>
                            Kode Mesin
                        </Chip>
                        <Chip color='primary' className='w-full'>
                            Nomor Antrian Berjalan
                        </Chip>
                    </div>
                    <div className='flex justify-start items-center gap-2 px-3 my-3 flex-wrap'>
                        <div className='flex justify-center items-center gap-1'>
                            <div className=' bg-green-500 text-white rounded-full size-3'>
                            </div>
                            <h1>Siap Digunakan</h1>
                        </div>
                        <div className='flex justify-center items-center gap-1'>
                            <div className=' bg-red-500 text-white rounded-full size-3'>
                            </div>
                            <h1>Sedang Digunakan</h1>
                        </div>
                    </div>
                    <PengeringList />
                </div>
            )}
            {selected === 'antrian' && (
                <div className='py-2'>
                    <h1 className='text-xl w-full text-center mb-2'>Antrian Hari Ini</h1>
                    <div className='flex justify-start items-center gap-2 px-3 my-3'>
                        <h1>Ket.</h1>
                        <Chip color='warning' className='text-white'>
                            Pencuci
                        </Chip>
                        <Chip color='secondary' className='w-full'>
                            Pengering
                        </Chip>
                        <Chip color='primary' className='w-full'>
                            Nomor Antrian
                        </Chip>
                    </div>
                    <AntrianList />
                </div>
            )}
        </>
    );
}

const QueuePage = () => {
    const [cookies, setCookie, removeCookie] = useCookies()
    const [selectedTab, setSelectedTab] = useState('photos')

    const hanldeLogout = async () => {
        try {
            const response = await axios.get(BASE_URL + '/logout', {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__USERTOKEN__
                },
                withCredentials: true
            })
            if (response.data.success) {
                removeCookie('__USERTOKEN__')
                removeCookie('__USERNAME__')
                toast.success('Berhasil keluar!')
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    return (
        <section className='relative min-h-full max-h-auto px-3 w-full bg-white'>
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
            <div className='w-full h-14 flex justify-between items-center text-3xl font-bold text-white gap-4'>
                <img src={logo} className='h-full bg-white rounded-b-xl p-2 shadow-xl self-start w-1/5' />
                <div className='flex flex-col bg-blue-400 text-white rounded-b-xl self-start w-full h-full justify-center items-center px-3 shadow-xl'>
                    {
                        cookies.__USERTOKEN__ == undefined ? (
                            <div className='font-normal text-sm flex flex-col items-center'>Selamat datang di Wash & Go App! <br/><span className='font-bold ms-1'>Masuk untuk mulai!</span></div>
                        ) : (
                            <>
                                <div className='font-normal text-lg flex items-center'>Hai, <b>{cookies.__USERNAME__}!</b></div>
                                <div className='font-normal text-sm flex items-center tracking-wide'>Siap nyuci hari ini?</div>
                            </>
                        )
                    }
                </div>
                {
                    cookies.__USERTOKEN__ == undefined ? (
                        <Link to={'/login'} className='p-0 self-start h-full'><button className='slef-start h-full bg-orange-500 rounded-b-xl p-2 text-white font-normal text-lg shadow-xl flex items-center gap-2 hover:bg-orange-600 transition ease-in-out duration-300'>Masuk</button></Link>
                    ) : (
                        <button className='h-full w-1/5 justify-center bg-red-500 rounded-b-xl p-2 text-white font-normal text-2xl shadow-xl flex items-center gap-2 hover:bg-red-600 transition ease-in-out duration-300' onClick={() => hanldeLogout()}><MdLogout /></button>
                    )
                }
            </div>
            {/* <div className='flex flex-col w-full justify-center items-center mt-5 gap-4'>
                <h1 className='text-2xl'>Selamat datang di Wash n Go!</h1>
            </div> */}
            {/* <Divider className='my-2' /> */}
            <div className='w-full flex justify-center items-center h-auto mt-5'>
                <h1 className='text-medium w-[70%] text-center mb-5'>Lihat antrean yang sedang berjalan secara <span className='italic'>real-time</span> dibawah ini!</h1>
            </div>
            {/* <div className="flex w-[500px] flex-col sticky z-20 bottom-0 right-0 px-4"> */}
            <Tabs aria-label="Options" fullWidth={true} onSelectionChange={(e) => { setSelectedTab(e) }}>
                <Tab key="pencuci" title="Pencuci">
                    <TabsComponent selected={selectedTab} />
                </Tab>
                <Tab key="pengering" title="Pengering">
                    <TabsComponent selected={selectedTab} />
                </Tab>
                <Tab key="antrian" title="Antrian">
                    <TabsComponent selected={selectedTab} />
                </Tab>
            </Tabs>
            {/* </div> */}
            {/* <TabsComponent selected={selectedTab} /> */}
        </section>
    )
}

export default QueuePage