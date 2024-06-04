import React from 'react'
import { FaArrowAltCircleRight } from 'react-icons/fa'

const QueueNowCard = ({data}) => {
    return (
        <div key={data.id} className='w-full h-[50px] flex'>
            <div className='w-2/5 h-full bg-white flex justify-center items-center text-2xl rounded-xl'>{data.nomor_antrian}</div>
            <div className='w-1/5 h-full bg-transparent flex justify-center items-center'><FaArrowAltCircleRight size={30} /></div>
            <div className='w-2/5 h-full bg-white flex justify-center items-center text-2xl font-bold rounded-xl'>{data.today_queue.mesin.kode_mesin}</div>
        </div>
    )
}

export default QueueNowCard