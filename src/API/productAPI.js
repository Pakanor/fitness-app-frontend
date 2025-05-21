const API_URL = 'http://localhost:5142/api/ProductsOperation';

// Istniejące funkcje (zachowane bez zmian)
export async function getRecentLogs(date = null) {
  const url = date ? `${API_URL}/recent?date=${date}` : `${API_URL}/recent`;
  const res = await fetch(url);
  return await res.json();
}

export async function deleteProductLog(id) {
  const res = await fetch(`${API_URL}/delete/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Błąd usuwania');
  return await res.text();
}

export async function updateProductLog(updatedEntry) {
  const res = await fetch(`${API_URL}/update`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedEntry),
  });
  if (!res.ok) throw new Error('Błąd aktualizacji');
  return await res.text();
}

// Nowe lub zaktualizowane funkcje dla wyszukiwania i dodawania produktów
export async function searchProducts(query) {
  const res = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Błąd wyszukiwania produktów');
  return await res.json();
}

export async function addProductLog(product, grams) {
  const res = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      product: {
        productName: product.product_name || product.productName,
        brands: product.brands || 'Nieznana',
        code: product.code || null
      },
      grams: parseFloat(grams)
    }),
  });
  if (!res.ok) throw new Error('Błąd dodawania produktu');
  return await res.text();
}

