import React from 'react'
import SelectedProductCard from './SelectedProductCard'

const SelectedProductList = ({selectedProduct, countPayment, removeProduct}) => {

    return (
        <>
            {selectedProduct.map((product) => (
                <SelectedProductCard key={product.id} selectedProduct={product} countPayment={countPayment} removeProduct={removeProduct} />
            ))}
        </>
    )
}

export default SelectedProductList