import React, { useState, useCallback } from 'react';
import { Box, Typography, List, ListItem, Button, Stack } from '@mui/material';
import ProductModal from '../../components/ProductModal'; 
import DateSearch from '../../components/DateSearch';



function ProductItem({ logs = [], onDelete, onProductUpdated, selectedDate, setSelectedDate }) {
  const [modalMode, setModalMode] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setModalMode('edit');
  };

  const openAddModal = () => {
    setSelectedProduct(null);
    setModalMode('add');
  };

  const handleModalClose = () => {
    setModalMode(null);
    setSelectedProduct(null);
  };

  const handleProductUpdated = () => {
    handleModalClose();
    if (onProductUpdated) onProductUpdated();
  };

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
  }, [setSelectedDate]);
  return (

    <Box
  sx={{
    height: '70vh', 
    display: 'flex',
    flexDirection: 'column',
    p: 2,
  }}
>
  <Typography variant="h5" gutterBottom>
    Ostatnie produkty
  </Typography>

<DateSearch selectedDate={selectedDate} onSearch={handleDateChange} />
  <List
    sx={{
      flex: 1,
      overflowY: 'auto',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1,
      mb: 2, 
    }}
  >
    {logs.map((log) => (
      <ListItem
        key={log.id}
        sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}
      >
        <Typography variant="subtitle1" fontWeight="bold">{log.productName}</Typography>
        <Typography variant="body2">Ilość: {log.grams} g</Typography>
        <Typography variant="body2">Energia: {parseFloat(log.energy).toFixed(2)} {log.energyUnit || 'kcal'}</Typography>
        <Typography variant="body2">Tłuszcze: {parseFloat(log.fat).toFixed(2)} g</Typography>
        <Typography variant="body2">Węglowodany: {parseFloat(log.sugars).toFixed(2)} g</Typography>
        <Typography variant="body2">Białko: {parseFloat(log.proteins).toFixed(2)} g</Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>
          {log.brands}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" color="primary" onClick={() => openEditModal(log)}>Edytuj</Button>
          <Button variant="outlined" color="error" onClick={() => onDelete(log.id)}>Usuń</Button>
        </Stack>
      </ListItem>
    ))}
  </List>

  <Box>
    <Button variant="contained" onClick={openAddModal}>
      Dodaj nowy produkt
    </Button>
  </Box>

  {modalMode && (
    <ProductModal
      mode={modalMode}
      product={selectedProduct}
      onClose={handleModalClose}
      onUpdated={handleProductUpdated}
    />
  )}
</Box>

  );
}


export default ProductItem;
