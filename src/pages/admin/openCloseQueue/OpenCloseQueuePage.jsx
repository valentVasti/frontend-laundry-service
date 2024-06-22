import React, { useState } from 'react'
import {
  Button,
  Chip,
  Input,
  Spinner
} from "@nextui-org/react";
import axios from 'axios';
import { BASE_URL } from '../../../server/Url';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import OpenCloseQueueTable from './OpenCloseQueueTable';
import { useStore } from '../../../server/store';
import Swal from 'sweetalert2';
import { useCookies } from 'react-cookie';

const OpenCloseQueuePage = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [cookies, setCookie, removeCookie] = useCookies(['__ADMINTOKEN__']);

  const [isLoading, setIsLoading] = useState(false)
  const isTodayOpened = useStore((state) => state.isTodayOpened)
  const isTodayClosed = useStore((state) => state.isTodayClosed)
  const notifyIsTodayQueue = useStore((state) => state.notifyIsTodayQueue)
  const setNotifyIsTodayQueue = useStore((state) => state.setNotifyIsTodayQueue)
  const [activeMachine, setActiveMachine] = useState([])
  const [thresholdTime, setThresholdTime] = useState(0)
  const [maxTime, setMaxTime] = useState(0)
  const [isLoadingSummary, setIsLoadingSummary] = useState({
    activeMachine: false,
    thresholdTime: false,
    maxTime: false
  })

  const openCloseQueue = async (action) => {
    setIsLoading(true)
    try {
      const response = await axios.get(BASE_URL + "/openCloseQueue/" + action, {
        headers: {
          'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
        },
      });
      console.log('Open Close Queue', response.data.data);
      if (response.data.success) {
        setIsLoading(false)
        setNotifyIsTodayQueue(!notifyIsTodayQueue)
        onClose()
        Swal.fire({
          title: "Antrian hari ini berhasil dibuka!",
          position: 'bottom-right',
          background: 'green',
          color: 'white',
          icon: 'success',
          backdrop: false,
          showConfirmButton: false,
          toast: true,
          timer: 3000,
          showClass: {
            popup: `
        animate__animated
        animate__fadeInRight
      `
          },
          hideClass: {
            popup: `
        animate__animated
        animate__fadeOutRight
        animate__faster
      `
          }
        });
      }
    } catch (error) {
      console.log(error)
      onClose()
      setIsLoading(false)
      Swal.fire({
        title: "Gagal menutup antrian",
        text: error.response.data.message,
        position: 'bottom-right',
        background: 'red',
        color: 'white',
        icon: 'error',
        iconColor: 'white',
        backdrop: false,
        showConfirmButton: false,
        toast: true,
        timer: 3000,
        showClass: {
          popup: `
      animate__animated
      animate__fadeInRight
    `
        },
        hideClass: {
          popup: `
      animate__animated
      animate__fadeOutRight
      animate__faster
    `
        }
      });
    }
  }

  const fetchActiveMachine = async () => {
    setIsLoadingSummary({ ...isLoadingSummary, activeMachine: true })
    try {
      const response = await axios.get(BASE_URL + "/getAllActiveMachine", {
        headers: {
          'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
        },
      });
      setActiveMachine(response.data.data)
      setIsLoadingSummary({ ...isLoadingSummary, activeMachine: false })
    } catch (error) {
      console.log(error)
    }
  }

  const fetchThresholdTime = async () => {
    setIsLoadingSummary({ ...isLoadingSummary, thresholdTime: true })
    try {
      const response = await axios.get(BASE_URL + "/thresholdTime", {
        headers: {
          'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
        },
      });
      setThresholdTime(response.data.data)
      setIsLoadingSummary({ ...isLoadingSummary, thresholdTime: false })
    } catch (error) {
      console.log(error)
    }
  }

  const fetchMaxTime = async () => {
    setIsLoadingSummary({ ...isLoadingSummary, maxTime: true })
    try {
      const response = await axios.get(BASE_URL + "/maxTimeTransaction", {
        headers: {
          'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
        },
      });
      setMaxTime(response.data.data.max_time)
      setIsLoadingSummary({ ...isLoadingSummary, maxTime: false })
    } catch (error) {
      console.log(error)
    }
  }

  const openModal = () => {
    fetchActiveMachine()
    fetchThresholdTime()
    fetchMaxTime()
    onOpen()
  }

  return (
    <div className='flex-col w-full flex gap-2 h-[670px]'>
      <div className='text-2xl font-bold px-3'>OPEN QUEUE LOG</div>
      <div className='w-full h-full p-3 flex flex-col gap-4'>
        <div className='flex h-auto gap-2'>
          <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='Cari log...'>Search</Input>
          <div className='w-2/6 h-full flex justify-center items-center '>
            <Button color='success' className='h-full w-full text-white' radius='lg' onPress={openModal} isDisabled={isTodayOpened}>BUKA ANTRIAN</Button>
          </div>
          <div className='w-2/6 h-full flex justify-center items-center '>
            <Button color='danger' className='h-full w-full text-white' radius='lg' onPress={openModal} isDisabled={!isTodayOpened ? !isTodayOpened : isTodayClosed}>TUTUP ANTRIAN</Button>
          </div>
        </div>
        <div className='w-full h-full'>
          <OpenCloseQueueTable triggerFetch={isLoading} />
        </div>
      </div>
      <Modal aria-label='modal-1' isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">{isTodayOpened ? 'Tutup' : 'Buka'} Antrian Hari Ini</ModalHeader>
              <ModalBody>
                <div className='flex flex-col gap-7 justify-center text-center'>
                  <p className='text-2xl'>{isTodayOpened ? 'Tutup' : 'Buka'} antrian untuk hari ini?</p>
                  {isTodayOpened ?
                    (
                      ''
                    )
                    :
                    (
                      isLoadingSummary.activeMachine || isLoadingSummary.thresholdTime || isLoadingSummary.maxTime ? (<Spinner size='large' />) : (
                        <div className='flex flex-col justify-center items-center border-2 border-black p-3 rounded-xl border-dashed w-full'>
                          <p className='text-xl mb-3 font-bold'>Ringkasan Pembukaan Antrean</p>
                          <h1 className='text-lg'>Mesin Ready To Use</h1>
                          <div className='flex justify-evenly w-full'>
                            <div className='w-3/4 h-auto'>
                              <Chip color='secondary' className='text-base text-white my-2'>PENCUCI</Chip>
                              {activeMachine.map((data) => (
                                data.jenis_mesin == 'PENCUCI' && (
                                  <div key={data.id} className='flex flex-col'>
                                    <div className='flex justify-evenly items-center my-1'>
                                      <div className='flex gap-2'>
                                        <p className='text-base'>{'MESIN'}</p>
                                        <Chip color={data.jenis_mesin == 'PENGERING' ? 'warning' : 'secondary'} className='text-base text-white'>{data.kode_mesin}</Chip>
                                      </div>
                                      <p className='text-base'>{data.durasi_penggunaan + "'"}</p>
                                    </div>
                                  </div>
                                )
                              ))}
                            </div>
                            <div className='w-3/4 h-auto'>
                              <Chip color='warning' className='text-base text-white my-2'>PENGERING</Chip>
                              {activeMachine.map((data) => (
                                data.jenis_mesin == 'PENGERING' && (
                                  <div key={data.id} className='flex flex-col'>
                                    <div className='flex justify-evenly items-center my-1'>
                                      <div className='flex gap-2'>
                                        <p className='text-base'>{'MESIN'}</p>
                                        <Chip color={data.jenis_mesin == 'PENGERING' ? 'warning' : 'secondary'} className='text-base text-white'>{data.kode_mesin}</Chip>
                                      </div>
                                      <p className='text-base'>{data.durasi_penggunaan + "'"}</p>
                                    </div>
                                  </div>
                                )
                              ))}
                            </div>
                          </div>
                          <div className='my-2'>
                            <h1 className='text-lg my-1'>Batas Kedatangan Konsumen</h1>
                            <Chip color='danger'>{thresholdTime.threshold_time + ' menit'}</Chip>
                          </div>
                          <div className='my-2'>
                            <h1 className='text-lg my-1'>Maksimal Jam Transaksi</h1>
                            <Chip color='danger'>{maxTime}</Chip>
                          </div>
                        </div>
                      )
                    )
                  }
                </div>
              </ModalBody>
              <ModalFooter className='flex flex-col'>
                <Button fullWidth size='lg' color='primary' isLoading={isLoading} onPress={() => { openCloseQueue(isTodayOpened ? 'close' : 'open') }}>
                  {isTodayOpened ? 'Tutup' : 'Buka'} Antrian
                </Button>
                <Button fullWidth size='sm' variant='bordered' color='danger' className='text-md'>
                  Batal
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default OpenCloseQueuePage