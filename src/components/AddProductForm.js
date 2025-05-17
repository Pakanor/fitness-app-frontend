import React, { useState } from 'react';
import { addProductLog } from '../API/productAPI';

function AddProductForm() {
  const [productName, setProductName] = useState('');
  const [brands, setBrands] = useState('');
  const [grams, setGrams] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Walidacja minimalna
    if (!productName || !brands || !grams) {
      setMessage('Wypełnij wszystkie pola');
      return;
    }

    const product = {
      productName,
      brands,
    };

    try {
      const result = await addProductLog(product, parseFloat(grams));
      setMessage(result);
      // Czyścimy formularz
      setProductName('');
      setBrands('');
      setGrams('');
    } catch (error) {
      setMessage('Błąd podczas dodawania produktu');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nazwa produktu:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Marka:</label>
        <input
          type="text"
          value={brands}
          onChange={(e) => setBrands(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Waga (gramy):</label>
        <input
          type="number"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
          required
          min="1"
        />
      </div>
      <button type="submit">Dodaj produkt</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default AddProductForm;
