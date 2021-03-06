import React, { useState, useEffect } from "react";
import { useGlobalState } from "../contexts/globalContext.jsx";

export default function OptionsMenu({ setOptions }) {
  //range values for sliders
  const [priceRange] = useState([0, 61]);
  const [ratingsRange] = useState([0, 100]);
  //current values of sliders
  const [currentPrice, setCurrentPrice] = useState(priceRange[1]);
  const [steamRating, setSteamRating] = useState(ratingsRange[0]);
  //sets the current store to filter games by
  const [currentStore, setCurrentStore] = useState(null);
  //returns all data for available stores
  const { storeLoading, stores, storeError } = useGlobalState();
  //sets options which will be passed as a parameter to the getGames hook
  const [options, setCurrentOptions] = useState({
    upperPrice: currentPrice === priceRange[1] ? null : currentPrice,
    steamRating: steamRating,
    storeID: currentStore,
    metacritic: 1
  });
  //when options are updated a timeout is set before they are applied to prevent rapid fire api calls
  useEffect(() => {
    const timeout = setTimeout(() => {
      setOptions(options);
    }, 300);
    // console.log(options);
    return () => clearTimeout(timeout);
  }, [options, setOptions]);

  //sets store values in gameslist when store data is resolved
  //handles when the price slider is changed
  const handlePriceChange = e => {
    setCurrentPrice(e.target.value);
    setCurrentOptions(prevOptions => ({
      ...prevOptions,
      upperPrice:
        parseInt(e.target.value) >= priceRange[1] - 1 ? null : e.target.value
    }));
  };
  //handles when the review slider is changed
  const handleRatingsChange = e => {
    setSteamRating(e.target.value);
    setCurrentOptions(prevOptions => ({
      ...prevOptions,
      steamRating: parseInt(e.target.value) <= 2 ? null : e.target.value
    }));
  };
  //handles when the store select menu has a new value selected
  const handleStoreSelect = e => {
    setCurrentStore(e.target.value);
    setCurrentOptions(prevOptions => ({
      ...prevOptions,
      storeID: e.target.value === "0" ? null : e.target.value
    }));
  };

  return (
    <div className="options-menu">
      <div className="options-item">
        <label htmlFor="store-select">Store</label>
        <select
          name="store-select"
          id="store-select"
          value={undefined}
          onChange={handleStoreSelect}
        >
          <option value={0}>select a store</option>
          {!storeLoading &&
            !storeError &&
            stores.map(store => {
              return (
                <option key={store.storeName} value={store.storeID}>
                  {store.storeName}
                </option>
              );
            })}
        </select>
      </div>

      <div className="options-item">
        <label htmlFor="price-range">
          Price:{" "}
          {currentPrice >= priceRange[1] - 1 ? `Any` : `Below $${currentPrice}`}
        </label>
        <div className="range-values">
          <span className="range-minmax">${priceRange[0]}</span>
          <input
            className="slider"
            id="price-range"
            type="range"
            min={priceRange[0].toString()}
            max={priceRange[1].toString()}
            value={currentPrice}
            steps={1}
            onChange={handlePriceChange}
          ></input>
          <span className="range-minmax">${priceRange[1]}</span>
        </div>
      </div>

      <div className="options-item">
        <label htmlFor="savings-range">
          Steam Ratings: {steamRating <= 5 ? "Any" : `> ${steamRating}%`}
        </label>
        <div className="range-values">
          <span className="range-minmax">{ratingsRange[0]}%</span>
          <input
            className="slider"
            id="savings-range"
            type="range"
            min={ratingsRange[0].toString()}
            max={ratingsRange[1].toString()}
            value={steamRating}
            steps={5}
            onChange={handleRatingsChange}
          ></input>
          <span className="range-minmax">{ratingsRange[1]}%</span>
        </div>
      </div>
    </div>
  );
}
