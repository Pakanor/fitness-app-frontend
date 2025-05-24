import React, { useState, useEffect } from 'react';
import { addProductLog } from '../API/productAPI';

function AddProductForm() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [grams, setGrams] = useState('');
  const [message, setMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [calculatedNutriments, setCalculatedNutriments] = useState(null);
useEffect(() => {
  const fetchNutriments = async () => {
    if (selectedProduct && grams && !isNaN(grams)) {
      try {
        const response = await fetch('http://localhost:5142/api/CalorieCalculator/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product: selectedProduct,
            grams: parseFloat(grams)
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Błąd kalkulatora: ${errorText}`);
        }

        const result = await response.json();
        setCalculatedNutriments(result);
      } catch (error) {
        console.error('Błąd przeliczania wartości odżywczych:', error);
        setCalculatedNutriments(null);
      }
    } else {
      setCalculatedNutriments(null);
    }
  };

  fetchNutriments();
}, [grams, selectedProduct]);

  // Wyszukiwanie produktów przy zmianie searchTerm
  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.length > 2) {
        setIsSearching(true);
        try {
          const response = await fetch(`http://localhost:5142/api/ProductsOperation/search?query=${encodeURIComponent(searchTerm)}`);
          if (!response.ok) {
  const text = await response.text(); // pokaż HTML/treść błędu
  throw new Error(`Błąd HTTP ${response.status}: ${text}`);
}
const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.error('Błąd wyszukiwania:', error);
          setProducts([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setProducts([]);
      }
    };

    const timer = setTimeout(searchProducts, 1000);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct || !grams) {
      setMessage('Wybierz produkt i podaj wagę');
      return;
    }

    try {
 const response = await fetch('http://localhost:5142/api/CalorieCalculator/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product: selectedProduct,
        grams: parseFloat(grams)})})
        if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Błąd kalkulatora: ${errorText}`);
    }

    const nutriments = await response.json();


      const result = await addProductLog({
        productName: selectedProduct.productName,
        brands: selectedProduct.brands || 'Nieznana',
        code: selectedProduct.code,
        grams: parseFloat(grams),
        nutriments: nutriments
      });
      console.log('Wysyłany produkt:', selectedProduct);

      setMessage(result);
      // Czyścimy formularz
      setSearchTerm('');
      setSelectedProduct(null);
      setGrams('');
      setProducts([]);
    } catch (error) {
      setMessage('Błąd podczas dodawania produktu');
      
      console.error(error);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
     setSearchTerm(''); 
    setProducts([]);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Dodaj nowy produkt</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Wyszukaj produkt:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!e.target.value || e.target.value !== selectedProduct?.productName) {
                setSelectedProduct(null);
              }
            }}
            placeholder="Wpisz nazwę produktu (min. 3 znaki)..."
            style={{ width: '100%', padding: '8px' }}
          />
          
          {isSearching && <p style={{ margin: '5px 0' }}>Wyszukiwanie...</p>}
          
          {products.length > 0 && !isSearching && (
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '5px 0',
              border: '1px solid #ddd',
              borderRadius: '4px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {products.map((product, index) => (
                <li 
                  key={product.code || index}
                  onClick={() => handleProductSelect(product)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: '#f9f9f9',
                    borderBottom: '1px solid #eee',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#f9f9f9'}
                >
                  <strong>{product.productName || 'Nazwa nieznana'}</strong>
                  {product.brands && <div>Marka: {product.brands}</div>}
                  {product.code && <div>Kod: {product.code}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {selectedProduct && (
          <div style={{
            margin: '15px 0',
            padding: '10px',
            backgroundColor: '#f0f8ff',
            borderRadius: '4px',
            borderLeft: '4px solid #4285f4'
          }}>
            <h3 style={{ marginTop: 0 }}>Wybrany produkt:</h3>
            <p><strong>Nazwa:</strong> {selectedProduct.productName || 'Nazwa nieznana'}</p>
            {selectedProduct.brands && <p><strong>Marka:</strong> {selectedProduct.brands}</p>}
            {selectedProduct.code && <p><strong>Kod kreskowy:</strong> {selectedProduct.code}</p>}
            {selectedProduct.nutriments && (
      <div style={{ marginTop: '10px' }}>
        <h4>Wartości odżywcze (na 100g):</h4>
        <ul style={{ paddingLeft: '20px' }}>
          <li><strong>Kalorie:</strong> {selectedProduct.nutriments.energy} {selectedProduct.nutriments.energyUnit}</li>
          <li><strong>Białko:</strong> {selectedProduct.nutriments.proteins} g</li>
          <li><strong>Tłuszcz:</strong> {selectedProduct.nutriments.fat} g</li>
          <li><strong>Węglowodany:</strong> {selectedProduct.nutriments.carbs} g</li>
          <li><strong>Sól:</strong> {selectedProduct.nutriments.salt} g</li>
        </ul>
      </div>
    )}
          </div>
        )}
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Waga (gramy):</label>
          <input
            type="number"
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
            required
            min="1"
            step="1"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
       {calculatedNutriments && (
  <div style={{ marginTop: '10px' }}>
    <h4>Wartości odżywcze (dla {grams}g):</h4>
    <ul style={{ paddingLeft: '20px' }}>
      <li><strong>Kalorie:</strong> {calculatedNutriments.energy} {calculatedNutriments.energyUnit}</li>
      <li><strong>Białko:</strong> {calculatedNutriments.proteins} g</li>
      <li><strong>Tłuszcz:</strong> {calculatedNutriments.fat} g</li>
      <li><strong>Węglowodany:</strong> {calculatedNutriments.carbs} g</li>
      <li><strong>Sól:</strong> {calculatedNutriments.salt} g</li>
    </ul>
  </div>
)}


        <button 
          type="submit"
          style={{
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          disabled={!selectedProduct || !grams}
        >
          Dodaj produkt
        </button>
        
        {message && (
          <p style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: message.includes('Błąd') ? '#ffebee' : '#e8f5e9',
            color: message.includes('Błąd') ? '#c62828' : '#2e7d32',
            borderRadius: '4px'
          }}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default AddProductForm;