import React from 'react'

const ProductCard = ({ product, onClick }) => {
    
    const handleClick = () => {
        onClick(product);
    };

    return (
        <div className='w-1/3 h-1/3 p-2' onClick={handleClick}>
            <div className='w-full h-full'>
                <div className='w-full h-3/4 bg-gray-100 text-4xl text-center flex items-center justify-center'>
                    <h1>{product.product_name}</h1>
                </div>
                <div className='w-full h-1/4 bg-gray-300 p-2 text-xl'>
                    <h1>{product.price}</h1>
                </div>
            </div>
        </div>
    )
}

export default ProductCard