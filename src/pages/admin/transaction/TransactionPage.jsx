import React, { useEffect, useState } from 'react'
import ProductList from './ProductList'
import SelectedProductList from './SelectedProductList'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Button } from '@nextui-org/react';
import { RadioGroup, Radio, Input } from "@nextui-org/react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { BASE_URL } from '../../../server/Url';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'animate.css';
import { Link } from 'react-router-dom';
import { useStore } from '../../../server/store';
import { useCookies } from 'react-cookie';
import { FaKey } from 'react-icons/fa6';
import toast, { Toaster } from 'react-hot-toast';

const TransactionPage = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [items, setItems] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [change, setChange] = useState("-");
  const [changeClass, setChangeClass] = useState('hidden');
  const [selectedConsument, setSelectedConsument] = useState({ id: 0, name: '...', phone_num: '...' });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paidSum, setPaidSum] = useState(0);
  const [payButton, setPayButton] = useState(true);
  const [consument, setConsument] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isTodayOpened = useStore((state) => state.isTodayOpened)
  const isTodayClosed = useStore((state) => state.isTodayClosed)
  const [cookies, setCookie, removeCookie] = useCookies(['__ADMINTOKEN__']);
  const [transactionTokenData, setTransactionTokenData] = useState([{}]);
  const [token, setToken] = useState('');
  const [openModal, setOpenModal] = useState('TOKEN');
  const [tokenInvalid, setTokenInvalid] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [tokenIsLoading, setTokenIsLoading] = useState(false);

  const fetchConsument = async () => {
    try {
      const response = await axios.get(BASE_URL + "/user/konsumen/role", {
        headers: {
          Authorization: 'Bearer ' + cookies.__ADMINTOKEN__
        }
      });
      setConsument(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchConsument()
  }, []);

  const selectConsument = (id) => {
    const findResult = consument.find((item) => item.id == id);

    findResult != undefined ? setSelectedConsument(findResult) : setSelectedConsument({ id: 0, name: '...', phone_num: '...' });

    setPayButton(!((findResult != undefined) && items.length != 0));
    // ! nantinya bisa search by phone_num
  }

  const selectedProduct = (product) => {
    const result = items.find(obj => obj['id'] === product.id);
    console.log(result);
    if (result == undefined) {
      const newItem = product;
      newItem['qty'] = 1;
      setItems([...items, newItem]);
      const total = totalPayment + product.price;
      setTotalPayment(total);

      setPayButton(!(selectedConsument.id !== 0 && true));
    }

  };

  const removeProduct = (productId, productTotalPrice) => {
    const newItems = items.filter((item) =>
      item.id !== productId
    );
    setItems(newItems);

    const total = totalPayment - productTotalPrice;
    setTotalPayment(total);

    setPayButton(total == 0);
  }

  // * function buat di dalem modal
  const countPayment = (selectedProduct, action) => {
    const total = action == "add" ? totalPayment + selectedProduct.price : totalPayment - selectedProduct.price;
    action == "add" ? selectedProduct.qty += 1 : selectedProduct.qty -= 1;
    setTotalPayment(total);
  }

  const countChange = (e) => {
    const payment = e.target.value;
    if (e.target.value > totalPayment) {
      const totalChange = payment - totalPayment;
      setChange(totalChange);
      setPaidSum(payment);
    } else {
      setChange("-");
      setPaidSum(0);
    }
  }

  const paymentMethod = (e) => {
    const paymentMethod = e.target.value
    const changeInput = paymentMethod == "CASHLESS" ? 'hidden' : '';
    setChangeClass(changeInput);
    setSelectedPaymentMethod(paymentMethod);
  }

  const submitTransaction = () => {
    const finalData = [
      {
        "user_id": selectedConsument.id,
        "paying_method": selectedPaymentMethod,
        "total": totalPayment,
        "paid_sum": selectedPaymentMethod == "CASHLESS" ? totalPayment : paidSum,
        "item": JSON.stringify(items)
      }
    ]

    console.log('FinalData :', finalData)

    const postTransaction = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(BASE_URL + "/transaction", finalData[0], {
          headers: {
            Authorization: 'Bearer ' + cookies.__ADMINTOKEN__
          }
        });
        console.log(response.data.success);
        if (response.data.success) {
          setSelectedConsument({ id: 0, name: '...', phone_num: '...' });
          setItems([]);
          onClose();
          setIsLoading(false);
          setTotalPayment(0);
          Swal.fire({
            title: "Transaction Success!",
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
        }
      } catch (error) {
        toast.error(error.response.data.message);
        onClose();
        setIsLoading(false);
      }
    }

    postTransaction();
  }

  const handleTokenInput = (e) => {
    const token = e.target.value;
    setToken(token)
  }

  const redeemToken = async () => {
    if (token == '') {
      setTokenInvalid(true);
      setTokenError('Token tidak boleh kosong!');
    } else {
      setTokenIsLoading(true);
      setTokenInvalid(false);
      setTokenError('');
      try {
        const response = await axios.post(BASE_URL + "/token",
          {
            'token': token,
          }
          ,
          {
            headers: {
              Authorization: 'Bearer ' + cookies.__ADMINTOKEN__
            }
          });
        if (response.data.success) {
          setTransactionTokenData(response.data.data['transaction']);
          setIsLoading(false);
          setTokenIsLoading(false);
        }
      } catch (error) {
        setTokenInvalid(true);
        setTokenError(error.response.data.message);
        setTokenIsLoading(false);
      }
    }
  }

  const getTransactionData = (transaction) => {
    const detailTransaction = transaction.detail_transaction

    const product = detailTransaction.filter((item) => item.product.product_name !== 'Kering' && item.product.product_name !== 'Cuci');
    const services = detailTransaction.filter((item) => item.product.product_name === 'Kering' || item.product.product_name === 'Cuci');

    return {
      'product': product,
      'services': services
    }
  }

  const onCloseModal = () => {
    onClose();
    setToken('');
    setChange('-');
    setTokenInvalid(false);
    setTokenError('');
    setTransactionTokenData([{}]);
  }

  const formatDate = (dateString) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const date = new Date(dateString);
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    return `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  }

  const formatPrice = (price) => {
    const formattedPrice = price.toLocaleString('id-ID');
    return 'Rp ' + formattedPrice + ',00';
  }

  if (isTodayOpened && !isTodayClosed) {
    return (
      <div className='w-full h-[670px] flex gap-3'>
        {/* active product */}
        <Toaster />
        <div className=' w-3/4 h-full rounded-md flex flex-col gap-3'>
          <div className='w-full h-1/6 bg-gray-200 rounded-md flex justify-center items-center px-5 gap-5'>
            <Autocomplete
              allowsCustomValue
              label="Cari Konsumen"
              variant="bordered"
              className="w-full"
              defaultItems={consument}
              classNames='text-red-500'
              onSelectionChange={selectConsument}
              value={selectedConsument.name}
              isRequired
            >
              {(consumentItem) =>
                <AutocompleteItem key={consumentItem.id} textValue={consumentItem.name}>
                  <div className='text-lg'>{consumentItem.name}</div>
                  <div className='text-sm'>{consumentItem.phone_num}</div>
                </AutocompleteItem>
              }
            </Autocomplete>
            <div className='h-full w-1/2 flex justify-start items-center'>
              <Card fullWidth className='p-0 w-full' radius='sm'>
                <CardHeader className='text-[12px] py-1 '>Konsumen dipilih</CardHeader>
                <Divider />
                <CardBody className='text-sm pt-1'>
                  {selectedConsument.name}
                  <div className='text-sm text-gray-500'>
                    {selectedConsument.phone_num}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
          <div className='w-full h-5/6 flex flex-wrap content-start justify-start p-1 bg-gray-200 rounded-md'>
            <ProductList onClick={selectedProduct} />
          </div>
        </div>
        <div className='w-1/4 h-full flex flex-col gap-3'>
          {/* selected product */}
          <div className='w-full h-1/6 bg-gray-200 rounded-md flex justify-center items-center px-5'>
            <Button color='primary' fullWidth onPress={() => {
              onOpen()
              setOpenModal('TOKEN')
            }}>Gunakan Token</Button>
          </div>
          <div className='w-full h-full flex flex-col content-start bg-gray-200 p-3 gap-3 rounded-md overflow-hidden'>
            <SelectedProductList selectedProduct={items} countPayment={countPayment} removeProduct={removeProduct} />
          </div>

          {/* pay button */}
          <div className='w-full h-1/4 bg-gray-200 rounded-md flex flex-col p-2'>
            <div className='w-full h-1/2 flex justify-center items-center text-2xl'>
              {formatPrice(totalPayment)}
            </div>
            <div className='w-full h-1/2 p-2'>
              <Button fullWidth color='success' className='text-xl' onPress={() => {
                onOpen()
                setOpenModal('PAYMENT')
              }} isDisabled={payButton}>BAYAR</Button>
            </div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onCloseModal}>
              {
                openModal == 'PAYMENT' ? (
                  <ModalContent>
                    {() => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">Konfirmasi Pembayaran</ModalHeader>
                        <ModalBody>
                          <RadioGroup
                            label="Pilih Metode Pembayaran"
                            orientation="horizontal"
                            onChange={paymentMethod}
                          >
                            <Radio value="CASH">Tunai</Radio>
                            <Radio value="CASHLESS">Non-tunai</Radio>
                          </RadioGroup>

                          <div>
                            <div className='text-2xl'><span>Total Harga: </span>{formatPrice(totalPayment)}</div>
                            <div className={'text-lg ' + changeClass}><span>Kembalian: </span>{formatPrice(change)}</div>
                          </div>

                          <Input type="number" label="Jumlah Bayar" placeholder="0.00" onChange={countChange} className={changeClass} />

                        </ModalBody>
                        <ModalFooter>
                          <Button color="primary" fullWidth onClick={submitTransaction} isLoading={isLoading}>
                            Konfirmasi Pembayaran dan Selesaikan Transaksi
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                ) : (
                  <ModalContent>
                    {() => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">Tukar Token</ModalHeader>
                        <ModalBody>
                          <div className='flex gap-4 justify-center items-center h-auto'>
                            <div className='text-3xl w-3/4'>
                              <Input placeholder='Masukkan token konsumen disini...' startContent={<FaKey size={15} className='text-gray-400' />} fullWidth onChange={handleTokenInput} errorMessage={tokenError} isInvalid={tokenInvalid} />
                            </div>
                            <Button color="primary" className='w-1/4 h-14' size='lg' onPress={redeemToken} isLoading={tokenIsLoading}>
                              Tukar
                            </Button>
                          </div>
                          {transactionTokenData.id != undefined ?
                            (
                              <div className='w-full h-auto flex flex-col justify-center items-center gap-3 border-2 rounded-xl border-dashed border-gray-500 py-3'>
                                <div className='w-full h-auto flex flex-col justify-center items-center'>
                                  <h1 className='font-bold'>{'Transaction #' + transactionTokenData.id}</h1>
                                  <h1>{formatDate(transactionTokenData.created_at)}</h1>
                                </div>
                                {/* siapin hasil response buat ditampilin, kasih logika buat Cuci dan Kering dsb */}
                                <Divider className='bg-gray-500' />
                                <div className='flex flex-col justify-center items-center'>
                                  <p className='text-lg'>Layanan</p>
                                  <p className='text-2xl'>{getTransactionData(transactionTokenData).services.length == 2 ? 'Cuci dan Kering' : getTransactionData(transactionTokenData).services[0].product.product_name == 'kering' ? 'Kering' : 'Cuci'}</p>
                                  <p className='bg-yellow-300 p-1 px-5 rounded-3xl my-3'>{getTransactionData(transactionTokenData).services.length + ' koin'}</p>
                                </div>
                                <div className='flex flex-col justify-center items-center w-56'>
                                  <p className='text-lg'>Tambahan Produk</p>
                                  <div className='flex flex-col w-full'>
                                    {getTransactionData(transactionTokenData).product.length !== 0 ? (
                                      getTransactionData(transactionTokenData).product.map((item, index) => (
                                        <div key={index} className='flex justify-between items-center w-full h-auto'>
                                          <p className='text-lg'>{item.product.product_name}</p>
                                          <p>{item.quantity + 'x'}</p>
                                        </div>
                                      ))
                                    ) : (
                                      <p className='text-lg text-center'>-</p>
                                    )
                                    }
                                  </div>
                                </div>
                              </div>
                            ) : null
                          }
                        </ModalBody>
                        <ModalFooter>
                          {/* <Button color="default" fullWidth onClick={submitTransaction} isLoading={isLoading}>
                            Batal
                          </Button> */}
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                )
              }

            </Modal>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='flex flex-col justify-center items-center w-full'>
        <p className='text-2xl'>ANTRIAN BELUM DIBUKA / SUDAH DITUTUP</p>
        <p className='text-lg'>Apabila antrian belum dibuka, silahkan buka antrian di menu <Link to='/openCloseQueue' className='underline text-blue-600'>Daily Queue Log</Link>
        </p>
      </div>
    )
  }

}

export default TransactionPage