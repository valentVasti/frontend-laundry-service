import React, { useState } from 'react'
import {
    Button,
    Input
} from "@nextui-org/react";
import axios from 'axios';
import { BASE_URL } from '../../../server/Url';
import { IoIosAddCircle } from "react-icons/io";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import Swal from 'sweetalert2';
import { useCookies } from 'react-cookie';
import KaryawanTable from './KaryawanTable';

const KaryawanPage = () => {
    const [cookies] = useCookies(['__ADMINTOKEN__']);

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [refresh, setRefresh] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNum, setPhoneNum] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState('')

    const handleOnInputName = (e) => {
        setName(e.target.value)
    }

    const handleOnInputEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleOnInputPhoneNum = (e) => {
        setPhoneNum(e.target.value)
    }

    const handleAddKaryawan = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(BASE_URL + "/user", {
                name: name,
                email: email,
                password: 'password',
                phone_num: phoneNum,
                role: 'KARYAWAN'
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                }
            });
            console.log(response.data);
            setRefresh(!refresh)
            onClose()
            Swal.fire({
                title: "Karyawan added successfully!",
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
                title: "Failed to add karyawan!",
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

    const searchKaryawan = (e) => {
        setSearch(e.target.value)
    }

    return (
        <div className='flex-col w-full flex gap-2 h-[670px]'>
            <div className='text-2xl font-bold px-3'>DATA KARYAWAN</div>
            <div className='w-full h-full p-3 flex flex-col gap-4'>
                <div className='flex h-auto gap-2'>
                    <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='Cari karyawan...' onChange={searchKaryawan}>Search</Input>
                    <div className='w-1/6 h-full flex justify-center items-center '>
                        <Button color='primary' className='h-full' radius='lg' onPress={onOpen}><IoIosAddCircle size={20} />TAMBAH KARYAWAN</Button>
                    </div>
                </div>
                <div className='w-full h-full'>
                    <KaryawanTable refresh={refresh} search={search} />
                </div>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Tambah Data Karyawan</ModalHeader>
                            <ModalBody>
                                <div className='flex flex-col gap-7'>
                                    <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='Nama karyawan...' label="Nama Karyawan" labelPlacement='outside' onChange={handleOnInputName}></Input>
                                    <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='example@email.com' label="Email Karyawan" labelPlacement='outside' onChange={handleOnInputEmail}></Input>
                                    <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='08XXXXXXX' type='number' label="Nomor Telepon Karyawan" labelPlacement='outside' onChange={handleOnInputPhoneNum}></Input>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button fullWidth color='primary' onClick={handleAddKaryawan} isLoading={isLoading}>
                                    Tambah Karyawan
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default KaryawanPage