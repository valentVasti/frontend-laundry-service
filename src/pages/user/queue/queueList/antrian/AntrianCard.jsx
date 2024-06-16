import { Chip } from '@nextui-org/react'
import clsx from 'clsx'
import React from 'react'

const AntrianCard = ({ data }) => {
  console.log(data)
  const queueStatus = () => {

    if (data.transaction.transaction_token == null) {
      return 'bg-green-500'
    } else if (data.transaction.transaction_token.is_used) {
      return 'bg-green-500'
    } else if (data.transaction.transaction_token.is_used == false) {
      return 'bg-yellow-500'
    }

  }

  return (
    <section className='bg-slate-200 shadow-md shadow-gray-100 h-auto rounded-xl relative flex overflow-hidden'>
      <div id='card-header' className='text-center top-0 w-1/3 py-2 flex items-center justify-center gap-2 bg-slate-300'>
        <h1>{"MESIN "}</h1>
        <Chip className='text-white' color={data.today_queue.mesin.jenis_mesin == 'PENCUCI' ? 'secondary' : 'warning'}>{data.today_queue.mesin.kode_mesin}</Chip>
      </div>
      <div id='card-body' className='text-center w-2/3 text-2xl flex justify-center items-center py-2'>
        <div className=' bg-blue-600 text-white h-8 min-w-8 max-w-fit rounded-lg flex justify-center px-1'>
          {data.nomor_antrian}
        </div>
      </div>
      <div className={clsx('absolute top-0 right-0 size-6 rounded-bl-xl', queueStatus())}></div>
    </section>
  )
}

export default AntrianCard