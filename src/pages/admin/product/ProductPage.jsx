import React, { useLayoutEffect, useState } from 'react'
import {
  Button,
  Input
} from "@nextui-org/react";
import axios from 'axios';
import { BASE_URL } from '../../../server/Url';
import { IoIosAddCircle } from "react-icons/io";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';
import Swal from 'sweetalert2';
import ProductTable from './ProductTable';
import { useCookies } from 'react-cookie';

const ProductPage = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['__ADMINTOKEN__']);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [productName, setProductName] = useState('')
  const [price, setPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const fetchProduct = async () => {
    try {
      const response = await axios.get(BASE_URL + "/product", {
        headers: {
          'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
        },
      });
      console.log(response.data.data);
    } catch (error) {
      console.log(error)
    }
  }

  useLayoutEffect(() => {

    fetchProduct()

  }, [])

  const handleOnInputProductName = (e) => {
    setProductName(e.target.value)
  }

  const handleOnInputPrice = (e) => {
    setPrice(e.target.value)
  }

  const handleAddProduct = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(BASE_URL + "/product", {
        product_name: productName,
        price: price
      }, {
        headers: {
          'Authorization': 'Bearer ' + cookies.__ADMINTOKEN__
        }
      });
      console.log(response.data);
      fetchProduct()
      onClose()
      Swal.fire({
        title: "Product added successfully!",
        position: 'bottom-right',
        background: 'green',
        color: 'white',
        icon: 'success',
        backdrop: false,
        showConfirmButton: false,
        toast: true,
        timer: 3000,
        showClass: {
          popup: `
      animate__animated
      animate__fadeInRight
    `
        },
        hideClass: {
          popup: `
      animate__animated
      animate__fadeOutRight
      animate__faster
    `
        }
      });
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='flex-col w-full flex gap-2 h-[670px]'>
      <div className='text-2xl font-bold px-3'>PRODUCT</div>
      <div className='w-full h-full p-3 flex flex-col gap-4'>
        <div className='flex h-[50px] gap-2'>
          <Input variant='bordered' radius='lg' size='sm' className='w-full h-full' placeholder='Cari produk...'>Search</Input>
          <div className='w-1/6 h-full flex justify-center items-center '>
            <Button color='primary' className='h-full' radius='lg' onPress={onOpen}><IoIosAddCircle size={20} />TAMBAH PRODUK</Button>
          </div>
        </div>
        <div className='w-full h-full'>
          <ProductTable />
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Tambah Data Produk</ModalHeader>
              <ModalBody>
                <div className='flex flex-col gap-7'>
                  <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='Nama Produk' label="Nama Produk" labelPlacement='outside' onInput={handleOnInputProductName}>Nama Produk</Input>
                  <Input variant='bordered' radius='lg' size='lg' className='w-full h-full' placeholder='0.00' label="Harga" type='number' labelPlacement='outside' onInput={handleOnInputPrice}>Harga</Input>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button fullWidth color='primary' onClick={handleAddProduct} isLoading={isLoading}>
                  Tambah Produk
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ProductPage