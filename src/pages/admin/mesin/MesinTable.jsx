import React from 'react'
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

const MesinTable = ({ refresh }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['__ADMINTOKEN__']);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [items, setItems] = useState([])
    const [idMesin, setIdMesin] = useState('')
    const [kodeMesin, setKodeMesin] = useState('')
    const [kodeMesinTitle, setKodeMesinTitle] = useState('--')
    const [jenisMesin, setJenisMesin] = useState('')
    const [identifier, setIdentifier] = useState('')
    const [durasiPenggunaan, setDurasiPenggunaan] = useState('')
    const [isDisabled, setIsDisabled] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [modalAction, setModalAction] = useState('edit')

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

    const fetchMesinById = async (id) => {
        try {
            const response = await axios.get(BASE_URL + "/mesin/" + id, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                },
            });
            console.log(response.data.data);
            setIdMesin(response.data.data.id)
            setKodeMesinTitle(response.data.data.kode_mesin)
            setKodeMesin(response.data.data.kode_mesin)
            setJenisMesin(response.data.data.jenis_mesin)
            setIdentifier(response.data.data.identifier)
            setDurasiPenggunaan(response.data.data.durasi_penggunaan)
            setIsDisabled(false)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchMesin = async () => {
        console.log(cookies.__ADMINTOKEN__)
        try {
            const response = await axios.get(BASE_URL + "/mesin", {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                },
            });
            console.log(response.data.data);
            setItems(response.data.data);
        } catch (error) {
            console.log(error)
        }
    }

    const handleEditMachine = async (id) => {
        setIsLoading(true)
        try {
            const response = await axios.put(BASE_URL + "/mesin/" + id, {
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
            fetchMesin()
            onClose()
            setIsLoading(false)
            clearState()
            Swal.fire({
                title: "Mesin updated successfully!",
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
                title: "Machine failed to updated!",
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

    const handleDeleteMachine = async (id) => {
        setIsLoading(true)
        try {
            const response = await axios.delete(BASE_URL + "/mesin/" + id,
                {
                    headers: {
                        'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                    }
                });
            console.log(response.data);
            fetchMesin()
            onClose()
            setIsLoading(false)
            clearState()
            Swal.fire({
                title: "Mesin deleted successfully!",
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
                title: "Machine failed to delete!",
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

    useLayoutEffect(() => {
        fetchMesin()
    }, [refresh])

    // table header
    const columns = [
        {
            key: "kode_mesin",
            label: "KODE MESIN",
        },
        {
            key: "jenis_mesin",
            label: "JENIS MESIN",
        },
        {
            key: "identifier",
            label: "IDENTIFIER",
        },
        {
            key: "durasi_penggunaan",
            label: "DURASI PENGGUNAAN (MENIT)",
        },
        {
            key: "status_maintenance",
            label: "STATUS",
        },
        {
            key: "action",
            label: "AKSI",
        }
    ];

    const setMesinStatus = async (id, status) => {
        try {
            const response = await axios.get(BASE_URL + `/mesin/${id}/${status}`, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                },
            });

            if (response.data.success) {
                fetchMesin()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const openModal = (id, action) => {
        fetchMesinById(id)

        if (action == 'delete') {
            setModalAction('delete')
        } else {
            setModalAction('edit')
        }
        onOpen()

    }

    const clearState = () => {
        setKodeMesinTitle('--')
        setKodeMesin('')
        setJenisMesin('')
        setIdentifier('')
        setDurasiPenggunaan('')
        setIsDisabled(true)
    }

    // custom column
    const renderCell = useCallback((item, columnKey) => {
        const cellValue = getKeyValue(item, columnKey);

        switch (columnKey) {
            case "status_maintenance":
                const color = cellValue ? "warning" : "success";
                const text = cellValue ? "Maintenance" : "Ready to use";
                return (
                    <Dropdown aria-label='status_dropdown'>
                        <DropdownTrigger>
                            <Chip color={color} className='text-white min-w-28 text-center' endContent={<div className='size-5 rounded-full bg-white flex justify-center items-center'><IoIosArrowDown color='black' /></div>}>
                                <p className='me-2'>{text}</p>
                            </Chip>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Single selection example"
                            variant="flat"
                            disallowEmptySelection
                        >
                            <DropdownItem key="readyToUse" startContent={<FaRegDotCircle size={20} color='green' />} onPress={() => setMesinStatus(item.id, 0)}>
                                READY TO USE
                            </DropdownItem>
                            <DropdownItem key="maintenance" startContent={<FaRegDotCircle size={20} color='orange' />} onPress={() => setMesinStatus(item.id, 1)}>
                                MAINTENANCE
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
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
                <TableBody items={items} emptyContent="Tidak ada mesin terdaftar!">
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell className={columnKey === "durasi_penggunaan" || columnKey === "kode_mesin" || columnKey === "status_maintenance" ? 'text-center' : ''}>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Modal aria-label='edit-modal' isOpen={isOpen} onOpenChange={onOpenChange} onClose={clearState}>
                <ModalContent>
                    {() => modalAction == 'edit' ? (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{'Edit Data Mesin ' + kodeMesinTitle}</ModalHeader>
                            <ModalBody>
                                <div className='flex flex-col gap-7'>
                                    <RadioGroup
                                        label="Pilih jenis mesin"
                                        orientation="horizontal"
                                        value={jenisMesin}
                                        onChange={handleOnInputJenisMesin}
                                    >
                                        <Radio value="PENGERING">Pengering</Radio>
                                        <Radio value="PENCUCI">Pencuci</Radio>
                                    </RadioGroup>
                                    <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='P/C' label="Kode Mesin" labelPlacement='outside' value={kodeMesin} onChange={handleOnInputKodeMesin} isDisabled={isDisabled}></Input>
                                    <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='Nomor seri, kode mesin, ...' label="Identifier Mesin" labelPlacement='outside' value={identifier} onChange={handleOnInputIdentifier} isDisabled={isDisabled}></Input>
                                    <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='Durasi penggunaan (menit)' type='number' label="Durasi Penggunaan" labelPlacement='outside' value={durasiPenggunaan} onChange={handleOnInputDurasiPenggunaan} isDisabled={isDisabled}></Input>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button fullWidth color='primary' onPress={() => handleEditMachine(idMesin)} isLoading={isLoading} isDisabled={isDisabled}>
                                    Edit Mesin
                                </Button>
                            </ModalFooter>
                        </>
                    ) : (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{'Hapus Data Mesin ' + kodeMesinTitle}</ModalHeader>
                            <ModalBody>
                                <p>Apakah anda yakin ingin menghapus data mesin ini?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button fullWidth color='danger' onPress={() => handleDeleteMachine(idMesin)} isLoading={isLoading} isDisabled={isDisabled}>
                                    Hapus Mesin
                                </Button>
                            </ModalFooter>
                        </>

                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default MesinTable