import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, Paper, Button, Divider, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Chip, IconButton, CircularProgress, InputAdornment } from '@mui/material';
import { Save, ArrowBack, Add, Delete, CloudUpload, Image } from '@mui/icons-material';
import { createProduct, updateProduct, getProductDetails } from '../../redux/slices/productSlice';
import { toast } from 'react-toastify';
import Spinner from '../../components/layout/Spinner';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector(state => state.auth);
  const { product, loading, error } = useSelector(state => state.products);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    countInStock: '',
    unit: 'kg',
    tags: [],
    images: []
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const isEditMode = Boolean(id);
  
  useEffect(() => {
    if (isEditMode) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id, isEditMode]);
  
  useEffect(() => {
    if (isEditMode && product && product._id === id) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        countInStock: product.countInStock || '',
        unit: product.unit || 'kg',
        tags: product.tags || [],
        images: product.images || []
      });
      
      setImagePreviewUrls(product.images || []);
    }
  }, [isEditMode, product, id]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image file`);
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} exceeds the maximum file size of 5MB`);
      }
      
      return isValidType && isValidSize;
    });
    
    if (validFiles.length === 0) return;
    
    // Update image files
    setImageFiles(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  const handleRemoveImage = (index) => {
    // If it's an existing image from the server
    if (index < formData.images.length) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
    
    // If it's a new image being added
    if (index >= formData.images.length) {
      const newImageIndex = index - formData.images.length;
      
      setImageFiles(prev => prev.filter((_, i) => i !== newImageIndex));
    }
    
    // Remove from preview URLs
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    if (formData.tags.includes(tagInput.trim())) {
      toast.info('Tag already exists');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()]
    }));
    
    setTagInput('');
  };
  
  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.countInStock) {
      newErrors.countInStock = 'Stock quantity is required';
    } else if (isNaN(formData.countInStock) || parseInt(formData.countInStock) < 0) {
      newErrors.countInStock = 'Stock quantity must be a non-negative number';
    }
    
    if (!formData.unit) {
      newErrors.unit = 'Unit is required';
    }
    
    if (imagePreviewUrls.length === 0) {
      newErrors.images = 'At least one product image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Append text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('countInStock', formData.countInStock);
      formDataToSend.append('unit', formData.unit);
      
      // Append tags as JSON string
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      
      // Append existing images
      if (isEditMode) {
        formDataToSend.append('existingImages', JSON.stringify(formData.images));
      }
      
      // Append new image files
      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });
      
      let resultAction;
      
      if (isEditMode) {
        resultAction = await dispatch(updateProduct({ id, formData: formDataToSend }));
      } else {
        resultAction = await dispatch(createProduct(formDataToSend));
      }
      
      if (createProduct.fulfilled.match(resultAction) || updateProduct.fulfilled.match(resultAction)) {
        toast.success(`Product ${isEditMode ? 'updated' : 'created'} successfully`);
        navigate(isEditMode ? `/products/${id}` : '/seller/products');
      } else {
        throw new Error(resultAction.error.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (user?.role !== 'seller') {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Seller Access Required
        </Typography>
        <Typography variant="body1" paragraph>
          You need a seller account to access this page.
        </Typography>
        <Button
          variant="contained"
          component="a"
          href="/profile"
        >
          Go to Profile
        </Button>
      </Container>
    );
  }
  
  if (isEditMode && loading && !product) {
    return <Spinner />;
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={Boolean(errors.name)}
                helperText={errors.name}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                error={Boolean(errors.description)}
                helperText={errors.description}
                margin="normal"
                multiline
                rows={4}
                required
              />
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    error={Boolean(errors.price)}
                    helperText={errors.price}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={Boolean(errors.category)} required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      label="Category"
                    >
                      <MenuItem value="">Select Category</MenuItem>
                      <MenuItem value="vegetables">Vegetables</MenuItem>
                      <MenuItem value="fruits">Fruits</MenuItem>
                      <MenuItem value="grains">Grains</MenuItem>
                      <MenuItem value="pulses">Pulses</MenuItem>
                      <MenuItem value="dairy">Dairy</MenuItem>
                      <MenuItem value="spices">Spices</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                    {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                  </FormControl>
                </Grid>
              </Grid>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Stock Quantity"
                    name="countInStock"
                    type="number"
                    value={formData.countInStock}
                    onChange={handleInputChange}
                    error={Boolean(errors.countInStock)}
                    helperText={errors.countInStock}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={Boolean(errors.unit)} required>
                    <InputLabel>Unit</InputLabel>
                    <Select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      label="Unit"
                    >
                      <MenuItem value="kg">Kilogram (kg)</MenuItem>
                      <MenuItem value="g">Gram (g)</MenuItem>
                      <MenuItem value="l">Liter (l)</MenuItem>
                      <MenuItem value="ml">Milliliter (ml)</MenuItem>
                      <MenuItem value="piece">Piece</MenuItem>
                      <MenuItem value="dozen">Dozen</MenuItem>
                      <MenuItem value="packet">Packet</MenuItem>
                    </Select>
                    {errors.unit && <FormHelperText>{errors.unit}</FormHelperText>}
                  </FormControl>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    label="Add Tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    sx={{ flexGrow: 1, mr: 1 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                    />
                  ))}
                  {formData.tags.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No tags added yet. Tags help buyers find your product.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Product Images
              </Typography>
              
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 2,
                  border: errors.images ? '1px solid #d32f2f' : '1px dashed rgba(0, 0, 0, 0.12)',
                  borderRadius: 1,
                  textAlign: 'center'
                }}
              >
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="product-image-upload"
                  type="file"
                  multiple
                  onChange={handleImageChange}
                />
                <label htmlFor="product-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    fullWidth
                  >
                    Upload Images
                  </Button>
                </label>
                
                {errors.images && (
                  <FormHelperText error>{errors.images}</FormHelperText>
                )}
                
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Upload up to 5 images (max 5MB each)
                </Typography>
              </Paper>
              
              <Box sx={{ mb: 3 }}>
                {imagePreviewUrls.length > 0 ? (
                  <Grid container spacing={1}>
                    {imagePreviewUrls.map((url, index) => (
                      <Grid item xs={6} key={index}>
                        <Box
                          sx={{
                            position: 'relative',
                            pt: '100%',
                            border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: 1,
                            overflow: 'hidden'
                          }}
                        >
                          <Box
                            component="img"
                            src={url}
                            alt={`Product image ${index + 1}`}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              bgcolor: 'rgba(255, 255, 255, 0.7)',
                              '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                              }
                            }}
                            onClick={() => handleRemoveImage(index)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 3,
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                      borderRadius: 1
                    }}
                  >
                    <Image sx={{ fontSize: 60, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      No images uploaded yet
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                disabled={submitting}
              >
                {submitting
                  ? (isEditMode ? 'Updating...' : 'Creating...')
                  : (isEditMode ? 'Update Product' : 'Create Product')}
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={() => navigate(-1)}
                sx={{ mt: 2 }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ProductForm;