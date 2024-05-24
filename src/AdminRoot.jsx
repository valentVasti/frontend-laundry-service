import React from 'react'
import { Outlet } from 'react-router-dom';

const AdminRoot = () => {
    return (
        <section>
            <Outlet />
        </section>
    )
}

export default AdminRoot