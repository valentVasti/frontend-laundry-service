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
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { useCookies } from 'react-cookie';

const OpenCloseQueueTable = ({triggerFetch}) => {
    const [cookies, setCookie, removeCookie] = useCookies(['__ADMINTOKEN__']);
    const [items, setItems] = useState([])

    const fetchLog = async () => {
        try {
            const response = await axios.get(BASE_URL + "/getAllOpenCloseQueueLog", {
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

    useLayoutEffect(() => {
        fetchLog()
    }, [triggerFetch])

    // table header
    const columns = [
        {
            key: "user_id_opener",
            label: "OPEN BY",
        },
        {
            key: "user_id_closer",
            label: "CLOSED BY",
        },
        {
            key: "opened_at",
            label: "OPENED AT",
        },
        {
            key: "closed_at",
            label: "CLOSED AT",
        }
    ];

    // custom column
    const renderCell = useCallback((item, columnKey) => {
        const cellValue = getKeyValue(item, columnKey);

        switch (columnKey) {
            case "status_maintenance":
                const color = cellValue ? "success" : "warning";
                const text = cellValue ? "Ready to use" : "Maintenance";
                return (
                    <Dropdown>
                        <DropdownTrigger>
                            <Chip color={color} className='text-white min-w-28 text-center'>
                                {text}
                            </Chip>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Single selection example"
                            variant="flat"
                            disallowEmptySelection
                            selectionMode="single"
                        >
                            <DropdownItem key="text" color='success'>READY TO USE</DropdownItem>
                            <DropdownItem key="text" color='warning'>MAINTENANCE</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            case "action":
                return (
                    <div className='flex gap-2'>
                        <Button color='primary' radius='full'><FaEdit size={20} /></Button>
                        <Button color='danger' radius='full' onPress={() => handleDeleteProduct(item.id)}><MdDelete size={20} /></Button>
                    </div>
                );
            default:
                return cellValue;
        }
    })

    return (
        <Table selectionMode='single' isStriped aria-label='open-queue-log-table'>
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key} width={column.key === "action" ? 40 : null} className={column.key === "action" || column.key === "durasi_penggunaan" || column.key === "status_maintenance" ? 'text-center' : null}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={items} emptyContent="Tidak ada queue log terdaftar!">
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell className={columnKey === "durasi_penggunaan" || columnKey === "kode_mesin" || columnKey === "status_maintenance" ? 'text-center' : ''}>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default OpenCloseQueueTable