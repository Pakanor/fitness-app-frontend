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

export async function searchProducts(query) {
  const res = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Błąd wyszukiwania produktów');
  return await res.json();
}

export async function addProductLog(product, grams, nutriments) {
  const body = {
    product: {
      productName: product.productName,
      brands: product.brands,
      nutriments: {
        energy: nutriments.energy,
  energyUnit: nutriments.energyUnit ?? "kJ", 
        fat: nutriments.fat,
        carbohydrates: nutriments.carbs,          
        proteins: nutriments.proteins,
        salt: nutriments.salt
      }
    },
    grams: parseFloat(grams)
  };

  console.log("Payload wysyłany do /add:", body);

  const res = await fetch("http://localhost:5142/api/ProductsOperation/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Błąd dodawania produktu:", errorText);
    throw new Error("Błąd dodawania produktu");
  }

  return await res.text();
}
