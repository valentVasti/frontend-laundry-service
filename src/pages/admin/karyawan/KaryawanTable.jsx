import React, { useEffect } from 'react'
import { useState, useLayoutEffect, useCallback } from 'react';
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    getKeyValue,
    Button,
    Chip,
} from "@nextui-org/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { BASE_URL } from '../../../server/Url';
import { FaEdit, FaRegDotCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { IoIosArrowDown } from 'react-icons/io';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import { RadioGroup, Radio, Input } from "@nextui-org/react";
import Swal from 'sweetalert2';
import { useCookies } from 'react-cookie';

const KaryawanTable = ({ refresh, search }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['__ADMINTOKEN__']);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [karyawan, setKaryawan] = useState([])
    const [filteredKaryawan, setFilteredKaryawan] = useState([])
    const [idKaryawan, setIdKaryawan] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNum, setPhoneNum] = useState('')
    const [isDisabled, setIsDisabled] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [modalAction, setModalAction] = useState('edit')

    const fetchUserById = async (id) => {
        try {
            const response = await axios.get(BASE_URL + "/user/" + id, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                },
            });
            console.log(response.data.data);
            setName(response.data.data.name)
            setEmail(response.data.data.email)
            setPhoneNum(response.data.data.phone_num)
            setIdKaryawan(response.data.data.id)
            setIsDisabled(false)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchKaryawan = async () => {
        console.log(cookies.__ADMINTOKEN__)
        try {
            const response = await axios.get(BASE_URL + "/user/karyawan/role", {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                },
            });
            console.log(response.data.data);
            setKaryawan(response.data.data);
            setFilteredKaryawan(response.data.data);
        } catch (error) {
            console.log(error)
        }
    }

    const handleEditKaryawan = async (id) => {
        setIsLoading(true)
        try {
            const response = await axios.put(BASE_URL + "/user/" + id, {
                name: kodeMesin,
                email: jenisMesin,
                phone_num: identifier,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                }
            });
            console.log(response.data);
            fetchKaryawan()
            onClose()
            setIsLoading(false)
            clearState()
            Swal.fire({
                title: "Karyawan updated successfully!",
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
              `
                }
            });
        } catch (error) {
            setIsLoading(false)
            const errorMessage = Object.entries(error.response.data.message)
            let message = ''
            errorMessage.forEach(([key, value]) => {
                message += `<li>${value}</li>`
            })
            Swal.fire({
                title: "Karyawan failed to updated!",
                html: message,
                width: 450,
                position: 'bottom-right',
                background: 'red',
                color: 'white',
                icon: 'error',
                iconColor: 'white',
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
              `
                }
            });
            console.log(error)
        }
    }

    const handleDeleteKaryawan = async (id) => {
        setIsLoading(true)
        try {
            const response = await axios.delete(BASE_URL + "/user/" + id,
                {
                    headers: {
                        'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                    }
                });
            fetchKaryawan()
            onClose()
            setIsLoading(false)
            clearState()
            Swal.fire({
                title: "Karyawan deleted successfully!",
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
              `
                }
            });
        } catch (error) {
            clearState()
            setIsLoading(false)
            const errorMessage = Object.entries(error.response.data.message)
            let message = ''
            errorMessage.forEach(([key, value]) => {
                message += `<li>${value}</li>`
            })
            Swal.fire({
                title: "Karyawan failed to delete!",
                html: message,
                width: 450,
                position: 'bottom-right',
                background: 'red',
                color: 'white',
                icon: 'error',
                iconColor: 'white',
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
              `
                }
            });
            console.log(error)
        }
    }

    const handleOnInputName = (e) => {
        setName(e.target.value)
    }

    const handleOnInputEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleOnInputPhoneNum = (e) => {
        setPhoneNum(e.target.value)
    }

    const searchKaryawan = () => {
        if (search != '') {
            const filteredArray = karyawan.filter((item) => {
                return item.name.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase()) || item.phone_num.toLowerCase().includes(search.toLowerCase())
            })

            setFilteredKaryawan(filteredArray);
            console.log(filteredArray)
        } else {
            setFilteredKaryawan(karyawan)
        }
    }

    useEffect(() => {
        fetchKaryawan()
    }, [refresh])

    useEffect(() => {
        searchKaryawan()
    }, [search])

    // table header
    const columns = [
        {
            key: "name",
            label: "NAMA",
        },
        {
            key: "email",
            label: "EMAIL",
        },
        {
            key: "phone_num",
            label: "PHONE NUMBER",
        },
        {
            key: "action",
            label: "AKSI",
        }
    ];

    const openModal = (id, action) => {
        fetchUserById(id)

        if (action == 'delete') {
            setModalAction('delete')
        } else {
            setModalAction('edit')
        }
        onOpen()
    }

    const clearState = () => {
        setName('')
        setEmail('')
        setPhoneNum('')
        setIsDisabled(true)
        setIsLoading(false)
        onClose()
    }

    // custom column
    const renderCell = useCallback((item, columnKey) => {
        const cellValue = getKeyValue(item, columnKey);

        switch (columnKey) {
            case "action":
                return (
                    <div className='flex gap-2'>
                        <Button color='primary' radius='full' onPress={() => openModal(item.id, 'edit')}><FaEdit size={20} /></Button>
                        <Button color='danger' radius='full' onPress={() => openModal(item.id, 'delete')}><MdDelete size={20} /></Button>
                    </div>
                );
            default:
                return cellValue;
        }
    })

    return (
        <>
            <Table selectionMode='single' isStriped>
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key} width={column.key === "action" ? 40 : null} className={column.key === "action" || column.key === "durasi_penggunaan" || column.key === "status_maintenance" ? 'text-center' : null}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={filteredKaryawan} emptyContent="Tidak ada karyawan terdaftar!">
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Modal aria-label='edit-modal' isOpen={isOpen} onOpenChange={onOpenChange} onClose={clearState}>
                <ModalContent>
                    {() => modalAction == 'edit' ? (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{'Edit Data Karyawan'}</ModalHeader>
                            <ModalBody>
                                <div className='flex flex-col gap-7'>
                                    <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='Nama karyawan...' label="Nama Karyawan" labelPlacement='outside' value={name} onChange={handleOnInputName} isDisabled={isDisabled}></Input>
                                    <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='example@email.com' label="Email Karyawan" labelPlacement='outside' value={email} onChange={handleOnInputEmail} isDisabled={true}></Input>
                                    <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='08XXXXXXX' type='number' label="Nomor Telepon Karyawan" labelPlacement='outside' value={phoneNum} onChange={handleOnInputPhoneNum} isDisabled={isDisabled}></Input>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button fullWidth color='primary' onPress={() => handleEditKaryawan(idMesin)} isLoading={isLoading} isDisabled={isDisabled}>
                                    Edit Karyawan
                                </Button>
                            </ModalFooter>
                        </>
                    ) : (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{'Hapus Data Mesin'}</ModalHeader>
                            <ModalBody>
                                <p>Apakah anda yakin ingin menghapus data karyawan dengan nama <span className='font-bold'>{name}</span> ?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button fullWidth color='danger' onPress={() => handleDeleteKaryawan(idMesin)} isLoading={isLoading} isDisabled={isDisabled}>
                                    Hapus Data Karyawan
                                </Button>
                            </ModalFooter>
                        </>

                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default KaryawanTable