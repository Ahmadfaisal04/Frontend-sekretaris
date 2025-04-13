import { API_BASE_URL, API_ENDPOINTS, getHeaders } from '@/config/api';
import Cookies from 'js-cookie';

export const authService = {
    login: async (username, password) => {
        try {
            // Log request untuk debugging
            console.log('Sending login request with:', {
                nik: username,
                password: password
            });

            // Kirim request login ke API route lokal
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            // Log response untuk debugging
            console.log('Response status:', response.status);
            
            // Parse response
            const responseData = await response.json();
            console.log('Response data:', responseData);

            // Jika login gagal
            if (!response.ok || !responseData.success) {
                return {
                    success: false,
                    error: responseData.error || responseData.message || 'Login gagal'
                };
            }

            // Jika login berhasil
            const { token, user } = responseData.data;
            
            // Simpan token di cookies dengan expiry 1 hari
            Cookies.set('authToken', token, { expires: 1 });
            
            // Simpan user data di localStorage
            localStorage.setItem('user', JSON.stringify(user));

            return {
                success: true,
                data: {
                    token,
                    user
                }
            };

        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: 'Terjadi kesalahan saat login. Silakan coba lagi.'
            };
        }
    },

    validateToken: async (token) => {
        try {
            const response = await fetch(API_ENDPOINTS.ADMIN_LOGIN, {
                method: 'GET',
                headers: getHeaders(token)
            });

            return response.ok;
        } catch (error) {
            console.error('Validate token error:', error);
            return false;
        }
    }
}; 