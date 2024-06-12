import React from 'react'
import { Button } from "@nextui-org/react";
import { IoMdOpen } from "react-icons/io";
import QueueTodayTable from './QueueTodayTable.jsx';
import { Chip } from "@nextui-org/react";
import { Link } from 'react-router-dom';
import { useStore } from '../../../server/store.jsx';

const QueueManagementPage = () => {
    const isTodayOpened = useStore((state) => state.isTodayOpened)
    const isTodayClosed = useStore((state) => state.isTodayClosed)

    return (
        <div className="w-full space-y-6 h-auto">
            <Link to="/admin/queueWindow" target='_blank'>
                <Button fullWidth className="text-md w-full" color='primary' isDisabled={!(isTodayOpened && !isTodayClosed)}>
                    Open Queue Window <IoMdOpen />
                </Button>
            </Link>
            <div className='flex gap-5'>
                <div className='space-y-3 w-full'>
                    <Chip size='lg' color='warning' className='text-white'>Antrian Hari Ini</Chip>
                    <QueueTodayTable status={'IDLE'} />
                </div>
                <div className='space-y-3 w-full'>
                    <Chip size='lg' color='secondary' className='text-white'>Diantrikan</Chip>
                    <QueueTodayTable status={'QUEUED'} />
                </div>
            </div>
            <div className='flex gap-5'>
                <div className='space-y-3 w-full'>
                    <Chip size='lg' color='success' className='text-white'>Antrian Selesai</Chip>
                    <QueueTodayTable status={'DONE'} />
                </div>
                <div className='space-y-3 w-full'>
                    <Chip size='lg' color='danger' className='text-white'>Antrian Gagal</Chip>
                    <QueueTodayTable status={'FAILED'} />
                </div>
            </div>
        </div>
    )
}

export default QueueManagementPage