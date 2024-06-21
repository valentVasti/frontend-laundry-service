
import { Button, Input, TimeInput } from '@nextui-org/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { BASE_URL } from '../../../server/Url'
import toaster, { Toaster } from 'react-hot-toast'
import { parseAbsoluteToLocal, Time, ZonedDateTime, parseTime } from '@internationalized/date'

const GeneralSettingPage = () => {
    const [thresholdTime, setThresholdTime] = useState(0)
    const [cookies] = useCookies(['__ADMINTOKEN__'])
    const [isDisabledThreshold, setIsDisabledThreshold] = useState(true)
    const [isDisabledMaxTime, setIsDisabledMaxTime] = useState(true)
    const [buttonIsDisabledThreshold, setButtonIsDisabledThreshold] = useState(true)
    const [buttonIsDisabledMaxTime, setButtonIsDisabledMaxTime] = useState(true)
    const [isLoadingThreshold, setIsLoadingThreshold] = useState(false)
    const [isLoadingMaxTime, setIsLoadingMaxTime] = useState(false)
    const [maxTime, setMaxTime] = useState(parseTime("00:00:00"));

    const fetchThresholdTime = async () => {
        try {
            const response = await axios.get(BASE_URL + "/thresholdTime", {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                },
            });
            setThresholdTime(response.data.data.threshold_time);
            setIsDisabledThreshold(false)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchMaxTime = async () => {
        try {
            const response = await axios.get(BASE_URL + "/maxTimeTransaction", {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                },
            });
            setMaxTime(parseTime(response.data.data.max_time));
            setIsDisabledMaxTime(false)
        } catch (error) {
            console.log(error)
        }
    }

    const updateThresholdTime = async () => {
        setIsLoadingThreshold(true)
        try {
            const response = await axios.put(BASE_URL + "/thresholdTime", {
                threshold_time: thresholdTime
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                },
            });
            if (response.data.success) {
                fetchThresholdTime()
                setButtonIsDisabledThreshold(true)
                setIsLoadingThreshold(false)
                toaster.success('Threshold Time Successfully Updated!')
            }
        } catch (error) {
            setButtonIsDisabledThreshold(true)
            setIsLoadingThreshold(false)
            toaster.error('Threshold Time Update Fail!')
        }
    }

    const udpateMaxTime = async () => {
        setIsLoadingMaxTime(true)
        try {
            const response = await axios.put(BASE_URL + "/maxTimeTransaction", {
                max_time: maxTime.hour + ':' + maxTime.minute + ':' + maxTime.second
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                },
            });
            if (response.data.success) {
                fetchMaxTime()
                setButtonIsDisabledMaxTime(true)
                setIsLoadingMaxTime(false)
                toaster.success('Max Time Successfully Updated!')
            }
        } catch (error) {
            setButtonIsDisabledMaxTime(true)
            setIsLoadingMaxTime(false)
            toaster.error('Max Time Update Fail!')
        }

    }

    useEffect(() => {
        fetchThresholdTime()
        fetchMaxTime()
    }, [])

    // useEffect(() => {
    //     console.log(maxTime)
    //     setButtonIsDisabledMaxTime(false)
    // }, [maxTime])

    const handleThresholdTimeInput = (e) => {
        console.log(e.target.value)
        setButtonIsDisabledThreshold(false)
        setThresholdTime(e.target.value)
    }

    return (
        <div className='space-y-8'>
            <h1 className='text-2xl font-bold mb-5'>SETTINGS</h1>
            <div className='flex flex-col gap-4 w-[500px]'>
                <div className='space-y-1'>
                    <h1>Batas Kedatangan</h1>
                    <p className='italic text-sm text-gray-500'>*Maksimal kedatangan pelanggan yang melakukan transaksi online (menit)</p>
                </div>
                <div className='flex gap-4 h-12'>
                    <Input className='w-3/5' size='lg' type='number' value={thresholdTime} isDisabled={isDisabledThreshold} onChange={handleThresholdTimeInput} />
                    <Button color='primary' className='w-2/5 h-full' isDisabled={buttonIsDisabledThreshold} onPress={updateThresholdTime} isLoading={isLoadingThreshold}>Simpan</Button>
                </div>
            </div>
            <div className='flex flex-col gap-4 w-[500px]'>
                <div className='space-y-1'>
                    <h1>Maksimum Jam Transaksi</h1>
                    <p className='italic text-sm text-gray-500'>*Jam maksimal transaksi dapat dilakukan setiap hari (24h)</p>
                </div>
                <div className='flex gap-4 h-12'>
                    <TimeInput label={null} isDisabled={isDisabledMaxTime} hourCycle={24} value={maxTime} className='w-3/5' size='lg' onChange={setMaxTime} onKeyUp={() => setButtonIsDisabledMaxTime(false)} />
                    <Button color='primary' className='w-2/5 h-full' isDisabled={buttonIsDisabledMaxTime} onPress={udpateMaxTime} isLoading={isLoadingMaxTime}>Simpan</Button>
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default GeneralSettingPage