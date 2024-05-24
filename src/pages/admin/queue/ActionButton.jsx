import { Button } from '@nextui-org/react';
import React, { useEffect, useRef, useState } from 'react'
import { BASE_URL } from '../../../server/Url';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const ActionButton = ({ id, transaction }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['__ADMINTOKEN__']);
    const [isLoading, setIsLoading] = useState(true)
    const [action, setAction] = useState({
        text: '',
        color: 'default',
        url: ''
    })
    const actionRef = useRef(action)

    actionRef.current = action
    // console.log('actionRef.current '+ id +': ', actionRef.current)

    const checkServices = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(BASE_URL + '/isServicesComplete/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                },
            });
            if (response.data.success) {
                console.log('checking queue ' + id + ' service complete')
                let url = ''
                switch (response.data.data.action) {
                    case "Lanjutkan":
                        url = '/nextActionQueue/' + id + '/next'
                        break;

                    case "Selesai":
                        url = '/nextActionQueue/' + id + '/done'
                        break;

                    default:
                        break;
                }
                setAction({
                    text: response.data.data.action,
                    color: response.data.data.color,
                    url: url
                })
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // TODO masi belum perfect soal otomatis, cek lagi
    // TODO dikit lagi coba tes kalo banyak antrian
    const handleButtonClick = async () => {
        console.log('inside handleButtonClick, it only run once when it clicked or pusher listen')
        let url = ''
        if(action.url != ''){
            url = action.url
        }else{
            url = actionRef.current.url
        }

        if (url != '') {
            console.log('run fetching...')
            try {
                const response = await axios.get(BASE_URL + url, {
                    headers: {
                        'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                    },
                });
                console.log(response.data)
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        console.log('checking queue ' + id + ' services...')
        checkServices()
    }, [transaction])

    // useEffect(() => {
    //     let eventHandled = false
    //     console.log('queue-'+ id +' subscribing to pusher queue...')
    //     // pusher listener
    //     const channel = pusher.subscribe('queue-' + id);
    //     channel.bind(eventName.notifyNextOrDoneQueue, function () {
    //         if(!eventHandled){
    //             console.log('notify next or done queue with id ' + id + ' received', actionRef.current)
    //             // handleButtonClick()
    //             eventHandled = true
    //         }
    //     });

    //     return () => {
    //         console.log('unsubscribing queue-' + id + ' channel')
    //         channel.unbind(eventName.notifyNextOrDoneQueue);
    //         pusher.unsubscribe('queue-' + id);
    //       };
    // }, [transaction])

    return (
        <Button size='sm' color={action.color} className={action.color == 'default' ? '' : 'text-white'} isLoading={isLoading} onPress={handleButtonClick}>{action.text == "" && !isLoading ? "--" : action.text}</Button>
    )

}

export default ActionButton