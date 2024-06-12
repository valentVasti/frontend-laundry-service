import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import axios from 'axios'
import { BASE_URL } from '../../../server/Url'
import { useCookies } from 'react-cookie'

const ProductList = ({ onClick }) => {
    const [products, setProducts] = useState([])
    const [cookies, setCookie, removeCookie] = useCookies(['__ADMINTOKEN__']);  

    const fetchProduct = async () => {
        try {
            const response = await axios.get(BASE_URL + "/getActiveProduct", {
                headers: {
                    'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
                },
            });
            setProducts(response.data.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchProduct()
    }, [])

    return (
        <>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onClick={onClick} />
            ))}
        </>
    )
}

export default ProductList