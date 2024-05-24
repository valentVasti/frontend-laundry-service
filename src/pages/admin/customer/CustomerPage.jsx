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
import CustomerTable from './CustomerTable';

const CustomerPage = () => {
    const [cookies] = useCookies(['__ADMINTOKEN__']);

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [refresh, setRefresh] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNum, setPhoneNum] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleOnInputName = (e) => {
        setName(e.target.value)
    }

    const handleOnInputEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleOnInputPhoneNum = (e) => {
        setPhoneNum(e.target.value)
    }

    const handleAddCustomer = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(BASE_URL + "/user", {
                name: name,
                email: email,
                password: 'password',
                phone_num: phoneNum,
                role: 'KONSUMEN'
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                }
            });
            console.log(response.data);
            setRefresh(!refresh)
            onClose()
            Swal.fire({
                title: "Customer added successfully!",
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
                title: "Failed to add customer!",
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
            <div className='text-2xl font-bold px-3'>DATA CUSTOMER</div>
            <div className='w-full h-full p-3 flex flex-col gap-4'>
                <div className='flex h-[50px] gap-2'>
                    <Input variant='bordered' radius='lg' size='sm' className='w-full h-full' placeholder='Cari customer...'>Search</Input>
                    <div className='w-1/6 h-full flex justify-center items-center '>
                        <Button color='primary' className='h-full' radius='lg' onPress={onOpen}><IoIosAddCircle size={20} />TAMBAH CUSTOMER</Button>
                    </div>
                </div>
                <div className='w-full h-full'>
                    <CustomerTable refresh={refresh} />
                </div>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Tambah Data Customer</ModalHeader>
                            <ModalBody>
                                <div className='flex flex-col gap-7'>
                                    <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='Nama customer...' label="Nama Customer" labelPlacement='outside' onChange={handleOnInputName}></Input>
                                    <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='example@email.com' label="Email Customer" labelPlacement='outside' onChange={handleOnInputEmail}></Input>
                                    <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='08XXXXXXX' type='number' label="Nomor Telepon Customer" labelPlacement='outside' onChange={handleOnInputPhoneNum}></Input>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button fullWidth color='primary' onClick={handleAddCustomer} isLoading={isLoading}>
                                    Tambah Customer
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default CustomerPage