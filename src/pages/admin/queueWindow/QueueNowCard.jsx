import clsx from 'clsx'
import React from 'react'
import { FaArrowAltCircleRight } from 'react-icons/fa'

const QueueNowCard = ({ data }) => {
    const flagKedatangan = () => {
        if (data.transaction == null) {
            return 'bg-gray-500'
        } else if (data.transaction.transaction_token == null) {
            return 'bg-green-500'
        } else if (data.transaction.transaction_token.is_used == 0) {
            return 'bg-yellow-500'
        } else if (data.transaction.transaction_token.is_used == 1) {
            return 'bg-green-500'
        } else {
            return 'bg-gray-500'
        }
    }

    return (
        <div key={data.id} className='w-full h-[50px] flex relative'>
            <div className='w-2/5 h-full bg-white flex justify-center items-center text-2xl rounded-xl'>{data.nomor_antrian}</div>
            <div className='w-1/5 h-full bg-transparent flex justify-center items-center'><FaArrowAltCircleRight size={30} /></div>
            <div className='w-2/5 h-full bg-white flex justify-center items-center text-2xl font-bold rounded-xl'>{data.today_queue.mesin.kode_mesin}</div>
            <div className={clsx('absolute top-1/2 -translate-y-1/2 left-0 w-4 h-8 text-xs rounded-r-xl text-center py-2 ', flagKedatangan())}></div>
        </div>
    )
}

export default QueueNowCard