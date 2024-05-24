import React from 'react'
import { useState, useEffect } from 'react';
import { useStore } from '../../../server/store';
import { BASE_URL } from '../../../server/Url';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const TimeLeft = ({ data }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['__ADMINTOKEN__']);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const setNotifyQueueDone = useStore((state) => state.setNotifyQueueDone);

    // const notifyNextOrDone = async () => {
    //     try {
    //         const response = await axios.get(BASE_URL + '/nextOrDoneQueue/' + data.id, {
    //             headers: {
    //                 'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
    //             },
    //         });
    //         console.log('notifyNextOrDone response: ', response.data)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const calculateTimeLeft = () => {
        const created_at = data.nomor_antrian != 0 ? data['updated_at'] : '--';
        const startTimeString = new Date(created_at).toTimeString().split(' ')[0]

        let [hours, minutes, seconds] = startTimeString.split(":").map(Number);
        let startTimeDate = new Date();

        startTimeDate.setHours(hours, minutes, seconds);
        const endDate = new Date(startTimeDate.getTime() + data.mesin.durasi_penggunaan * 60000);
        const difference = endDate - new Date();
        let timeLeft = {};

        // TODO pikirin cara dia update otomatis kalo timeleft nya negatif
        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        } else if (difference == 0) {
            // notifyNextOrDone()
            console.log('time is up')
        } else {
            timeLeft = {
                hours: 0,
                minutes: 0,
                seconds: 0
            }
        }

        return timeLeft
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft);
        }, 1000);

        return () => clearInterval(timer);

    }, [data]);

    return (
        <div>{`${timeLeft.minutes != 0 && !isNaN(timeLeft.minutes) == true ? timeLeft.minutes : '--'} : ${timeLeft.seconds != 0 && !isNaN(timeLeft.seconds) == true ? timeLeft.seconds : '--'}`}</div>
    )
}

export default TimeLeft