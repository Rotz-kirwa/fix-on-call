import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

export const servicesAPI = {
  requestService: (data: any) => api.post('/services/request', data),
  getAvailableMechanics: (params: any) => api.get('/services/available-mechanics', { params }),
  assignService: (serviceId: string, data: any) => api.post(`/services/${serviceId}/assign`, data),
  updateServiceStatus: (serviceId: string, data: any) => api.put(`/services/${serviceId}/status`, data),
  getServiceHistory: (params?: any) => api.get('/services/history', { params }),
};

export const bookingsAPI = {
  createBooking: (data: any) => api.post('/bookings/create', data),
  getBooking: (bookingId: string) => api.get(`/bookings/${bookingId}`),
  cancelBooking: (bookingId: string, data?: any) => api.post(`/bookings/${bookingId}/cancel`, data),
  getMyBookings: (params?: any) => api.get('/bookings/my-bookings', { params }),
};

export const notificationsAPI = {
  sendNotification: (data: any) => api.post('/notifications/send', data),
  getMyNotifications: (params?: any) => api.get('/notifications/my-notifications', { params }),
  markAsRead: (notificationId: string) => api.post(`/notifications/mark-read/${notificationId}`),
  markAllAsRead: () => api.post('/notifications/mark-all-read'),
};

export const paymentsAPI = {
  createPayment: (data: any) => api.post('/payments/create', data),
  getPayment: (paymentId: string) => api.get(`/payments/${paymentId}`),
  updatePaymentStatus: (paymentId: string, data: any) => api.put(`/payments/${paymentId}/status`, data),
  getPaymentByService: (serviceId: string) => api.get(`/payments/service/${serviceId}`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  toggleUserActive: (userId: string) => api.post(`/admin/users/${userId}/toggle-active`),
  getServices: (params?: any) => api.get('/admin/services', { params }),
};

export default api;
