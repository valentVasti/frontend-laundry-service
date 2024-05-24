import React, { useLayoutEffect, useState } from 'react'
import {
  Button,
  Input
} from "@nextui-org/react";
import { RadioGroup, Radio } from "@nextui-org/react";
import axios from 'axios';
import { BASE_URL } from '../../../server/Url';
import { IoIosAddCircle } from "react-icons/io";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import Swal from 'sweetalert2';
import MesinTable from './MesinTable';
import { useCookies } from 'react-cookie';

const MesinPage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['__ADMINTOKEN__']);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [refresh, setRefresh] = useState(false)
  const [kodeMesin, setKodeMesin] = useState('')
  const [jenisMesin, setJenisMesin] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [durasiPenggunaan, setDurasiPenggunaan] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleOnInputKodeMesin = (e) => {
    setKodeMesin(e.target.value)
  }

  const handleOnInputJenisMesin = (e) => {
    setJenisMesin(e.target.value)
  }

  const handleOnInputIdentifier = (e) => {
    setIdentifier(e.target.value)
  }

  const handleOnInputDurasiPenggunaan = (e) => {
    setDurasiPenggunaan(e.target.value)
  }

  const handleAddMachine = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(BASE_URL + "/mesin", {
        kode_mesin: kodeMesin,
        jenis_mesin: jenisMesin,
        identifier: identifier,
        durasi_penggunaan: durasiPenggunaan,
        status_maintenance: false
      }, {
        headers: {
          'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
        }
      });
      console.log(response.data);
      setRefresh(!refresh)
      onClose()
      Swal.fire({
        title: "Mesin added successfully!",
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
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      const errorMessage = Object.entries(error.response.data.message)
      let message = ''
      errorMessage.forEach(([key, value]) => {
        message += `<li>${value}</li>`
      })
      Swal.fire({
        title: "Failed to add machine!",
        html: message,
        width: 450,
        position: 'bottom-right',
        background: 'red',
        color: 'white',
        iconColor: 'white',
        icon: 'error',
        backdrop: false,
        showConfirmButton: false,
        toast: true,
        timer: 5000,
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
      <div className='text-2xl font-bold px-3'>MESIN</div>
      <div className='w-full h-full p-3 flex flex-col gap-4'>
        <div className='flex h-[50px] gap-2'>
          <Input variant='bordered' radius='lg' size='sm' className='w-full h-full' placeholder='Cari mesin...'>Search</Input>
          <div className='w-1/6 h-full flex justify-center items-center '>
            <Button color='primary' className='h-full' radius='lg' onPress={onOpen}><IoIosAddCircle size={20} />TAMBAH MESIN</Button>
          </div>
        </div>
        <div className='w-full h-full'>
          <MesinTable refresh={refresh} />
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Tambah Data Mesin</ModalHeader>
              <ModalBody>
                <div className='flex flex-col gap-7'>
                  <RadioGroup
                    label="Pilih jenis mesin"
                    orientation="horizontal"
                    onChange={handleOnInputJenisMesin}
                  >
                    <Radio value="PENGERING">Pengering</Radio>
                    <Radio value="PENCUCI">Pencuci</Radio>
                  </RadioGroup>
                  <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='P/C' label="Kode Mesin" labelPlacement='outside' onInput={handleOnInputKodeMesin}></Input>
                  <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='Nomor seri, kode mesin, ...' label="Identifier Mesin" labelPlacement='outside' onInput={handleOnInputIdentifier}></Input>
                  <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='Durasi penggunaan (menit)' type='number' label="Durasi Penggunaan" labelPlacement='outside' onInput={handleOnInputDurasiPenggunaan}></Input>

                </div>
              </ModalBody>
              <ModalFooter>
                <Button fullWidth color='primary' onClick={handleAddMachine} isLoading={isLoading}>
                  Tambah Mesin
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default MesinPage