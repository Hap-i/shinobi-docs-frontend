import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import AllDocument from '../components/AllDocument'
import axios from 'axios';

function Homepage() {
    const [documents, setdocuments] = useState();
    useEffect(() => {
        let isCancelled = false;
        axios({
            url: "http://127.0.0.1:3001/api/v1/document",
            method: "GET",
            withCredentials: true,
        })
            .then((res) => {
                if (!isCancelled) {
                    setdocuments(res.data.data.documents)
                    // console.log(res.data.data.documents);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        return () => {
            isCancelled = true;
        };
    }, []);

    // console.log(docs)
    return (
        <>
            <Header />
            <AllDocument documents={documents} />
        </>
    )
}

export default Homepage