import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import AllDocument from '../components/AllDocument'
import axios from 'axios';

function Homepage() {
    const [documents, setdocuments] = useState();
    useEffect(() => {
        let isCancelled = false;
        // console.log(process.env.REACT_APP_API_BASE_URL);
        axios({
            url: `${process.env.REACT_APP_API_BASE_URL}/api/v1/document`,
            method: "GET",
            withCredentials: true,
        })
            .then((res) => {
                if (!isCancelled) {
                    setdocuments(res.data.data.documents)
                }
            })
            .catch((err) => {
            });
        return () => {
            isCancelled = true;
        };
    }, []);

    return (
        <>
            <Header />
            <AllDocument documents={documents} />
        </>
    )
}

export default Homepage