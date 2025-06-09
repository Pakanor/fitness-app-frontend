import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProductForm from '../features/products/ProductForm';

function ProductModal({ product, mode, onClose, onUpdated }) {
  return (
    <Modal open={true} onClose={onClose} aria-labelledby="modal-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          width: 600,
          maxHeight: '85vh',
          overflowY: 'auto',
          borderRadius: 2,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <ProductForm
          mode={mode}
          initialData={product}
          onSuccess={() => {
            onUpdated();
            onClose();
          }}
        />
      </Box>
    </Modal>
  );
}

export default ProductModal;
