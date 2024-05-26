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
    Tooltip
} from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input } from '@nextui-org/react';
import { BASE_URL } from '../../../server/Url';
import { FaEdit, FaQuestion } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useCookies } from 'react-cookie';

const ProductTable = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['__ADMINTOKEN__']);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [productName, setProductName] = useState('')
    const [modalAction, setModalAction] = useState('')
    const [productId, setProductId] = useState('--')
    const [price, setPrice] = useState('')
    const [isDisabled, setIsDisabled] = useState(true)

    const fetchProduct = async () => {
        try {
            const response = await axios.get(BASE_URL + "/product", {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                },
            });
            console.log(response.data.data);
            setProducts(response.data.data);
        } catch (error) {
            console.log(error)
        }
    }

    const fetchProductById = async (id) => {
        try {
            const response = await axios.get(BASE_URL + "/product/" + id, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                },
            });
            setProductId(response.data.data.id);
            setProductName(response.data.data.product_name);
            setPrice(response.data.data.price);
            setIsDisabled(false)
        } catch (error) {
            console.log(error)
        }
    }

    const openModal = (id, action) => {
        fetchProductById(id)
        setModalAction(action)
        onOpen()
    }

    const handleOnInputProductName = (e) => {
        setProductName(e.target.value)
    }

    const handleOnInputPrice = (e) => {
        setPrice(e.target.value)
    }

    const clearState = () => {
        setIsDisabled(true)
        setProductId('--')
        setProductName('')
        setPrice('')
    }

    const handleEditProduct = async () => {
        setIsLoading(true)
        try {
            const response = await axios.put(BASE_URL + "/product/" + productId, {
                product_name: productName,
                price: price
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                }
            })
            console.log(response.data.data)
            fetchProduct()
            onClose()
            clearState()
            setIsLoading(false)
            Swal.fire({
                title: "Product updated successfully!",
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
            console.log(error)
            const errorMessage = Object.entries(error.response.data.message)
            let message = ''
            errorMessage.forEach(([key, value]) => {
                message += `<li>${value}</li>`
            })
            Swal.fire({
                title: "Product failed to updated!",
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
        }
    }

    const handleDeleteProduct = async () => {
        setIsLoading(true)
        try {
            const response = await axios.delete(BASE_URL + "/product/" + productId, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                }
            })
            console.log(response.data.data)
            fetchProduct()
            onClose()
            clearState()
            setIsLoading(false)
            Swal.fire({
                title: "Product deleted successfully!",
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
            console.log(error)
            const errorMessage = Object.entries(error.response.data.message)
            let message = ''
            errorMessage.forEach(([key, value]) => {
                message += `<li>${value}</li>`
            })
            Swal.fire({
                title: "Product failed to deleted!",
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
        }
    }

    useLayoutEffect(() => {
        fetchProduct()
    }, [])


    // table header
    const columns = [
        {
            key: "product_name",
            label: "NAMA PRODUK",
        },
        {
            key: "price",
            label: "HARGA",
        },
        {
            key: "status",
            label: "STATUS",
        },
        {
            key: "action",
            label: "AKSI",
        }
    ];

    // custom column
    const renderCell = useCallback((item, columnKey) => {
        const cellValue = getKeyValue(item, columnKey);

        switch (columnKey) {
            case "status":
                const color = cellValue === 1 ? "success" : "error";
                const text = cellValue === 1 ? "Active" : "Inactive";
                return (
                    <Chip color={color} className='text-white'>
                        {text}
                    </Chip>
                );
            case "action":
                if (item.product_name == 'Cuci' || item.product_name == 'Kering') {
                    return (
                        <div className='flex gap-2 w-full'>
                            <Button color='primary' radius='full' fullWidth onPress={() => openModal(item.id, 'edit')} className='w-full'><FaEdit size={20} /></Button>
                            <Tooltip placement='top' content={<div>Product <span className='font-bold'>Cuci & Kering</span> can't deleted!</div>}>
                                <div className='bg-gray-300 flex justify-center items-center rounded-full w-full'><MdDelete size={20} /></div>
                            </Tooltip>
                        </div>
                    );
                } else {
                    return (
                        <div className='flex gap-2'>
                            <Button color='primary' radius='full' onPress={() => openModal(item.id, 'edit')}><FaEdit size={20} /></Button>
                            <Button color='danger' radius='full' onPress={() => openModal(item.id, 'delete')}><MdDelete size={20} /></Button>
                        </div>
                    );
                }
            default:
                return cellValue;
        }
    })

    return (
        <>
            <Table selectionMode='single' isStriped>
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key} width={column.key === "action" ? 40 : null} className={column.key === "action" ? 'text-center' : null}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={products} emptyContent="Tidak ada produk terdaftar!">
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={clearState}>
                <ModalContent>
                    {() => modalAction === 'edit' ? (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{'Edit Data Produk ' + productName}</ModalHeader>
                            <ModalBody>
                                <div className='flex flex-col gap-7'>
                                    <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='Nama Produk' label="Nama Produk" labelPlacement='outside' value={productName} onInput={handleOnInputProductName} isDisabled={isDisabled}>Nama Produk</Input>
                                    <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='0.00' label="Harga" type='number' labelPlacement='outside' value={price} onInput={handleOnInputPrice} isDisabled={isDisabled}>Harga</Input>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button fullWidth color='primary' isLoading={isLoading} isDisabled={isDisabled} onPress={handleEditProduct}>
                                    Edit Produk
                                </Button>
                            </ModalFooter>
                        </>
                    ) : (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{'Hapus Data Produk'}</ModalHeader>
                            <ModalBody>
                                <p>{'Apakah anda yakin ingin menghapus produk '}<span className='font-bold'>{productName}</span>?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button fullWidth color='danger' isLoading={isLoading} isDisabled={isDisabled} onPress={handleDeleteProduct}>
                                    Hapus Produk
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProductTable