import React, {useEffect, useState} from 'react'
import axios from 'axios'

//filters stores and only returns stores that are currently active
const filterActive = (stores) => {
    const filtered = [];
    for(let i=0; i<stores.length; i++){
        if (stores[i].isActive)
            filtered.push(stores[i])
    }
    return filtered;
} 

//returns all active store data including, store id, store icon, and store name

export default function useGetStoreData() {
    
    const [loading, setLoading] = useState(true);
    const [stores, setStores] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        let controller = new AbortController();
        setLoading(true);
        axios({
            method: 'GET',
            url: 'https://www.cheapshark.com/api/1.0/stores',
            signal: controller.signal
        }).then(res => {
            setStores(filterActive(res.data));
            setLoading(false);
        }).catch( err => {
            setLoading(false);
            setError(err);
            console.log(err);
        })
        return () => controller.abort();
    }, [])

  return {loading, stores, error};
}
