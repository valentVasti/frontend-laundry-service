import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const UserRoot = () => {
    return (
        <section>
            <Outlet />
        </section>
    )
}

export default UserRoot