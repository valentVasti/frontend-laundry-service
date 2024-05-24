import React, { useState } from 'react'
import { Tabs, Tab, Chip } from "@nextui-org/react";
import PengeringList from './queueList/pengering/PengeringList';
import PencuciList from './queueList/pencuci/PencuciList';
import AntrianList from './queueList/antrian/AntrianList';
import { useStore } from '../../../server/store';

const TabsComponent = ({ selected }) => {

    return (
        <>
            {selected === 'pencuci' && (
                <div className='py-3'>
                    <h1 className='text-xl w-full text-center mb-2'>Mesin Cuci Hari Ini</h1>
                    <div className='flex justify-start items-center gap-2 px-3 my-3 flex-wrap'>
                        <h1>Ket.</h1>
                        <Chip color='secondary' className='text-white'>
                            Kode Mesin
                        </Chip>
                        <Chip color='primary' className='w-full'>
                            Nomor Antrian Berjalan
                        </Chip>
                    </div>
                    <div className='flex justify-start items-center gap-2 px-3 my-3 flex-wrap'>
                        <div className='flex justify-center items-center gap-1'>
                            <div className=' bg-green-500 text-white rounded-full size-3'>
                            </div>
                            <h1>Siap Digunakan</h1>
                        </div>
                        <div className='flex justify-center items-center gap-1'>
                            <div className=' bg-red-500 text-white rounded-full size-3'>
                            </div>
                            <h1>Sedang Digunakan</h1>
                        </div>
                    </div>
                    <PencuciList />
                </div>)}
            {selected === 'pengering' && (
                <div className='py-3'>
                    <h1 className='text-xl w-full text-center mb-2'>Mesin Pengering Hari Ini</h1>
                    <div className='flex justify-start items-center gap-2 px-3 my-3 flex-wrap'>
                        <h1>Ket.</h1>
                        <Chip color='warning' className='text-white'>
                            Kode Mesin
                        </Chip>
                        <Chip color='primary' className='w-full'>
                            Nomor Antrian Berjalan
                        </Chip>
                    </div>
                    <div className='flex justify-start items-center gap-2 px-3 my-3 flex-wrap'>
                        <div className='flex justify-center items-center gap-1'>
                            <div className=' bg-green-500 text-white rounded-full size-3'>
                            </div>
                            <h1>Siap Digunakan</h1>
                        </div>
                        <div className='flex justify-center items-center gap-1'>
                            <div className=' bg-red-500 text-white rounded-full size-3'>
                            </div>
                            <h1>Sedang Digunakan</h1>
                        </div>
                    </div>
                    <PengeringList />
                </div>
            )}
            {selected === 'antrian' && (
                <div className='py-2'>
                    <h1 className='text-xl w-full text-center mb-2'>Antrian Hari Ini</h1>
                    <div className='flex justify-start items-center gap-2 px-3 my-3'>
                        <h1>Ket.</h1>
                        <Chip color='warning' className='text-white'>
                            Pencuci
                        </Chip>
                        <Chip color='secondary' className='w-full'>
                            Pengering
                        </Chip>
                        <Chip color='primary' className='w-full'>
                            Nomor Antrian
                        </Chip>
                    </div>
                    <AntrianList />
                </div>
            )}
        </>
    );
}

const QueuePage = () => {
    const [selectedTab, setSelectedTab] = useState('photos')

    return (
        <section className='relative min-h-full max-h-auto px-3 w-full bg-white'>
            <div className="flex w-full flex-col fixed z-20 bottom-20 right-0 px-4">
                <Tabs aria-label="Options" fullWidth={true} onSelectionChange={(e) => { setSelectedTab(e) }}>
                    <Tab key="pencuci" title="Pencuci"></Tab>
                    <Tab key="pengering" title="Pengering"></Tab>
                    <Tab key="antrian" title="Antrian"></Tab>
                </Tabs>
            </div>
            <TabsComponent selected={selectedTab} />
        </section>
    )
}

export default QueuePage