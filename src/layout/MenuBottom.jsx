import React from 'react'
import { CgNotes, CgProfile } from 'react-icons/cg'
import { FaHome } from 'react-icons/fa'
import { FaCirclePlus } from 'react-icons/fa6'
import { MdLocalLaundryService } from 'react-icons/md'
import clsx from 'clsx'

const MenuBottom = () => {
    const menu = [
        {
            name: 'Home',
            icon: <FaHome />,
            link: '/home'
        },
        {
            name: 'Queue',
            icon: <MdLocalLaundryService />,
            link: '/queue'
        },
        {
            name: 'Make Queue',
            icon: <FaCirclePlus />,
            link: '/makeTransaction'
        },
        {
            name: 'Transaction',
            icon: <CgNotes />,
            link: '/transaction'
        },
        {
            name: 'Profile',
            icon: <CgProfile />,
            link: '/profile'
        },
    ]

    return (
        <nav className='w-full h-16 flex justify-center items-center border-t-2 border-gray-700 bg-white'>
            {menu.map((data) => (
                <a key={data.name} href={data.link} className={clsx('w-1/5 h-full flex flex-col justify-center items-center')}>
                    <div className={clsx('text-2xl ', window.location.pathname === data.link ? 'text-orange-400' : 'text-gray-700')}>
                        {data.icon}
                    </div>
                    <h1 className={clsx('text-xs ', window.location.pathname === data.link ? 'text-orange-400' : 'text-gray-700')}>{data.name}</h1>
                </a>
            ))}
        </nav>
    )
}

export default MenuBottom