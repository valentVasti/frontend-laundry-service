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
import { BASE_URL } from '../../../server/Url';
import axios from 'axios';
import ActionButton from './ActionButton';
import TimeLeft from './TimeLeft';
import { eventName, pusher } from '../../../server/pusherService';
import { useCookies } from 'react-cookie';

const QueueTodayTable = ({ status }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['__ADMINTOKEN__']);
    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    let url
    let columns

    switch (status) {
        case 'IDLE':
            url = '/queue'
            columns = [
                {
                    key: "nomor_antrian",
                    label: "NOMOR ANTRIAN",
                },
                {
                    key: "kode_mesin",
                    label: "KODE MESIN",
                },
                {
                    key: "layanan",
                    label: "LAYANAN",
                },
                {
                    key: "sisa_waktu",
                    label: "SISA WAKTU",
                },
                {
                    key: "transaction",
                    label: "STATUS KEDATANGAN",
                }
                // {
                //     key: "action",
                //     label: "AKSI",
                // }
            ];
            break;

        case 'QUEUED':
            url = '/getQueuedQueue'
            columns = [
                {
                    key: "nomor_antrian",
                    label: "NOMOR ANTRIAN",
                },
                {
                    key: "kode_mesin",
                    label: "KODE MESIN",
                },
                {
                    key: "layanan",
                    label: "LAYANAN",
                },
                {
                    key: "transaction",
                    label: "STATUS KEDATANGAN",
                }
            ];
            break;

        case 'DONE':
            url = '/getDoneQueue'
            columns = [
                {
                    key: "id_transaction",
                    label: "ID TRANSAKSI",
                },
                {
                    key: "nomor_antrian",
                    label: "NOMOR ANTRIAN",
                },
                {
                    key: "pencuci",
                    label: "KODE PENCUCI",
                },
                {
                    key: "pengering",
                    label: "KODE PENGERING",
                },
                {
                    key: "done_at",
                    label: "WAKTU SELESAI",
                }
            ];
            break;

        case 'FAILED':
            url = '/getFailedQueue'
            columns = [
                {
                    key: "transaction_id",
                    label: "ID TRANSAKSI",
                },
                {
                    key: "nomor_antrian",
                    label: "NOMOR ANTRIAN",
                },
                {
                    key: "failed_at",
                    label: "WAKTU GAGAL",
                }
            ];
            break;

        default:
            url = '/'
            break;
    }

    const fetchQueue = async () => {
        console.log('fetching queue...')
        setIsLoading(true)
        try {
            const response = await axios.get(BASE_URL + url, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                },
            });
            if (response.data.success) {
                console.log(response.data.data)
                setItems(response.data.data);
                setIsLoading(false)
                console.log('fetching queue complete')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const formatDateIntoTime = (dateString) => {
        const date = new Date(dateString);
        const time = date.toLocaleTimeString('en-US', { hour12: false });

        return time;
    }

    useEffect(() => {
        fetchQueue()
    }, [])

    useEffect(() => {
        console.log('subscribing to channel "queue-channel" on ' + status + ' ...')
        // pusher listener
        const channel = pusher.subscribe('queue-channel');
        channel.bind(eventName.notifyNextOrDoneQueue, function () {
            fetchQueue()
        });

        return () => {
            console.log('unsubscribing queue-channel')
            channel.unbind(eventName.notifyNextOrDoneQueue);
            pusher.unsubscribe('queue-channel');
        };
    }, [])

    // custom column
    const renderCell = useCallback((item, columnKey) => {
        const cellValue = getKeyValue(item, columnKey);
        switch (columnKey) {
            case "nomor_antrian":
                return (<h1 className='font-bold'>{cellValue == 0 ? '--' : cellValue}</h1>);

            case "kode_mesin":
                return status === 'IDLE' ? item.mesin.kode_mesin : item.today_queue.mesin.kode_mesin

            // case "action":
            //     return status === 'IDLE' ? (
            //         <ActionButton id={item.id} transaction={item.id_transaction} />
            //     ) : ('')
            case "layanan":
                return status === 'IDLE' ? cellValue : item.today_queue.layanan
            case "sisa_waktu":
                return (<TimeLeft key={item.id_transaction} data={item} />)
            case "pencuci":
                return item.pencuci != null ? item.pencuci.kode_mesin : '--'
            case "pengering":
                return item.pengering != null ? item.pengering.kode_mesin : '--'
            case "done_at":
                return formatDateIntoTime(cellValue)
            case "failed_at":
                return formatDateIntoTime(cellValue)
            case "transaction":
                if (item.transaction == null) {
                    return (<Chip color='default' className='min-w-28'>--</Chip>)
                } else {
                    if (item.transaction.transaction_token == null) {
                        return (<Chip color='success' className='text-white min-w-28'>Sudah Datang</Chip>)
                    } else {
                        return (<Chip color={item.transaction.transaction_token.is_used == 0 ? 'danger' : 'success'} className='text-white min-w-28'>{item.transaction.transaction_token.is_used == 0 ? 'Belum Datang' : 'Sudah Datang'}</Chip>)
                    }
                }
            default:
                return cellValue;
        }
    })

    return (
        <Table selectionMode='single' isStriped aria-label='table'>
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key} width={column.key === "action" || column.key === "nomor_antrian" || column.key === "kode_mesin" || column.key === "layanan" || column.key === "durasi_penggunaan" ? 40 : null} className={column.key === "action" || column.key === "durasi_penggunaan" || column.key === "status_maintenance" || column.key === "sisa_waktu" || column.key === "transaction" ? 'text-center' : null}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={items} emptyContent={isLoading ? "Mendapatkan data antrian..." : status == 'IDLE' ? "Antrian belum dibuka! Buka antrian di menu 'Daily Queue Log'" : "Tidak ada antrian"} isLoading={true}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell className={columnKey === "nomor_antrian" || columnKey === "layanan" || columnKey === "kode_mesin" || columnKey === "sisa_waktu" || columnKey === "transaction" ? 'text-center' : ''}>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default QueueTodayTable