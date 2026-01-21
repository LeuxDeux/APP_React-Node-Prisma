import api from './api';

export const productsAPI = {
    getAllProducts: () =>  api.get('products/'),
    
    getProductByID:(id) => api.get(`products/${id}`),
    
    createProduct: (productData) => api.post('products/', productData),
    
    updateProduct: (id, productData) => api.put(`products/${id}`, productData),
    
    deleteProductByID: (id) =>  api.delete(`products/${id}`),
}