import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import { RxDashboard } from "react-icons/rx";
import { GrTransaction } from "react-icons/gr";
import { GoArchive } from "react-icons/go";
import { CgSmartHomeWashMachine } from "react-icons/cg";
import { PiQueue } from "react-icons/pi";
import Sidebar from "./layout/Sidebar";
import Topbar from "./layout/Topbar";
import { IoMdSettings } from "react-icons/io";
import { FaBuildingUser, FaCircleUser, FaRegUser } from "react-icons/fa6";
import { FaHistory, FaUserCog } from "react-icons/fa";
import { useCookies } from "react-cookie";
import { HiOutlineQueueList } from "react-icons/hi2";

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const sidebar = useRef(null);
    const [cookies] = useCookies();

    const toggleSidebar = () => {
        setSidebarOpen(sidebarOpen ? false : true)
        const toggle = sidebarOpen ? "0%" : "20%";
        gsap.to(sidebar.current, {
            duration: 0.5,
            width: toggle,
            ease: 'sine.out'
        });
    };

    useEffect(() => {

        const intervalId = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);

    }, []);

    const options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    };

    // TODO crud product
    // TODO crud mesin
    // TODO transaction table

    let sidebarData = []
    if (cookies.__ROLE__ == 'ADMIN') {
        sidebarData = [
            {
                title: "Queue Management",
                icon: <HiOutlineQueueList />,
                link: "/admin"
            },
            {
                title: "Transaction",
                icon: <GrTransaction />,
                link: "/admin/transaction"
            },
            {
                title: "Transaction History",
                icon: <FaHistory />,
                link: "/admin/transactionHistory"
            },
            {
                title: "Product",
                icon: <GoArchive />,
                link: "/admin/product"
            },
            {
                title: "Mesin",
                icon: <CgSmartHomeWashMachine />,
                link: "/admin/mesin"
            },
            {
                title: "Daily Queue Log",
                icon: <PiQueue />,
                link: "/admin/openCloseQueue"
            },
            {
                title: "Customer",
                icon: <FaCircleUser />,
                link: "/admin/customer"
            },
            {
                title: "Karyawan",
                icon: <FaBuildingUser />,
                link: "/admin/karyawan"
            },
            {
                title: "General Settings",
                icon: <IoMdSettings />,
                link: "/admin/settings"
            },

        ]

    } else if (cookies.__ROLE__ == 'KARYAWAN') {
        sidebarData = [
            {
                title: "Dashboard",
                icon: <RxDashboard />,
                link: "/admin"
            },
            {
                title: "Queue Management",
                icon: <HiOutlineQueueList />,
                link: "/admin"
            },
            {
                title: "Transaction",
                icon: <GrTransaction />,
                link: "/admin/transaction"
            },
            {
                title: "Transaction History",
                icon: <FaHistory />,
                link: "/admin/transaction"
            },
            {
                title: "Product",
                icon: <GoArchive />,
                link: "/admin/product"
            },
            {
                title: "Mesin",
                icon: <CgSmartHomeWashMachine />,
                link: "/admin/mesin"
            },
            {
                title: "Daily Queue Log",
                icon: <PiQueue />,
                link: "/admin/openCloseQueue"
            },
            {
                title: "Customer",
                icon: <FaCircleUser />,
                link: "/admin/openCloseQueue"
            },
            {
                title: "General Settings",
                icon: <IoMdSettings />,
                link: "/admin/settings"
            },

        ]
    }

    return (
        <div className='flex h-screen w-screen overflow-hidden'>
            <Sidebar sidebar={sidebar} sidebarData={sidebarData} />
            <Topbar toggleSidebar={toggleSidebar} dateTime={currentDateTime} options={options} />
        </div>
    )

}

export default AdminLayout