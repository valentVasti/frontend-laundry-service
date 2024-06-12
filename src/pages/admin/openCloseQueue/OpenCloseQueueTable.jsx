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

const OpenCloseQueueTable = ({ triggerFetch }) => {
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
            case "user_id_opener":
                return item.user_opener.id + ' - ' + item.user_opener.name;
            case "user_id_closer":
                return item.user_closer.id + ' - ' + item.user_closer.name;
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