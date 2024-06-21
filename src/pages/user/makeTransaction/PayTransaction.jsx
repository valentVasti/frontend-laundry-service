import { Button, Chip, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure, Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { useStore } from '../../../server/store.jsx'
import { useCookies } from 'react-cookie'
import Swal from 'sweetalert2'
import axios from 'axios'
import { BASE_URL } from '../../../server/Url'
import { Link } from 'react-router-dom'
import { FaCopy } from 'react-icons/fa6'
import toast, { Toaster } from 'react-hot-toast'

const DetailTransactionItem = ({ data }) => {
    return (
        <div className='flex w-full h-auto justify-between'>
            <div className='flex flex-col w-1/3'>
                <p>{data.product_name}</p>
                <p>{data.qty + 'x'}</p>
            </div>
            <div className='flex justify-center items-center text-sm w-1/3'>
                <p>{'@Rp' + data.price + ',00'}</p>
            </div>
            <div className='flex justify-end items-center w-1/3'>
                <p>{'Rp' + data.price * data.qty + ',00'}</p>
            </div>
        </div>
    )
}

const PayTransaction = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [cookies, removeCookies] = useCookies()
    const [successData, setSuccessData] = useState({
        'transaction_id': 1,
        'created_at': 'Sabtu, 20 Maret 2024 11:00:00',
        'token': '111111',
        'nomor_antrian': 0,
        'mesin': 'C1',
        'jenis_mesin': 'pengering',
        'status': ''
    })
    const [thresholdTime, setThresholdTime] = useState(0)

    const fetchThresholdTime = async () => {
        try {
            const response = await axios.get(BASE_URL + "/thresholdTime", {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                },
            });
            setThresholdTime(response.data.data.threshold_time);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchThresholdTime()
    }, [])

    const [isLoading, setIsLoading] = useState(false)

    const handleCopyButton = () => {
        navigator.clipboard.writeText(successData.token)
            .then(() => {
                toast.success('Copied to clipboard!', { duration: 2000 }, { position: 'top-center' })
            }, () => {
                toast.error('Failed to copy', { duration: 2000 }, { position: 'top-center' })
            });
    };

    const transactionSummary = cookies.transactionSummary

    const finalData = [
        {
            "user_id": transactionSummary.user_id != undefined ? transactionSummary.user_id : 1,
            "paying_method": transactionSummary.paying_method != undefined ? transactionSummary.paying_method : 'CASHLESS',
            "total": transactionSummary.total != undefined ? transactionSummary.total : 0,
            "paid_sum": transactionSummary.paid_sum != undefined ? transactionSummary.paid_sum : 0,
            "item": transactionSummary.item != undefined ? JSON.stringify(transactionSummary.item) : []
        }
    ]

    const handleConfirmAndPayButton = async () => {
        // onOpen()
        console.log(finalData[0])
        setIsLoading(true)
        try {
            const response = await axios.post(BASE_URL + "/transaction", finalData[0], {
                headers: {
                    Authorization: 'Bearer ' + cookies.__USERTOKEN__
                }
            });
            console.log(response.data.data);
            if (response.data.success) {
                if (response.data.data.queue.mesin !== undefined) {
                    setSuccessData({
                        'transaction_id': response.data.data.transaction_data.id,
                        'created_at': response.data.data.transaction_data.created_at,
                        'token': response.data.data.token.data.token,
                        'nomor_antrian': response.data.data.queue.nomor_antrian,
                        'mesin': response.data.data.queue.mesin.kode_mesin,
                        'jenis_mesin': response.data.data.queue.mesin.jenis_mesin,
                        'status': response.data.data.queue.status
                    })
                } else {
                    setSuccessData({
                        'transaction_id': response.data.data.transaction_data.id,
                        'created_at': response.data.data.transaction_data.created_at,
                        'token': response.data.data.token.data.token,
                        'nomor_antrian': response.data.data.queue.nomor_antrian,
                        'mesin': response.data.data.queue.today_queue.mesin.jenis_mesin,
                        'jenis_mesin': response.data.data.queue.jenis_mesin,
                        'status': response.data.data.queue.status
                    })
                }
                onOpen()
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false)
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='w-screen h-screen flex justify-center items-center md:bg-orange-100 overflow-x-hidden'>
            <section className='min-h-screen max-h-auto w-full md:w-[500px] bg-white relative overflow-auto'>
                <div className='w-full px-2'>
                    <h1 className='text-xl text-center my-3'>Ringkasan Transaksi</h1>
                    <Divider />
                    <div className='flex flex-col w-full gap-3 py-5 px-2'>
                        {transactionSummary.item.map((item, index) => (
                            <DetailTransactionItem key={index} data={item} />
                        ))}                       
                    </div>
                    <Divider />
                    <div className='flex w-full justify-between px-2 py-3 items-center'>
                        <p className='text-xl'>Total</p>
                        <p className='text-xl'>{'Rp' + transactionSummary.total + ',00'}</p>
                    </div>
                </div>
                <ol className='list-disc text-sm text-gray-400 ps-7 pe-1 flex flex-col gap-1'>
                    <li>Nomor antrian didapat setelah menyelesaikan transaksi</li>
                    <li>Diharapakan datang 10 menit sebelum giliran anda</li>
                    <li>Transaksi yang sudah dilakukan <span className='font-bold'>tidak dapat dibatalkan</span></li>
                    <li>Toleransi kedatangan <span className='font-bold'>{thresholdTime + ' menit '}</span>setelah antrian anda, apabila tidak datang, maka akan <span className='font-bold'>antrian akan berlanjut dan nomor antrian anda akan hangus</span></li>
                </ol>
                <div className='absolute w-full flex justify-center items-center bottom-[3%] px-2 gap-2'>
                    <Link to={'/makeTransaction'}><Button className='text-white bg-gray-400 w-1/3' size='lg'>Batal</Button></Link>
                    <Button className='text-white w-2/3' color='primary' size='lg' onPress={handleConfirmAndPayButton} isLoading={isLoading}>Konfirmasi dan Bayar</Button>
                </div>
            </section>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={true} isKeyboardDismissDisabled={true} hideCloseButton={true} placement='top'>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader>Transaction Success!</ModalHeader>
                            <ModalBody>{
                                successData.transaction_id == 0 ? (
                                    <Spinner size='lg' color='primary' />
                                ) : (
                                    <section className='flex flex-col justify-center items-center'>
                                        <div className='text-lg font-bold'>{'Transaction ID #' + successData.transaction_id}</div>
                                        <div className='text-sm'>{successData.created_at}</div>
                                        <div className='text-lg text-center mt-2'>
                                            {
                                                successData.status == 'ONWORK' ? (
                                                    <>
                                                        <div className='flex gap-2 justify-center items-center'>
                                                            <div className='size-3 bg-green-400 animate-ping rounded-full'></div>
                                                            <h4>Berjalan</h4>
                                                        </div>
                                                        <p className='text-xs'>Segera datang dan gunakan token!</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className='flex gap-2 justify-center items-center'>
                                                            <div className='size-3 bg-red-400 animate-ping rounded-full'></div>
                                                            <h4>Diantrikan</h4>
                                                        </div>
                                                        <p className='text-xs'>Silahkan lihat antrian sekarang untuk estimasi kedatanganw!</p>
                                                    </>
                                                )
                                            }
                                        </div>

                                        <div className='flex flex-col justify-center items-center my-4 gap-2'>
                                            <h4>Nomor Antrian:</h4>
                                            <div className='size-24 text-5xl bg-blue-400 rounded-full flex justify-center items-center text-white'>
                                                {successData.nomor_antrian}
                                            </div>
                                            <div className='flex flex-col justify-center items-center gap-2 mt-3'>
                                                <h4>{'Mesin ' + successData.jenis_mesin}</h4>
                                                <Chip size='lg'>{successData.mesin}</Chip>
                                            </div>
                                            <div className='flex flex-col justify-center items-center gap-2 mt-3'>
                                                <h4>Token Transaksi</h4>
                                                <h4 className='font-bold tracking-wider flex justify-center items-center gap-3'>{successData.token} <FaCopy onClick={handleCopyButton} /></h4>
                                                <p className='text-sm text-center italic text-gray-600'>Berikan token kepada kasir untuk mengambil koin sejumlah transaksi dan konfirmasi kedatangan</p>
                                            </div>
                                        </div>
                                    </section>
                                )
                            }
                            </ModalBody>
                            <ModalFooter>
                                <Link to={'/transaction'} className='w-full'>
                                    <Button color="primary" className='w-full'>
                                        Pergi ke halaman antrian saya
                                    </Button>
                                </Link>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Toaster />
        </div>
    )
}

export default PayTransaction