import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useCookies } from 'react-cookie';

const RedirectIfNotAuthenticated = ({ Component }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['__ADMINTOKEN__']);
    const [pass, setPass] = useState(false)

    useEffect(() => {
        console.log(cookies)
        if (cookies.__ADMINTOKEN__ == undefined) {
            setPass(false)
            window.location.href = '/admin/login';
        } else {
            setPass(true)
        }
    }, [])

    return pass ?
        (
            Component
        ) : (
            <div>Login first to use the app! Redirect to login page...</div>
        )
}

export default RedirectIfNotAuthenticated