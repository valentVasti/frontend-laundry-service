import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { FiPlusCircle } from 'react-icons/fi';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import { MdNavigateNext } from 'react-icons/md';
import { IoIosArrowDropright } from 'react-icons/io';

const ProductList = ({ total, setTotal, products, items, setItems }) => {

    const addItems = (selectedProduct) => {
        const foundItem = items.find(item => item.id === selectedProduct.id)

        if (foundItem !== undefined) {
            setItems(items.map(item => item.id === selectedProduct.id ? selectedProduct : item))
        }else{
            setItems([...items, selectedProduct])
        }
    }

    return (
        <>
            {products.map((product) => (
                <ProductItem key={product.id} data={product} addItems={addItems} setTotal={setTotal} total={total} />
            ))}
        </>
    )
}

const ProductItem = ({ total, setTotal, data, addItems }) => {
    const [quantity, setQuantity] = useState(0)

    const handleIncrementItems = () => {
        const newQty = quantity + 1
        setQuantity(newQty)

        const selectedProduct = {
            id: data.id,
            product_name: data.product_name,
            price: data.price,
            qty: newQty
        }

        addItems(selectedProduct)
        setTotal(total + (data.price))
    }

    const handleDecrementItems = () => {
        if (quantity - 1 >= 0) {
            const newQty = quantity - 1

            setQuantity(newQty)
            
            const selectedProduct = {
                id: data.id,
                product_name: data.product_name,
                price: data.price,
                qty: newQty
            }
            addItems(selectedProduct)
            setTotal(total - (data.price))
        }
    }

    if (data.product_name != 'Cuci' && data.product_name != 'Kering') {
        return (
            <div className='w-full h-16 bg-gray-100 rounded-xl rounded-r-full flex'>
                <div className='flex flex-col w-1/2 p-2'>
                    <h1>{data.product_name}</h1>
                    <h2 className='text-sm text-gray-400'>{'Rp ' + data.price + ',00'}</h2>
                </div>
                <div className='w-1/2 h-full flex justify-end pe-3 items-center'>
                    <div className=' w-2/3 h-2/3 flex bg-gray-200 rounded-full'>
                        <div className='w-1/3 h-full flex justify-center items-center text-3xl' onClick={handleDecrementItems}><CiCircleMinus /></div>
                        <div className='w-1/3 h-full flex justify-center items-center text-xl'>{quantity}</div>
                        <div className='w-1/3 h-full flex justify-center items-center text-3xl' onClick={handleIncrementItems}><CiCirclePlus /></div>
                    </div>
                </div>
            </div>
        )
    }
}

const AdditionalSection = ({ total, setTotal, products, items, setItems }) => {
    return (
        <section className='relative h-full'>
            <h1 className='mb-2'>Tambahan</h1>
            <div className='flex flex-col w-full h-auto gap-2'>
                <ProductList total={total} setTotal={setTotal} products={products} items={items} setItems={setItems} />
            </div>

        </section>
    )
}

export default AdditionalSection