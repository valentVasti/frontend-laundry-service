import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
} from "@nextui-org/react";
import { DateRangePicker } from "@nextui-org/date-picker";
import TransactionHistoryTable from './TransactionHistoryTable';
import toast, { Toaster } from 'react-hot-toast';

const TransactionHistoryPage = () => {
  const transactionTable = useRef(null)
  const dateRangePicker = useRef(null)
  const [refresh, setRefresh] = useState(false)
  const [dateRange, setDateRange] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChangeDateRange = (e) => {
    console.log(e.start.year, e.end.year)
    const dateRange = {
      startDate: `${e.start.year}-${e.start.month}-${e.start.day}`,
      endDate: `${e.end.year}-${e.end.month}-${e.end.day}`
    }
    setDateRange(dateRange)
  }

  const handleSubmitDateRange = () => {
    if (dateRange.startDate === undefined || dateRange.endDate === undefined) {
      toast.error(<span className='text-center'>Silahkan masukkan tanggal untuk filter transaksi!</span>)
    } else {
      transactionTable.current.filterByDateRange()
    }
  }

  const handleResetFilter = () => {
    transactionTable.current.resetFilter()
  }

  return (
    <div className='flex-col w-full flex gap-2 h-[670px]'>
      <div className='text-2xl font-bold px-3'>TRANSACTION HISTORY</div>
      <div className='w-full h-full p-3 flex flex-col gap-4'>
        <div className='flex h-[50px] gap-2 items-center justify-start'>
          <DateRangePicker classNames={'w-1/4'} label={<p className='font-bold'>Filter By Date</p>} visibleMonths={2} onChange={handleChangeDateRange} labelPlacement='outside-left' />
          <Button color='success' className='text-white' onPress={handleSubmitDateRange}>Submit</Button>
          <Button color='danger' className='text-white' onPress={handleResetFilter}>Reset</Button>
        </div>
        <div className='w-full h-full'>
          <TransactionHistoryTable ref={transactionTable} refresh={refresh} dateRange={dateRange} />
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default TransactionHistoryPage