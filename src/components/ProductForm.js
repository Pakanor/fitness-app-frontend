import React, { useState, useEffect } from 'react';
import { addProductLog,updateProductLog } from '../API/productAPI';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';
function ProductForm({ mode = 'add', initialData = null, onSuccess }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [grams, setGrams] = useState('');
  const [message, setMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [calculatedNutriments, setCalculatedNutriments] = useState(null);
  useEffect(() => {
if (mode === 'edit' && initialData) {
  const fakeProduct = {
    ...initialData,
    nutriments: {
      energy: initialData.energy,
      fat: initialData.fat,
      proteins: initialData.proteins,
      carbs: initialData.carbs ?? 0,
      sugars: initialData.sugars,
      salt: initialData.salt,
      energyUnit: initialData.energyUnit,
    }
  };

  setSelectedProduct(fakeProduct);
  setGrams(initialData.grams);
  setCalculatedNutriments({
    energy: initialData.energy,
    fat: initialData.fat,
    proteins: initialData.proteins,
    carbs: initialData.carbs ?? 0,
    sugars: initialData.sugars,
    salt: initialData.salt,
    energyUnit: initialData.energyUnit,
  });
}
}, [mode, initialData]);
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
        grams: parseFloat(grams),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Błąd kalkulatora: ${errorText}`);
    }

    const nutriments = await response.json();

    if (mode === 'add') {
      await addProductLog(selectedProduct, grams, nutriments);
      alert("Produkt dodano!");
    } else {
      await updateProductLog({
  ...initialData,
  grams: parseFloat(grams),
  energy: nutriments.energy,
  fat: nutriments.fat,
  sugars: nutriments.sugars,
  proteins: nutriments.proteins,
  salt: nutriments.salt,
  energyUnit: nutriments.energyUnit,
});
      alert("Produkt zaktualizowano!");
    }

    if (onSuccess) onSuccess();

    if (mode === 'add') {
      setSearchTerm('');
      setSelectedProduct(null);
      setGrams('');
      setProducts([]);
    }
  } catch (error) {
    setMessage('Błąd podczas zapisu produktu');
    console.error(error);
  }
};

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
     setSearchTerm(''); 
    setProducts([]);
  };

   return (
    <Box sx={{ maxWidth: 500, mx: 'auto', p: 2 }}>
      <Typography variant="h5" mb={2}>
  {mode === 'add' ? 'Dodaj nowy produkt' : 'Edytuj produkt'}
</Typography>
      <form onSubmit={handleSubmit} noValidate>
       {mode === 'add' && (
  <TextField
    fullWidth
    label="Wyszukaj produkt"
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      if (!e.target.value || e.target.value !== selectedProduct?.productName) {
        setSelectedProduct(null);
      }
    }}
    placeholder="Wpisz nazwę produktu (min. 3 znaki)..."
    margin="normal"
    autoComplete="off"
  />
)}

        {isSearching && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {products.length > 0 && !isSearching && (
          <Paper
            sx={{
              maxHeight: 200,
              overflowY: 'auto',
              mt: 1,
              border: '1px solid #ddd',
            }}
          >
            <List disablePadding>
              {products.map((product, index) => (
                <ListItem
                  button
                  key={product.code || index}
                  onClick={() => handleProductSelect(product)}
                  sx={{
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                >
                  <ListItemText
                    primary={product.productName || 'Nazwa nieznana'}
                    secondary={
                      <>
                        {product.brands && `Marka: ${product.brands} `}
                        {product.code && `Kod: ${product.code}`}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
<TextField
          type="number"
          label="Waga (gramy)"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
          required
          inputProps={{ min: 1, step: 1 }}
          fullWidth
          margin="normal"
        />
        {(selectedProduct || calculatedNutriments) && (
  <Box
  mt={3}
  sx={{
    display: 'flex',
    flexDirection: 'row',
    gap: 3,
    alignItems: 'flex-start',
    width: '100%',
    minWidth: 500, 
  }}
>
    {selectedProduct && (
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          minWidth: 250,
          p: 2,
          borderLeft: '5px solid #1976d2',
          backgroundColor: '#e3f2fd',
        }}
      >
    <Typography variant="h6" mb={1}>
  Wybrany produkt:
</Typography>
<Typography>
  <strong>Nazwa:</strong> {selectedProduct.productName || 'Nazwa nieznana'}
</Typography>
{selectedProduct.brands && (
  <Typography>
    <strong>Marka:</strong> {selectedProduct.brands}
  </Typography>
)}
{selectedProduct.code && (
  <Typography>
    <strong>Kod kreskowy:</strong> {selectedProduct.code}
  </Typography>
)}
{selectedProduct.nutriments && (
  <Box mt={1}>
    <Typography variant="subtitle1">Wartości odżywcze (na 100g):</Typography>
    <ul>
      <li>
        <strong>Kalorie:</strong>{' '}
        {selectedProduct.nutriments.energy
          ? Math.round(selectedProduct.nutriments.energy)
          : 'Brak danych'}{' '}
        {selectedProduct.nutriments.energyUnit || ''}
      </li>
      <li>
        <strong>Białko:</strong>{' '}
        {selectedProduct.nutriments.proteins != null
          ? parseFloat(selectedProduct.nutriments.proteins.toFixed(1))
          : 'Brak danych'} g
      </li>
      <li>
        <strong>Tłuszcz:</strong>{' '}
        {selectedProduct.nutriments.fat != null
          ? parseFloat(selectedProduct.nutriments.fat.toFixed(1))
          : 'Brak danych'} g
      </li>
      <li>
        <strong>Węglowodany:</strong>{' '}
        {selectedProduct.nutriments.carbs != null
          ? parseFloat(selectedProduct.nutriments.carbs.toFixed(1))
          : 'Brak danych'} g
      </li>
      <li>
        <strong>Sól:</strong>{' '}
        {selectedProduct.nutriments.salt != null
          ? parseFloat(selectedProduct.nutriments.salt.toFixed(1))
          : 'Brak danych'} g
      </li>
    </ul>
  </Box>
)}

      </Paper>
    )}

    {calculatedNutriments && (
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          minWidth: 250,
          p: 2,
          borderLeft: '5px solid #43a047',
          backgroundColor: '#e8f5e9',
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          Wartości odżywcze (dla {grams}g):
        </Typography>
        <ul>
          <li>
            <strong>Kalorie:</strong> {calculatedNutriments.energy} {calculatedNutriments.energyUnit}
          </li>
          <li>
            <strong>Białko:</strong> {calculatedNutriments.proteins} g
          </li>
          <li>
            <strong>Tłuszcz:</strong> {calculatedNutriments.fat} g
          </li>
          <li>
            <strong>Węglowodany:</strong> {calculatedNutriments.carbs} g
          </li>
          <li>
            <strong>Sól:</strong> {calculatedNutriments.salt} g
          </li>
        </ul>
      </Paper>
    )}
  </Box>
)}


        <Button
  type="submit"
  variant="contained"
  color="primary"
  disabled={!selectedProduct || !grams}
  sx={{ mt: 3 }}
  fullWidth
>
  {mode === 'add' ? 'Dodaj produkt' : 'Zapisz zmiany'}
</Button>

        {message && (
          <Box
            mt={2}
            p={2}
            sx={{
              borderRadius: 1,
              bgcolor: message.includes('Błąd') ? 'error.light' : 'success.light',
              color: message.includes('Błąd') ? 'error.main' : 'success.main',
            }}
          >
            {message}
          </Box>
        )}
      </form>
    </Box>
  );
}
export default ProductForm;