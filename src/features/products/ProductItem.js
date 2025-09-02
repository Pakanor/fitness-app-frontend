import React, { useState } from 'react';
import { Box, Typography, List, ListItem, Button, Stack } from '@mui/material';
import ProductModal from '../../components/ProductModal'; 
import DateSearch from '../../components/DateSearch';


function ProductItem({ logs=[], onDelete, onProductUpdated }) {
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

  return (

    <Box
  sx={{
    height: '70vh', // zmniejszone z 85vh
    display: 'flex',
    flexDirection: 'column',
    p: 2,
  }}
>
  <Typography variant="h5" gutterBottom>
    Ostatnie produkty
  </Typography>

  <DateSearch onSearch={onProductUpdated} />

  <List
    sx={{
      flex: 1,
      overflowY: 'auto',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1,
      mb: 2, // dodaje odrobinę odstępu pod listą
    }}
  >
    {logs.map((log) => (
      <ListItem
        key={log.id}
        sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}
      >
        <Typography variant="subtitle1" fontWeight="bold">{log.productName}</Typography>
        <Typography variant="body2">Ilość: {log.grams} g</Typography>
        <Typography variant="body2">Energia: {log.energy} {log.energyUnit || 'kcal'}</Typography>
        <Typography variant="body2">Tłuszcze: {log.fat} g</Typography>
        <Typography variant="body2">Węglowodany: {log.sugars} g</Typography>
        <Typography variant="body2">Białko: {log.proteins} g</Typography>
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
