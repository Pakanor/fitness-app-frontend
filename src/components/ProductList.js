import React, { useState } from 'react';
import { Box, Typography, List, ListItem, Button, Link, Stack } from '@mui/material';
import EditProductModal from './EditProductModal'; // importuj swój komponent modala

function ProductList({ logs, onDelete, onProductUpdated }) {
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
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
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Ostatnie produkty
      </Typography>

      <List
        sx={{
          flex: 1,
          overflowY: 'auto',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      >
        {logs.map((log) => (
          <ListItem
            key={log.id}
            sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}
          >
            <Typography variant="subtitle1">{log.productName}</Typography>
            <Typography variant="subtitle1">{log.grams}</Typography>

            <Typography variant="body2" color="text.secondary" mb={1}>
              {log.brands}
            </Typography>
            <Stack direction="row" spacing={1}>
              {/* Tu zmiana: używaj openEditModal */}
              <Button variant="outlined" color="primary" onClick={() => openEditModal(log)}>
                Edytuj
              </Button>
              <Button variant="outlined" color="error" onClick={() => onDelete(log.id)}>
                Usuń
              </Button>
            </Stack>
          </ListItem>
        ))}
      </List>

      <Box mt={2}>
        <Button variant="contained" onClick={openAddModal}>
          Dodaj nowy produkt
        </Button>
      </Box>

      {/* Modal pokazuj, gdy modalMode jest ustawione */}
      {modalMode && (
        <EditProductModal
          mode={modalMode}
          product={selectedProduct}
          onClose={handleModalClose}
          onUpdated={handleProductUpdated}
        />
      )}
    </Box>
  );
}


export default ProductList;
