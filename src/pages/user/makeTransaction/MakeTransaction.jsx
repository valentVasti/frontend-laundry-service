import { Button, Radio, RadioGroup, Spinner, cn } from '@nextui-org/react'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdditionalSection from './AdditionalSection'
import { IoIosArrowDropright } from 'react-icons/io'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { BASE_URL } from '../../../server/Url'
import Swal from 'sweetalert2'
import { IoEllipseSharp } from 'react-icons/io5'

const MakeTransaction = () => {
    const [services, setServices] = useState('First')
    const [total, setTotal] = useState(0)
    const [products, setProducts] = useState([])
    const [cookies, setCookies, removeCookies] = useCookies();
    const [items, setItems] = useState([])
    const [servicesSelected, setServicesSelected] = useState([])
    const [selectedRadio, setSelectedRadio] = useState('Cuci')
    const [userData, setUserData] = useState({})
    const [queueStatus, setQueueStatus] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    // useEffect(() => {
    //     console.log('items state changed:', items)

    //     const transactionSummary = {
    //         user_id: userData.id,
    //         paying_method: 'CASHLESS',
    //         total: total,
    //         paid_sum: total,
    //         item: items
    //     }

    //     console.log('Transaction Summary:', transactionSummary)
    //     setCookies('transactionSummary', transactionSummary, { path: '/' })
    // }, [items])

    // const finalData = [
    //     {
    //       "user_id": selectedConsument.id,
    //       "paying_method": selectedPaymentMethod,
    //       "total": totalPayment,
    //       "paid_sum": selectedPaymentMethod == "CASHLESS" ? totalPayment : paidSum,
    //       "item": JSON.stringify(items)
    //     }
    //   ]

    const isTodayOpenFetch = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(BASE_URL + "/isTodayLogOpened", {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__USERTOKEN__
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
            setIsLoading(false)

        } catch (error) {
            console.log('error', error)
        }
    }

    const fetchUserData = async () => {
        try {
            const response = await axios.get(BASE_URL + "/user", {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__USERTOKEN__
                },
            });

            if (response.data.success) {
                setUserData(response.data.data)
            }
        } catch (error) {
            console.log(error)
            return null
        }

    }

    const fetchProduct = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(BASE_URL + "/product", {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__USERTOKEN__
                }
            })
            console.log(response.data.data)
            setProducts(response.data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const findProductByName = (productName) => {
        const foundProduct = products.find(product => product.product_name === productName)

        if (foundProduct !== undefined) {
            return foundProduct
        }

        return null
    }

    const handlePayButtonClicked = () => {
        if (total == 0) {
            Swal.fire({
                title: "Belum ada produk dipilih!",
                position: 'top',
                background: 'red',
                color: 'white',
                iconColor: 'white',
                icon: 'error',
                backdrop: false,
                showConfirmButton: false,
                toast: true,
                timer: 3000,
                showClass: {
                    popup: `
                animate__animated
                animate__fadeInDown
              `
                },
                hideClass: {
                    popup: `
                animate__animated
                animate__fadeOutUp
                animate__faster
              `
                },
            });
        } else if (servicesSelected.length == 0) {
            Swal.fire({
                title: "Belum ada layanan dipilih!",
                position: 'top',
                background: 'red',
                color: 'white',
                iconColor: 'white',
                icon: 'error',
                backdrop: false,
                showConfirmButton: false,
                toast: true,
                timer: 3000,
                showClass: {
                    popup: `
                animate__animated
                animate__fadeInDown
              `
                },
                hideClass: {
                    popup: `
                animate__animated
                animate__fadeOutUp
                animate__faster
              `
                },
            });
        } else {
            const transactionSummary = {
                user_id: userData.id,
                paying_method: 'CASHLESS',
                total: total,
                paid_sum: total,
                item: [...items, ...servicesSelected]
            }

            setCookies('transactionSummary', transactionSummary, { path: '/' })
            window.location.href = '/pay'
        }

    }

    useEffect(() => {
        isTodayOpenFetch()
        fetchUserData()
        fetchProduct()
    }, [])

    useEffect(() => {
        var totalPay = 0

        items.forEach(item => {
            console.log(item.price, item.qty)
            totalPay += item.price * item.qty
        })

        servicesSelected.forEach(item => {
            console.log(item.price, item.qty)
            totalPay += item.price * item.qty
            console.log(totalPay)
        })

        console.log('Total Pay:', totalPay)

        setTotal(totalPay)
    }, [servicesSelected, items])

    const handleOnClickServices = (servicesSelected) => {
        if (servicesSelected != services) {
            // if (servicesSelected == 'Cuci' || servicesSelected == 'Kering') {
            //     setServices('Satu')
            // } else if(servicesSelected == 'Komplit') {
            //     setServices(servicesSelected)
            // }

            // if (servicesSelected == 'Komplit') {
            //     if (services == 'Satu') {
            //         setTotal(total - (selectedRadio == 'Cuci' ? cuciPrice : keringPrice) + cuciPrice + keringPrice)
            //     } else {
            //         setTotal(cuciPrice + keringPrice)
            //     }
            // } else if (servicesSelected == 'Satu') {
            //     if (services == 'Komplit') {
            //         setTotal(total - (cuciPrice + keringPrice) + (selectedRadio == 'Cuci' ? cuciPrice : keringPrice))
            //     } else if (services == 'First') {
            //         setTotal(selectedRadio == 'Cuci' ? cuciPrice : keringPrice)
            //     } else {
            //         setTotal(selectedRadio == 'Cuci' ? total - keringPrice + cuciPrice : total - cuciPrice + keringPrice)
            //     }
            // }
        }

        if (servicesSelected == 'Satu') {
            // if (selectedRadio == "Cuci") {
            //     setServicesSelected([{
            //         id: findProductByName('Cuci').id,
            //         product_name: 'Cuci',
            //         price: findProductByName('Cuci').price,
            //         qty: 1
            //     }])
            // } else {
            //     setServicesSelected([{
            //         id: findProductByName('Kering').id,
            //         product_name: 'Kering',
            //         price: findProductByName('Kering').price,
            //         qty: 1
            //     }])
            // }
        } else if (servicesSelected == 'Komplit') {
            setServicesSelected([{
                id: findProductByName('Cuci').id,
                product_name: 'Cuci',
                price: findProductByName('Cuci').price,
                qty: 1
            }, {
                id: findProductByName('Kering').id,
                product_name: 'Kering',
                price: findProductByName('Kering').price,
                qty: 1
            }])
        }

        setServices(servicesSelected)

    }

    const handleRadioServices = (selectedRadio) => {
        console.log(selectedRadio)
        setSelectedRadio(selectedRadio)

        if (selectedRadio == "Cuci") {
            setServicesSelected([{
                id: findProductByName('Cuci').id,
                product_name: 'Cuci',
                price: findProductByName('Cuci').price,
                qty: 1
            }])
        } else {
            setServicesSelected([{
                id: findProductByName('Kering').id,
                product_name: 'Kering',
                price: findProductByName('Kering').price,
                qty: 1
            }])
        }
    }

    if (cookies.__USERTOKEN__ != undefined) {
        if (isLoading) {
            return (
                <div className='h-full bg-white w-full p-5 flex justify-center flex-col items-center gap-5'>
                    <Spinner></Spinner>
                </div>
            )
        } else {
            if (queueStatus.text == 'Antrian Hari Ini Telah Dibuka') {
                if(isLoading){
                    return (
                        <div className='h-full bg-white w-full p-5 flex justify-center flex-col items-center gap-5'>
                            <Spinner></Spinner>
                        </div>
                    )
                }else{
                    return (
                        <section className='min-w-full max-h-auto h-screen bg-blue-400 relative'>
                            <div className='w-full absolute top-0 h-[10%] flex justify-left items-center text-2xl text-white font-bold px-5'>
                                Buat Transaksi
                            </div>
                            <div className='absolute bottom-0 min-h-[90%] max-h-auto bg-white w-full rounded-t-3xl p-5 flex flex-col gap-2'>
                                <h1>Pilih Layanan Sesuai Kebutuhan</h1>
                                <div id='services' className='w-full h-1/5 flex gap-3'>
                                    <div className='w-1/2 h-full'>
                                        <div className={clsx('w-full h-full rounded-2xl p-3 bg-gray-100 hover:bg-gray-200 transition-all duration-500 ease-in-out will-change-transform border-2 border-transparent', services === 'Komplit' ? 'border-blue-500 bg-gray-200' : '')} onClick={() => handleOnClickServices('Komplit')}>
                                            <h1 className='text-lg'>Komplit</h1>
                                            <p className='text-gray-400'>Cuci lalu keringkan</p>
                                            <p className='text-gray-400 mt-2'>{'Rp' + ((findProductByName('Cuci') != null ? findProductByName('Cuci').price : 0) + (findProductByName('Kering') != null ? findProductByName('Kering').price : 0)) + ',00'}</p>
                                        </div>
                                    </div>
                                    <div className='w-1/2 h-full'>
                                        <div className={clsx('w-full h-full rounded-2xl p-3 bg-gray-100 hover:bg-gray-200 transition-all duration-500 ease-in-out will-change-transform border-2 border-transparent', services === 'Satu' ? ' border-blue-500 bg-gray-200' : '')} onClick={() => handleOnClickServices('Satu')}>
                                            <h1 className='text-lg'>Salah Satu</h1>
                                            <p className='text-gray-400'>Cuci / Kering saja</p>
                                            <p className='text-gray-400 mt-2'>{'Rp' + (findProductByName('Cuci') != null ? findProductByName('Cuci').price : 0) + ',00'}</p>
                                        </div>
                                    </div>
    
                                </div>
                                <div className={clsx(services == 'Satu' ? '' : 'hidden')}>
                                    <RadioGroup orientation='horizontal' className='w-full p-2 rounded-xl transition-all duration-500 ease-in-out will-change-transform' value={selectedRadio}>
                                        <Radio value='Cuci' onClick={() => handleRadioServices('Cuci')}>Cuci</Radio>
                                        <Radio value='Kering' onClick={() => handleRadioServices('Kering')}>Kering</Radio>
                                    </RadioGroup>
                                </div>
                                <AdditionalSection total={total} setTotal={setTotal} products={products} items={items} setItems={setItems} />
                                <div className='fixed bottom-20 right-1/2 translate-x-1/2 w-full h-auto px-3 flex gap-2'>
                                    <div className='shadow-md w-full text-center text-xl bg-blue-500 text-white rounded-full p-2 px-5 flex justify-between'>
                                        <div className='font-bold'>
                                            Total
                                        </div>
                                        <div className='flex justify-center items-center gap-2'>
                                            {'Rp' + total + ',00'}
                                        </div>
                                    </div>
                                    <Button className='shadow-md w-auto text-center bg-green-500 text-white rounded-full p-2 px-5 flex justify-center items-center' onClick={handlePayButtonClicked}>
                                        <IoIosArrowDropright size={25} />
                                    </Button>
                                </div>
                            </div>
                        </section>
                    )
                }
            } else {
                return (
                    <div className='w-full h-full flex justify-center items-center bg-white'>
                        {queueStatus.text}
                    </div>
                )
            }

        }
    } else {
        return (
            <div className='h-full bg-white w-full p-5 flex justify-center flex-col items-center gap-5'>
                <div className='text-2xl text-center'>Masuk untuk memulai melakukan transaksi!</div>
                <Link to={'/login'}>
                    <Button color='primary' size='lg'>MASUK</Button>
                </Link>
            </div>
        )
    }
}

export default MakeTransaction