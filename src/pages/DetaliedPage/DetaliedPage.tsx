import * as React from 'react';
// import { Link } from 'react-router-dom';
// import Button from 'react-bootstrap/Button';
import Header from 'components/Header';
import BreadCrumbs from 'components/BreadCrumbs';
import Image from "react-bootstrap/Image"
import styles from './DetaliedPage.module.scss'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { mockProducts } from '../../../consts'

type Product = {
    id: number,
    title: string,
    price: number,
    info: string,
    src: string
}

export type ReceivedProductData = {
    id: number,
    product_name: string,
    product_info: string,
    price: number,
    status: string,
    photo: string,
}


const MainPage: React.FC = () => {
    const params = useParams();
    const id = params.id === undefined ? '' : params.id;
    const [linksMap, setLinksMap] = useState<Map<string, string>>(
        new Map<string, string>([['Наборы', '/']])
    );

    const [product, setProduct] = useState<Product>();
    // const linksMap = new Map<string, string>([
    //     ['Абонементы', '/']
    // ]);
    let currentUrl = '/'

    const fetchProduct = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/product/${id}`);
            const jsonData = await response.json();
            setProduct({
                id: Number(jsonData.id),
                title: jsonData.product_name,
                price: jsonData.price,
                info: jsonData.product_info,
                src: jsonData.photo
            })

            const newLinksMap = new Map<string, string>(linksMap); // Копирование старого Map
            newLinksMap.set(jsonData.title, '/product/' + id);
            setLinksMap(newLinksMap)
        } catch {
            const product = mockProducts.find(item => item.id === Number(id));
            setProduct(product)
        }
        
        currentUrl += 'products/' + id

    };
    useEffect(() => {
        fetchProduct();
    }, []);

    return (
        <div className='main__page'>
            <Header/>
            <div className={styles.content} style={{paddingTop: "90px"}}>
                <BreadCrumbs links={linksMap}/>
                <div className='d-flex gap-5'>
                    <Image
                        style={{ width: '45%' }}
                        src={product?.src ? product?.src : "https://www.solaredge.com/us/sites/nam/files/Placeholders/Placeholder-4-3.jpg"}
                        rounded
                    />
                    <div style={{width: '55%'}}>
                            <h1 className='mb-4' style={{fontSize: 30}}> {product?.title}</h1>
                        <h4>Цена на данный набор продуктов:  <strong>{product?.price}р.</strong></h4>
                        <div className={styles.content__description}>
                            <h4>Описание:</h4>
                            <p>{product?.info}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
  
export default MainPage;