import React from 'react'
import MenuBottom from './layout/MenuBottom'
import { Outlet } from 'react-router-dom'

const UserRoot = () => {
    return (
        <section className='w-screen h-screen md:bg-gray-100'>
            <div className='fixed top-0 w-full md:w-[500px] overflow-y-scroll left-1/2 -translate-x-1/2 md:overflow-x-hidden' style={{height: 'calc(100vh - 4rem)'}}>
                <Outlet />
            </div>
            <div className='fixed bottom-0 w-full md:w-[500px] left-1/2 -translate-x-1/2'>
                <MenuBottom />
            </div>
        </section>
    )
}

export default UserRoot