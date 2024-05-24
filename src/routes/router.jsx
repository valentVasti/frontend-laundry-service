import LoginPage from "../pages/admin/LoginPage";
import TransactionPage from "../pages/admin/transaction/TransactionPage";
import TransactionPageUser from "../pages/user/transactionHistory/TransactionPage";
import TransactionWindow from "../pages/admin/transaction/TransactionWindow";
import MesinPage from "../pages/admin/mesin/MesinPage";
import OpenCloseQueuePage from "../pages/admin/openCloseQueue/OpenCloseQueuePage";
import ProductPage from "../pages/admin/product/ProductPage";
import QueueWindow from "../pages/admin/queueWindow/QueueWindow";
import QueuePage from "../pages/user/queue/QueuePage";
import RedirectIfNotAuthenticated from "./RedirectIfNotAuthenticated";
import Root from "../AdminLayout";
import axios from "axios";
import { BASE_URL } from "../server/Url";

import React, { useState } from 'react'
import AdminRoot from "../AdminRoot";
import AdminLayout from "../AdminLayout";
import UserRoot from "../UserRoot";
import UserLayout from "../UserLayout";
import HomePage from "../pages/user/home/HomePage";
import ProfilePage from "../pages/user/profile/ProfilePage";
import { useCookies } from "react-cookie";
import UserLoginRegisterPage from "../pages/user/UserLoginRegisterPage";
import MakeTransaction from "../pages/user/makeTransaction/MakeTransaction";
import PayTransaction from "../pages/user/makeTransaction/PayTransaction";
import GeneralSettingPage from "../pages/admin/generalSetting/GeneralSettingPage";
import KaryawanPage from "../pages/admin/karyawan/KaryawanPage";
import CustomerPage from "../pages/admin/customer/CustomerPage";
import QueueManagementPage from "../pages/admin/queue/QueuePage";
import DashboardPage from "../pages/admin/dashboard/DashboardPage";
import TransactionHistoryPage from "../pages/admin/transactionHistory/TransactionHistoryPage";

const TestTransaction = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['__ADMINTOKEN__']);

    const [posted, setPosted] = useState([]);

    const items = [
        "[{\"id\":2,\"product_name\":\"cuci\",\"price\":10000,\"status\":1,\"created_at\":\"2024-02-29T06:22:30.000000Z\",\"updated_at\":\"2024-02-29T06:22:30.000000Z\",\"qty\":1},{\"id\":3,\"product_name\":\"kering\",\"price\":10000,\"status\":1,\"created_at\":\"2024-02-29T06:22:37.000000Z\",\"updated_at\":\"2024-02-29T06:22:37.000000Z\",\"qty\":1}]",
        "[{\"id\":3,\"product_name\":\"kering\",\"price\":10000,\"status\":1,\"created_at\":\"2024-02-29T06:22:37.000000Z\",\"updated_at\":\"2024-02-29T06:22:37.000000Z\",\"qty\":1}]"
    ];

    const komplit = items[0]
    const kering = items[1]

    const data = [
        {
            "user_id": 4,
            "paying_method": "CASHLESS",
            "total": 20000,
            "paid_sum": 20000,
            "item": (komplit)
        },
        {
            "user_id": 5,
            "paying_method": "CASHLESS",
            "total": 10000,
            "paid_sum": 10000,
            "item": (kering)
        },
        {
            "user_id": 6,
            "paying_method": "CASHLESS",
            "total": 20000,
            "paid_sum": 20000,
            "item": (komplit)
        },
        {
            "user_id": 7,
            "paying_method": "CASHLESS",
            "total": 10000,
            "paid_sum": 10000,
            "item": (kering)
        },
        {
            "user_id": 8,
            "paying_method": "CASHLESS",
            "total": 20000,
            "paid_sum": 20000,
            "item": (komplit)
        },
        {
            "user_id": 9,
            "paying_method": "CASHLESS",
            "total": 10000,
            "paid_sum": 10000,
            "item": (kering)
        },
        {
            "user_id": 10,
            "paying_method": "CASHLESS",
            "total": 20000,
            "paid_sum": 20000,
            "item": (komplit)
        },
        {
            "user_id": 11,
            "paying_method": "CASHLESS",
            "total": 10000,
            "paid_sum": 10000,
            "item": (kering)
        },
        {
            "user_id": 12,
            "paying_method": "CASHLESS",
            "total": 20000,
            "paid_sum": 20000,
            "item": (komplit)
        }
    ];

    const makeTransaction = async (data) => {
        try {
            const response = await axios.post(BASE_URL + "/transaction", data, {
                headers: {
                    Authorization: 'Bearer ' + cookies.__ADMINTOKEN__
                }
            });
            console.log(response.data.success);
            if (response.data.success) {
                setPosted([...posted, response.data.data]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    data.forEach((item, index) => {
        setTimeout(() => {
            makeTransaction(item);
        }, 10000);
    });

    // useEffect(() => {
    //     data.forEach((item, index) => {
    //         setTimeout(() => {
    //             makeTransaction(item);
    //         },  5000);
    //     });
    // }, [])

    return (
        <div className="space-y-3">
            <p className="text-3xl font-bold">Test Transaction</p>
            {posted.map((item, index) => (
                <div key={index} className="bg-blue-600 rounded-full text-white p-2">
                    {index}
                </div>
            ))}
        </div>
    )
}

const routerConfig = [
    {
        path: "/admin",
        element: <AdminRoot />,
        children: [
            {
                path: "",
                element: <RedirectIfNotAuthenticated Component={<AdminLayout />} />, // redirect to login when token is not found
                children: [
                    {
                        path: "",
                        element: <DashboardPage />
                    },
                    {
                        path: "queue",
                        element: <QueueManagementPage />
                    },
                    {
                        path: "transaction",
                        element: <TransactionPage />
                    },
                    {
                        path: "product",
                        element: <ProductPage />
                    },
                    {
                        path: "mesin",
                        element: <MesinPage />
                    },
                    {
                        path: "openCloseQueue",
                        element: <OpenCloseQueuePage />
                    },
                    {
                        path: "settings",
                        element: <GeneralSettingPage />
                    },
                    {
                        path: "karyawan",
                        element: <KaryawanPage />
                    },
                    {
                        path: "customer",
                        element: <CustomerPage />
                    },
                    {
                        path: "transactionHistory",
                        element: <TransactionHistoryPage />
                    }
                ]
            },
            {
                path: "transactionWindow",
                element: <TransactionWindow />
            },
            {
                path: "login",
                element: <LoginPage />
            },
            {
                path: "queueWindow",
                element: <QueueWindow />
            },
            {
                path: "testTransaction",
                element: <TestTransaction />
            }
        ]
    },
    {
        path: "/",
        element: <UserRoot />,
        children: [
            {
                path: "",
                element: <UserLayout />,
                children: [
                    {
                        path: "",
                        element: <HomePage />
                    },
                    {
                        path: "home",
                        element: <HomePage />
                    },
                    {
                        path: "profile",
                        element: <ProfilePage />
                    },
                    {
                        path: "queue",
                        element: <QueuePage />
                    },
                    {
                        path: "transaction",
                        element: <TransactionPageUser />
                    },
                    {
                        path: "makeTransaction",
                        element: <MakeTransaction />
                    }
                ]
            },
            {
                path: "login",
                element: <UserLoginRegisterPage />
            },
            {
                path: "pay",
                element: <PayTransaction />
            }
        ]
    }
]

export default routerConfig;