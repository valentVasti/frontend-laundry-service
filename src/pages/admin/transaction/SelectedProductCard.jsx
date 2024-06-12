import { Button } from '@nextui-org/react';
import React, { useState } from 'react'
import { FaRegTrashAlt } from "react-icons/fa";

const SelectedProductCard = ({ selectedProduct, countPayment, removeProduct }) => {
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(selectedProduct.price);

    const handleIncrement = () => {
        const incQuantity = quantity + 1;
        const total = selectedProduct.price * incQuantity;
        setQuantity(incQuantity);
        setTotalPrice(total);
        countPayment(selectedProduct, "add");
    }

    const handleDecrement = () => {
        if (quantity > 1) {
            const decQuantity = quantity - 1;
            const total = selectedProduct.price * decQuantity;
            setQuantity(decQuantity);
            setTotalPrice(total);
            countPayment(selectedProduct, "sub");
        }
    }

    const handleRemove = () => {
        removeProduct(selectedProduct.id, totalPrice);
    }

    const formatPrice = (price) => {
        const formattedPrice = price.toLocaleString('id-ID');
        return 'Rp ' + formattedPrice + ',00';
    }

    return (
        <div className='w-full h-[150px] bg-gray-100 flex flex-col'>
            <div className='w-full h-2/3 bg-gray-100 flex'>
                <div className='w-1/2 h-full'>
                    {selectedProduct.product_name}
                </div>
                <div className='w-1/2 h-full flex text-2xl font-bold'>
                    <button className='h-full w-1/3 text-center flex justify-center items-center bg-red-600 text-white' onClick={handleDecrement}>-</button>
                    <div className='h-full w-1/3 text-center flex justify-center items-center'>{quantity}</div>
                    <button className='h-full w-1/3 text-center flex justify-center items-center bg-blue-600 text-white' onClick={handleIncrement}>+</button>
                </div>
            </div>
            <div className='w-full h-1/3 bg-gray-300 flex'>
                <div className='h-full w-1/2 text-xl flex justify-center items-center'>{formatPrice(totalPrice)}</div>
                <Button color='danger' radius='none' isIconOnly className='h-full w-1/2' onClick={handleRemove}>
                    <FaRegTrashAlt size={25}/>
                </Button>
            </div>
        </div>
    )
}

export default SelectedProductCard