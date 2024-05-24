import React, { useEffect, useState } from 'react'
import { Tabs, Tab, Button, Accordion, AccordionItem, Spinner } from "@nextui-org/react";
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../server/Url';

const formatDate = (dateString) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const date = new Date(dateString);
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    return `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
}

const TransactionProduct = ({ data }) => {
    return (
        <div className='flex w-full h-20'>
            <div className='w-2/3 h-full'>
                <h1 className='text-lg'>{data.product.product_name}</h1>
                <h2>{'@Rp ' + data.product.price + ',00'}</h2>
                <h2>{data.quantity + 'x'}</h2>
            </div>
            <div className='w-1/3 h-full text-end'>
                <div>{'Rp' + data.total_price + ',00'}</div>
            </div>
        </div>
    )
}

const AccordionTitle = ({ transaction_id, nomor_antrian }) => {
    return (
        <div className='flex flex-col justify-start items-start'>
            <h2 className='text-lg text-gray-600 text-center'>{'Nomor Antrian: '}<span className='font-bold'>{nomor_antrian}</span></h2>
            <h2 className='text-xs text-gray-600 text-center'>{'Transaction #' + transaction_id}</h2>
        </div>
    )

}

const OnWorkTransaction = () => {
    const [transaction, setTransaction] = useState([])
    const [cookies] = useCookies(['__USERTOKEN__'])
    const [isLoading, setIsLoading] = useState(true)

    console.log(cookies)

    const fetchTranscation = async () => {
        try {
            const response = await axios.get(BASE_URL + "/getQueueByUserLoggedIn", {
                headers: {
                    Authorization: `Bearer ${cookies.__USERTOKEN__}`
                }
            })
            console.log(response.data.data)
            setTransaction(response.data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchTranscation()
    }, [])

    useEffect(() => {
        console.log(transaction)
    }, [transaction])

    if (isLoading) return (<div className='w-full flex justify-center items-center mt-10'><Spinner /></div>)

    if (transaction.length === 0) {
        return (
            <div className='flex flex-col justify-center items-center w-full text-base gap-5 mt-10'>
                <h1>Anda belum membuat transaksi hari ini</h1>
                <Link to={'/makeTransaction'}>
                    <Button size='lg' color='primary'>Tambah Transaksi</Button>
                </Link>
            </div>
        )
    } else {
        return (
            <>
                {transaction.map((data, index) => (
                    <Accordion key={index}>
                        <AccordionItem key="1" aria-label="Accordion 1" title={<AccordionTitle transaction_id={data.transaction.id} nomor_antrian={data.no_antrian} />} className='border-b-1 border-b-gray-400 mb-2'>
                            <div className='flex flex-col'>
                                <h1 className='text-center font-bold text-xl mb-2'>Detail Transaksi</h1>
                                <div className='flex justify-between'>
                                    <h2 className='text-sm text-gray-600 text-center'>{'Transaction #' + data.transaction.id}</h2>
                                    <h2 className='text-sm text-gray-600 text-center'>{formatDate(data.transaction.created_at)}</h2>
                                </div>
                                <hr className=' border-gray-300 my-2'></hr>
                                <div className='flex flex-col justify-center w-full h-auto items-center py-3 gap-3'>
                                    <div>Nomor Antrian</div>
                                    <div className='size-32 bg-blue-500 rounded-full flex justify-center items-center text-white text-7xl'>
                                        {data.no_antrian}
                                    </div>
                                    <div className='flex w-full h-auto justify-center items-center gap-3'>
                                        <h3>Status: </h3>
                                        <div className='flex items-center justify-center gap-2'>
                                            <div className={data.status == 'ONWORK' ? 'size-3 rounded-full animate-ping bg-green-400' : 'size-3 rounded-full animate-ping bg-red-400'}></div>
                                            <h4>{data.status}</h4>
                                        </div>
                                    </div>
                                </div>
                                <hr className=' border-gray-300 my-2'></hr>
                                <div className='flex flex-col w-full h-auto gap-2'>
                                    <h1 className='text-base'>Produk</h1>
                                    {data.transaction.detail_transaction.map((data, index) => (
                                        <TransactionProduct key={index} data={data} />
                                    ))}
                                    <div className='w-full h-auto flex'>
                                        <h1 className='text-base w-2/3'>Metode Pembayaran</h1>
                                        <h1 className='text-base w-1/3 text-end'>{data.transaction.paying_method}</h1>
                                    </div>
                                    <div className='w-full h-auto flex'>
                                        <h1 className='text-base w-2/3'>Kembalian</h1>
                                        <h1 className='text-base w-1/3 text-end'>{'Rp ' + data.transaction.change + ',00'}</h1>
                                    </div>
                                    <div className='w-full h-auto flex'>
                                        <h1 className='text-xl font-bold w-2/3'>Total</h1>
                                        <h1 className='text-xl w-1/3 text-end'>{'Rp' + data.transaction.total + ',00'}</h1>
                                    </div>
                                </div>
                            </div>
                        </AccordionItem>
                    </Accordion>
                ))}
            </>
        )

    }
}

const TransactionHistoryItems = ({ data }) => {
    return (
        <div className='w-full h-auto border-b-gray-400 border-b-2 flex p-2'>
            <div className='h-full w-2/3 flex flex-col'>
                <h1 className='text-lg font-bold'>{'Transaction #' + data.id} </h1>
                <h2 className='text-sm text-gray-600'>{data.paying_method}</h2>
                <h2 className='text-sm text-gray-600'>{formatDate(data.created_at)}</h2>
            </div>
            <div className='h-full w-1/3 flex flex-col items-end gap-1'>
                <div>{'Rp ' + data.total + ',00'}</div>
                <Button size='sm' color='primary'>Detail</Button>
            </div>
        </div>
    )
}

const TransactionHistory = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [cookie] = useCookies(['__USERTOKEN__'])
    const [transaction, setTransaction] = useState([{}])

    const fetchTransactionHistory = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(BASE_URL + '/getTransactionByUserLoggedIn', {
                headers: {
                    Authorization: `Bearer ${cookie.__USERTOKEN__}`
                }
            })
            console.log(response.data.data)
            setTransaction(response.data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchTransactionHistory()
    }, [])

    if (isLoading) {
        return (
            <div className='flex justify-center items-center w-full'>
                <Spinner />
            </div>
        )
    } else {
        return (
            <div className='flex flex-col'>
                {transaction.map((data, index) => (
                    <TransactionHistoryItems key={index} data={data} />
                ))}
            </div>
        )

    }
}

const TransactionPage = () => {
    const [isDisabled, setIsDisabled] = useState(true)
    const [cookies, setCookies] = useCookies(['__USERTOKEN__'])

    useEffect(() => {
        if (cookies.__USERTOKEN__) {
            setIsDisabled(false)
        }
    }, [])

    if (isDisabled) {
        return (
            <section className='px-3 w-full h-full bg-white'>
                <Tabs aria-label="Options" variant='underlined' fullWidth isDisabled={isDisabled}>
                    <Tab key="photos" title="Antrian Berjalan">
                        <div className='h-[90%] bg-white w-full p-5 flex justify-center flex-col items-center gap-5'>
                            <div className='text-2xl text-center'>Login untuk memulai melakukan transaksi!</div>
                            <Link to={'/login'}>
                                <Button color='primary' size='lg'>LOGIN</Button>
                            </Link>
                        </div>
                    </Tab>
                    <Tab key="music" title="Riwayat Transaksi">
                        <TransactionHistory />
                    </Tab>
                </Tabs>
            </section>
        )
    } else {
        return (
            <section className='px-3 w-full h-full bg-white'>
                <Tabs aria-label="Options" variant='underlined' fullWidth isDisabled={isDisabled}>
                    <Tab key="photos" title="Antrian Berjalan">
                        <OnWorkTransaction />
                    </Tab>
                    <Tab key="music" title="Riwayat Transaksi">
                        <TransactionHistory />
                    </Tab>
                </Tabs>
            </section>
        )
    }
}

export default TransactionPage