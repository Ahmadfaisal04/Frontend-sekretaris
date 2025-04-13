'use client';

export const API_BASE_URL = "https://api.example.com"; // Replace with your actual API base URL


export const API_ENDPOINTS = {
    // Surat Keluar endpoints
    SURAT_KELUAR_ADD: `${API_BASE_URL}/suratkeluar`,
    SURAT_KELUAR_GET_ALL: `${API_BASE_URL}/suratkeluar`,
    SURAT_KELUAR_GET_BY_ID: (id) => `${API_BASE_URL}/suratkeluar/get/${id}`,
    SURAT_KELUAR_UPDATE: (id) => `${API_BASE_URL}/suratkeluar/${id}`,
    SURAT_KELUAR_DELETE: (id) => `${API_BASE_URL}/suratkeluar/delete/${id}`,
    SURAT_KELUAR_COUNT: `${API_BASE_URL}/suratkeluar/count`,

    // Surat Masuk endpoints
    SURAT_MASUK_ADD: `${API_BASE_URL}/suratmasuk`,
    SURAT_MASUK_GET_ALL: `${API_BASE_URL}/suratmasuk`,
    SURAT_MASUK_GET_BY_ID: (id) => `${API_BASE_URL}/suratmasuk/get/${id}`,
    SURAT_MASUK_UPDATE: (id) => `${API_BASE_URL}/suratmasuk/update/${id}`,
    SURAT_MASUK_DELETE: (id) => `${API_BASE_URL}/suratmasuk/delete/${id}`,
    SURAT_MASUK_COUNT: `${API_BASE_URL}/suratmasuk/count`,
};

export const getHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

   
    return headers;
};