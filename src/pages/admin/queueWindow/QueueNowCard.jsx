import React from 'react'
import { FaArrowAltCircleRight } from 'react-icons/fa'

const QueueNowCard = ({data}) => {
    return (
        <div key={data.id} className='w-full h-[50px] flex'>
            <div className='w-2/5 h-full bg-gray-100 flex justify-center items-center text-xl'>{data.nomor_antrian}</div>
            <div className='w-1/5 h-full bg-transparent flex justify-center items-center'><FaArrowAltCircleRight size={30} /></div>
            <div className='w-2/5 h-full bg-gray-100 flex justify-center items-center'>{data.today_queue.mesin.kode_mesin}</div>
        </div>
    )
}

export default QueueNowCard