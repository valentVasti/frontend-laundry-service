import React, { useState } from 'react'
import {
  Button,
  Input
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

  return (
    <div className='flex-col w-full flex gap-2 h-[670px]'>
      <div className='text-2xl font-bold px-3'>OPEN QUEUE LOG</div>
      <div className='w-full h-full p-3 flex flex-col gap-4'>
        <div className='flex h-[50px] gap-2'>
          <Input variant='bordered' radius='lg' size='sm' className='w-full h-full' placeholder='Cari log...'>Search</Input>
          <div className='w-2/6 h-full flex justify-center items-center '>
            <Button color='success' className='h-full w-full text-white' radius='lg' onPress={onOpen} isDisabled={isTodayOpened}>BUKA ANTRIAN</Button>
          </div>
          <div className='w-2/6 h-full flex justify-center items-center '>
            <Button color='danger' className='h-full w-full text-white' radius='lg' onPress={onOpen} isDisabled={!isTodayOpened ? !isTodayOpened : isTodayClosed}>TUTUP ANTRIAN</Button>
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