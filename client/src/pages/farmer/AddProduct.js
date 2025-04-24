import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct } from '../../redux/slices/productSlice';
import { toast } from 'react-toastify';
import { Container, Typography, Box, Paper, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Chip, IconButton, FormHelperText, Divider } from '@mui/material';
import { CloudUpload, Add, Delete, ArrowBack } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Spinner from '../../components/layout/Spinner';

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.product);
  const { user } = useSelector(state => state.auth);
  
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  
  // Categories and subcategories
  const categories = [
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'others', label: 'Others' }
  ];
  
  const subCategories = {
    vegetables: [
      { value: 'leafy', label: 'Leafy Vegetables' },
      { value: 'root', label: 'Root Vegetables' },
      { value: 'allium', label: 'Allium Vegetables' },
      { value: 'cruciferous', label: 'Cruciferous Vegetables' },
      { value: 'marrow', label: 'Marrow Vegetables' }
    ],
    fruits: [
      { value: 'tropical', label: 'Tropical Fruits' },
      { value: 'citrus', label: 'Citrus Fruits' },
      { value: 'berries', label: 'Berries' },
      { value: 'melons', label: 'Melons' },
      { value: 'stone', label: 'Stone Fruits' }
    ],
    grains: [
      { value: 'rice', label: 'Rice' },
      { value: 'wheat', label: 'Wheat' },
      { value: 'maize', label: 'Maize/Corn' },
      { value: 'millets', label: 'Millets' },
      { value: 'pulses', label: 'Pulses' }
    ],
    dairy: [
      { value: 'milk', label: 'Milk' },
      { value: 'cheese', label: 'Cheese' },
      { value: 'butter', label: 'Butter' },
      { value: 'yogurt', label: 'Yogurt' }
    ],
    others: [
      { value: 'spices', label: 'Spices' },
      { value: 'nuts', label: 'Nuts' },
      { value: 'honey', label: 'Honey' },
      { value: 'oils', label: 'Oils' }
    ]
  };
  
  // Units
  const units = [
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'g', label: 'Gram (g)' },
    { value: 'l', label: 'Liter (l)' },
    { value: 'ml', label: 'Milliliter (ml)' },
    { value: 'piece', label: 'Piece' },
    { value: 'dozen', label: 'Dozen' },
    { value: 'quintal', label: 'Quintal' },
    { value: 'ton', label: 'Ton' }
  ];
  
  // Cultivation methods
  const cultivationMethods = [
    { value: 'traditional', label: 'Traditional' },
    { value: 'organic', label: 'Organic' },
    { value: 'hydroponics', label: 'Hydroponics' },
    { value: 'permaculture', label: 'Permaculture' },
    { value: 'biodynamic', label: 'Biodynamic' }
  ];
  
  // Certifications
  const certificationOptions = [
    { value: 'organic', label: 'Organic Certified' },
    { value: 'fairtrade', label: 'Fair Trade' },
    { value: 'nonGMO', label: 'Non-GMO' },
    { value: 'pesticide-free', label: 'Pesticide-Free' },
    { value: 'rainforest-alliance', label: 'Rainforest Alliance' }
  ];
  
  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Limit to 5 images
      if (selectedImages.length + filesArray.length > 5) {
        toast.warning('You can upload a maximum of 5 images');
        return;
      }
      
      setSelectedImages([...selectedImages, ...filesArray]);
      
      const imagesPreview = filesArray.map(file => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...imagesPreview]);
      
      formik.setFieldValue('images', [...selectedImages, ...filesArray]);
    }
  };
  
  // Remove image
  const removeImage = (index) => {
    const newSelectedImages = [...selectedImages];
    const newPreviewImages = [...previewImages];
    
    newSelectedImages.splice(index, 1);
    newPreviewImages.splice(index, 1);
    
    setSelectedImages(newSelectedImages);
    setPreviewImages(newPreviewImages);
    formik.setFieldValue('images', newSelectedImages);
  };
  
  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      stock: '',
      unit: 'kg',
      category: '',
      subCategory: '',
      isOrganic: false,
      cultivationMethod: '',
      certifications: [],
      harvestDate: '',
      shelfLife: '',
      location: {
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        country: 'India'
      },
      images: []
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Product name is required')
        .max(100, 'Name must be 100 characters or less'),
      description: Yup.string()
        .required('Description is required')
        .min(20, 'Description must be at least 20 characters'),
      price: Yup.number()
        .required('Price is required')
        .positive('Price must be positive'),
      stock: Yup.number()
        .required('Stock quantity is required')
        .integer('Stock must be a whole number')
        .positive('Stock must be positive'),
      unit: Yup.string()
        .required('Unit is required'),
      category: Yup.string()
        .required('Category is required'),
      subCategory: Yup.string()
        .when('category', {
          is: (val) => val && val.length > 0,
          then: Yup.string().required('Sub-category is required')
        }),
      cultivationMethod: Yup.string()
        .required('Cultivation method is required'),
      harvestDate: Yup.date()
        .required('Harvest date is required')
        .max(new Date(), 'Harvest date cannot be in the future'),
      shelfLife: Yup.string()
        .required('Shelf life is required'),
      'location.city': Yup.string()
        .required('City is required'),
      'location.state': Yup.string()
        .required('State is required'),
      images: Yup.array()
        .min(1, 'At least one image is required')
      }),
      onSubmit: async (values) => {
        try {
          // Create FormData for image upload
          const formData = new FormData();
          
          // Append product data
          Object.keys(values).forEach(key => {
            if (key !== 'images' && key !== 'location') {
              formData.append(key, values[key]);
            }
          });
          
          // Append location data
          formData.append('location[city]', values.location.city);
          formData.append('location[state]', values.location.state);
          formData.append('location[country]', values.location.country);
          
          // Append images
          selectedImages.forEach(image => {
            formData.append('images', image);
          });
          
          // Dispatch action to add product
          await dispatch(addProduct(formData)).unwrap();
          
          toast.success('Product added successfully!');
          navigate('/my-products');
        } catch (error) {
          toast.error(error || 'Failed to add product');
        }
      }
      });
      
      if (loading) {
        return <Spinner />;
      }
      
      return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={() => navigate(-1)} 
            sx={{ mb: 3 }}
          >
            Back
          </Button>
          
          <Typography variant="h4" gutterBottom>
            Add New Product
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            List your crop or agricultural product for sale
          </Typography>
          
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box component="form" onSubmit={formik.handleSubmit}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Product Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Product Description"
                    multiline
                    rows={4}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="price"
                    name="price"
                    label="Price (₹)"
                    type="number"
                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.price && Boolean(formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="unit-label">Unit</InputLabel>
                    <Select
                      labelId="unit-label"
                      id="unit"
                      name="unit"
                      value={formik.values.unit}
                      label="Unit"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.unit && Boolean(formik.errors.unit)}
                    >
                      {units.map(unit => (
                        <MenuItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.unit && formik.errors.unit && (
                      <FormHelperText error>{formik.errors.unit}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="stock"
                    name="stock"
                    label="Available Stock"
                    type="number"
                    InputProps={{ inputProps: { min: 0, step: 1 } }}
                    value={formik.values.stock}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.stock && Boolean(formik.errors.stock)}
                    helperText={formik.touched.stock && formik.errors.stock}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="harvestDate"
                    name="harvestDate"
                    label="Harvest Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formik.values.harvestDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.harvestDate && Boolean(formik.errors.harvestDate)}
                    helperText={formik.touched.harvestDate && formik.errors.harvestDate}
                  />
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Category & Classification
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      name="category"
                      value={formik.values.category}
                      label="Category"
                      onChange={(e) => {
                        formik.setFieldValue('category', e.target.value);
                        formik.setFieldValue('subCategory', '');
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.category && Boolean(formik.errors.category)}
                    >
                      {categories.map(category => (
                        <MenuItem key={category.value} value={category.value}>
                          {category.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.category && formik.errors.category && (
                      <FormHelperText error>{formik.errors.category}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!formik.values.category}>
                    <InputLabel id="subCategory-label">Sub-Category</InputLabel>
                    <Select
                      labelId="subCategory-label"
                      id="subCategory"
                      name="subCategory"
                      value={formik.values.subCategory}
                      label="Sub-Category"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.subCategory && Boolean(formik.errors.subCategory)}
                    >
                      {formik.values.category && subCategories[formik.values.category]?.map(subCategory => (
                        <MenuItem key={subCategory.value} value={subCategory.value}>
                          {subCategory.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.subCategory && formik.errors.subCategory && (
                      <FormHelperText error>{formik.errors.subCategory}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="cultivationMethod-label">Cultivation Method</InputLabel>
                    <Select
                      labelId="cultivationMethod-label"
                      id="cultivationMethod"
                      name="cultivationMethod"
                      value={formik.values.cultivationMethod}
                      label="Cultivation Method"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.cultivationMethod && Boolean(formik.errors.cultivationMethod)}
                    >
                      {cultivationMethods.map(method => (
                        <MenuItem key={method.value} value={method.value}>
                          {method.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.cultivationMethod && formik.errors.cultivationMethod && (
                      <FormHelperText error>{formik.errors.cultivationMethod}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="shelfLife"
                    name="shelfLife"
                    label="Shelf Life"
                    placeholder="e.g., 7 days, 2 weeks"
                    value={formik.values.shelfLife}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.shelfLife && Boolean(formik.errors.shelfLife)}
                    helperText={formik.touched.shelfLife && formik.errors.shelfLife}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="isOrganic"
                        name="isOrganic"
                        checked={formik.values.isOrganic}
                        onChange={formik.handleChange}
                        color="primary"
                      />
                    }
                    label="This product is organically grown"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Certifications (if any)
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {certificationOptions.map(cert => (
                      <Chip
                        key={cert.value}
                        label={cert.label}
                        onClick={() => {
                          const currentCerts = [...formik.values.certifications];
                          if (currentCerts.includes(cert.value)) {
                            formik.setFieldValue(
                              'certifications',
                              currentCerts.filter(c => c !== cert.value)
                            );
                          } else {
                            formik.setFieldValue('certifications', [...currentCerts, cert.value]);
                          }
                        }}
                        color={formik.values.certifications.includes(cert.value) ? 'primary' : 'default'}
                        variant={formik.values.certifications.includes(cert.value) ? 'filled' : 'outlined'}
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Location
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="location.city"
                    name="location.city"
                    label="City"
                    value={formik.values.location.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.location?.city && Boolean(formik.errors.location?.city)}
                    helperText={formik.touched.location?.city && formik.errors.location?.city}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="location.state"
                    name="location.state"
                    label="State"
                    value={formik.values.location.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.location?.state && Boolean(formik.errors.location?.state)}
                    helperText={formik.touched.location?.state && formik.errors.location?.state}
                  />
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Product Images
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUpload />}
                >
                  Upload Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
                {formik.touched.images && formik.errors.images && (
                  <FormHelperText error>{formik.errors.images}</FormHelperText>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                {previewImages.map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      width: 100,
                      height: 100,
                      border: '1px solid #ddd',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bgcolor: 'rgba(255, 255, 255, 0.7)'
                      }}
                      onClick={() => removeImage(index)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                {previewImages.length < 5 && (
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      border: '1px dashed #ddd',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                    component="label"
                  >
                    <Add />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handleImageChange}
                    />
                  </Box>
                )}
              </Box>
              
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  Add Product
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
    );
    };
    
    export default AddProduct;