import React, { forwardRef, useImperativeHandle } from 'react'
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

const TransactionHistoryTable = forwardRef((props, ref) => {
    const { refresh } = props
    const { dateRange } = props
    const [cookies, setCookie, removeCookie] = useCookies(['__ADMINTOKEN__']);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [transaction, setTransaction] = useState([])
    const [filteredTransaction, setFilteredTransaction] = useState([])
    const [foundTransaction, setFoundTransaction] = useState({
        id: 0,
        user_id: 0,
        karyawan_id: 0,
        paying_method: '',
        total: 0,
        paid_sum: 0,
        change: '',
        transaction_from: '',
        created_at: '',
        updated_at: '',
        user: {},
        karyawan: {},
        detail_transaction: []
    })

    const fetchTransaction = async () => {
        console.log(cookies.__ADMINTOKEN__)
        try {
            const response = await axios.get(BASE_URL + "/transaction", {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                },
            });
            console.log(response.data.data);
            setTransaction(response.data.data);
            setFilteredTransaction(response.data.data);
        } catch (error) {
            console.log(error)
        }
    }

    useLayoutEffect(() => {
        fetchTransaction()
    }, [refresh])

    const formatPrice = (price) => {
        const formattedPrice = price.toLocaleString('id-ID');
        return 'Rp ' + formattedPrice + ',00';
    }

    // table header
    const columns = [
        {
            key: "id",
            label: "#ID",
        },
        {
            key: "pelanggan",
            label: "PELANGGAN",
        },
        {
            key: "karyawan",
            label: "KARYAWAN",
        },
        {
            key: "paying_method",
            label: "METODE PEMBAYARAN",
        },
        {
            key: "total",
            label: "TOTAL HARGA",
        },
        {
            key: "paid_sum",
            label: "JUMLAH BAYAR",
        },
        {
            key: "change",
            label: "KEMBALIAN",
        },
        {
            key: "transaction_from",
            label: "METODE TRANSAKSI",
        },
        {
            key: "created_at",
            label: "TANGGAL TRANSAKSI",
        },
        {
            key: "action",
            label: "AKSI",
        }
    ];


    const openModal = (id) => {
        const foundTransaction = transaction.find((item) => item.id == id);
        console.log(foundTransaction);
        setFoundTransaction(foundTransaction);
        onOpen();
    }

    const formatDate = (dateString) => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const date = new Date(dateString);
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = ("0" + date.getMinutes()).slice(-2);
        const seconds = ("0" + date.getSeconds()).slice(-2);

        return `${date.getDate()}/${date.getMonth() + 1}/${year} ${hours}:${minutes}:${seconds}`;
    }

    const filterByDateRange = () => {
        const start = new Date(dateRange.startDate)
        const end = new Date(dateRange.endDate)

        const filteredTransaction = transaction.filter((item) => {
            const date = new Date(item.created_at)
            console.log(date)
            return date >= start && date <= end
        })

        setFilteredTransaction(filteredTransaction)
    }

    const resetFilter = () => {
        setFilteredTransaction(transaction)
    }

    useImperativeHandle(ref, () => ({
        filterByDateRange,
        resetFilter
    }));

    // custom column
    const renderCell = useCallback((item, columnKey) => {
        const cellValue = getKeyValue(item, columnKey);
        console.log(item)

        switch (columnKey) {
            case "pelanggan":
                return item.user.name
            case "karyawan":
                return item.karyawan.name
            case "created_at":
                return formatDate(cellValue)
            case "action":
                return (
                    <div className='flex gap-2'>
                        <Button color='primary' radius='lg' size="md" onPress={() => openModal(item.id)}>DETAIL</Button>
                    </div>
                );
            case "total":
                return formatPrice(cellValue)
            case "paid_sum":
                return formatPrice(cellValue)
            case "change":
                return formatPrice(cellValue)
            default:
                return cellValue;
        }
    })

    return (
        <>
            <Table selectionMode='single' isStriped>
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key} width={column.key === "action" ? 40 : null} className={column.key === "action" ? 'text-center' : ''}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={filteredTransaction} emptyContent="Tidak ada mesin terdaftar!">
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell className={columnKey == "transaction_from" || columnKey == "paying_method" ? 'text-center' : ''}>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Modal aria-label='edit-modal' isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">{'Detail Transaksi #' + foundTransaction.id}</ModalHeader>
                    <ModalBody>
                        <div className='flex flex-col justify-center items-center gap-2'>
                            {foundTransaction && foundTransaction.detail_transaction.map((item, index) => (
                                <div className='flex w-full justify-between'>
                                    <p className='w-1/3 text-left'>{item.product.product_name}</p>
                                    <p className='w-1/3 text-center'>{item.quantity + 'x'}</p>
                                    <p className='w-1/3 text-right'>{'Rp ' + item.total_price + ',00'}</p>
                                </div>

                            ))}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {/* <Button fullWidth color='primary' onPress={() => handleEditMachine(idMesin)} isLoading={isLoading} isDisabled={isDisabled}>
                            Edit Produk
                        </Button> */}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
})

export default TransactionHistoryTable