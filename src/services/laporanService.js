import { API_BASE_URL, getHeaders } from '@/config/api';
import Cookies from 'js-cookie';

export const laporanService = {
    getAllLaporan: async () => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            // Ambil data pemasukan
            const pemasukanResponse = await fetch(`/api/pemasukan/getall`, {
                method: 'GET',
                headers: {
                    ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });

            // Ambil data pengeluaran
            const pengeluaranResponse = await fetch(`/api/pengeluaran/getall`, {
                method: 'GET',
                headers: {
                    ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });
            
            if (!pemasukanResponse.ok || !pengeluaranResponse.ok) {
                throw new Error('Gagal mengambil data');
            }
            
            const pemasukanData = await pemasukanResponse.json();
            const pengeluaranData = await pengeluaranResponse.json();

            console.log('Raw Pemasukan:', pemasukanData);
            console.log('Raw Pengeluaran:', pengeluaranData);

            // Gabungkan dan urutkan data berdasarkan tanggal
            const combinedData = [
                ...(pemasukanData.data || []).map(item => {
                    console.log('Mapping pemasukan item:', item);
                    return {
                        id: item.id_pemasukan,
                        tanggal: item.tanggal,
                        kategori: 'Pemasukan',
                        keterangan: item.keterangan,
                        pemasukan: parseInt(item.nominal),
                        pengeluaran: 0,
                        jenis: 'pemasukan',
                        total_saldo: 0 // akan dihitung nanti
                    };
                }),
                ...(pengeluaranData.data || []).map(item => {
                    console.log('Mapping pengeluaran item:', item);
                    return {
                        id: item.id_pengeluaran,
                        tanggal: item.tanggal,
                        kategori: 'Pengeluaran',
                        keterangan: item.keterangan,
                        pemasukan: 0,
                        pengeluaran: parseInt(item.nominal),
                        jenis: 'pengeluaran',
                        nota: item.nota,
                        total_saldo: 0 // akan dihitung nanti
                    };
                })
            ].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

            console.log('Combined data before saldo:', combinedData);

            // Hitung saldo berjalan
            let saldo = 0;
            const dataWithSaldo = combinedData.map(item => {
                saldo += (item.pemasukan - item.pengeluaran);
                return {
                    ...item,
                    total_saldo: saldo
                };
            });

            console.log('Final data with saldo:', dataWithSaldo);
            return dataWithSaldo;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },

    addPemasukan: async (data) => {
        try {
            // Validasi tanggal
            if (!data.tanggal || isNaN(Date.parse(data.tanggal))) {
                throw new Error('Format tanggal tidak valid');
            }

            // Validasi nominal
            const nominal = typeof data.nominal === 'string' ? 
                parseInt(data.nominal.replace(/\D/g, '')) : 
                parseInt(data.nominal);

            if (isNaN(nominal) || nominal <= 0) {
                throw new Error('Nominal harus berupa angka positif');
            }

            // Validasi maksimal nominal (11 digit - puluhan milyar)
            if (nominal.toString().length > 11) {
                throw new Error('Nominal terlalu besar (maksimal puluhan milyar)');
            }

            // Validasi kategori
            if (!data.kategori || data.kategori.trim() === '') {
                throw new Error('Kategori tidak boleh kosong');
            }

            // Validasi keterangan
            if (!data.keterangan || data.keterangan.trim() === '') {
                throw new Error('Keterangan tidak boleh kosong');
            }

            // Siapkan data dalam format JSON
            const jsonData = {
                tanggal: data.tanggal,
                nominal: nominal,
                kategori: data.kategori.trim(),
                keterangan: data.keterangan.trim()
            };

            console.log('Sending data:', jsonData);

            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            const response = await fetch('/api/pemasukan/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(jsonData)
            });

            // Log response untuk debugging
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            const responseText = await response.text();
            console.log('Response text:', responseText);

            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch (error) {
                console.error('Error parsing response:', error);
                throw new Error('Format response tidak valid');
            }

            if (!response.ok) {
                throw new Error(responseData.message || 'Gagal menambah pemasukan');
            }

            return responseData;
        } catch (error) {
            console.error('Error in addPemasukan:', error);
            throw error;
        }
    },

    addPengeluaran: async (data) => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            const formData = new FormData();
            formData.append('tanggal', data.tanggal);
            formData.append('nominal', data.nominal);
            formData.append('keterangan', data.keterangan);
            
            // Pastikan ada file nota yang dipilih
            if (!data.nota) {
                throw new Error('Nota harus diupload');
            }
            formData.append('nota', data.nota);

            const response = await fetch(`/api/pengeluaran/add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: formData
            });

            const responseText = await response.text();
            let result;
            
            try {
                result = JSON.parse(responseText);
            } catch (error) {
                console.error('Response text:', responseText);
                throw new Error('Format response tidak valid');
            }

            if (!response.ok) {
                throw new Error(result.message || 'Gagal menambah pengeluaran');
            }

            return result;
        } catch (error) {
            console.error('Error adding pengeluaran:', error);
            throw error;
        }
    },

    addLaporan: async (laporanData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/laporan/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(laporanData),
            });
            if (!response.ok) {
                throw new Error('Failed to add laporan');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding laporan:', error);
            throw error;
        }
    },

    updateLaporan: async (id, data) => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            console.log('Update data:', { id, data });

            // Tentukan endpoint berdasarkan jenis transaksi
            let endpoint = '';
            if (data.jenis === 'pemasukan') {
                endpoint = `/api/pemasukan/update/${id}`;
                
                // Untuk pemasukan, kirim data sebagai JSON
                const jsonData = {
                    tanggal: data.tanggal,
                    nominal: data.nominal,
                    kategori: data.kategori,
                    keterangan: data.keterangan
                };

                console.log('Sending pemasukan update request:', { endpoint, data: jsonData });

                const response = await fetch(endpoint, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: JSON.stringify(jsonData),
                    credentials: 'include'
                });

                console.log('Update response:', {
                    status: response.status,
                    statusText: response.statusText
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal mengupdate data');
                }

                return await response.json();

            } else if (data.jenis === 'pengeluaran') {
                endpoint = `/api/pengeluaran/update/${id}`;
                
                // Untuk pengeluaran, gunakan FormData
                const formData = new FormData();
                formData.append('tanggal', data.tanggal);
                formData.append('nominal', data.nominal);
                formData.append('keterangan', data.keterangan);

                if (data.nota) {
                    formData.append('nota', data.nota);
                }

                console.log('Sending pengeluaran update request:', { endpoint });

                const response = await fetch(endpoint, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'ngrok-skip-browser-warning': 'true'
                    },
                    body: formData,
                    credentials: 'include'
                });

                console.log('Update response:', {
                    status: response.status,
                    statusText: response.statusText
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal mengupdate data');
                }

                return await response.json();
            } else {
                throw new Error('Jenis transaksi tidak valid');
            }
        } catch (error) {
            console.error('Error updating data:', error);
            throw error;
        }
    },

    deleteLaporan: async (id, jenis) => {
        try {
            const token = Cookies.get('authToken');
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            // Validasi parameter
            if (!id) {
                console.error('ID tidak ditemukan:', { id, jenis });
                throw new Error('ID tidak valid');
            }

            if (!jenis) {
                console.error('Jenis transaksi tidak ditemukan:', { id, jenis });
                throw new Error(`Jenis transaksi tidak ditemukan untuk ID: ${id}`);
            }

            // Normalize jenis to lowercase and remove spaces
            const jenisLower = jenis.toLowerCase().trim();
            console.log('Data untuk delete:', { id, jenis, jenisLower });

            let endpoint = '';
            // Cek jenis transaksi
            if (jenisLower === 'pemasukan') {
                endpoint = `/api/pemasukan/delete/${id}`;
            } else if (jenisLower === 'pengeluaran') {
                endpoint = `/api/pengeluaran/delete/${id}`;
            } else {
                console.error('Jenis transaksi tidak valid:', { original: jenis, normalized: jenisLower });
                throw new Error(`Jenis transaksi tidak valid: ${jenis} (harus 'pemasukan' atau 'pengeluaran')`);
            }

            console.log('Mengirim request delete:', { endpoint, id, jenis: jenisLower });

            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    ...getHeaders(token),
                    'ngrok-skip-browser-warning': 'true'
                },
                credentials: 'include'
            });

            console.log('Delete response:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    errorData = { message: errorText };
                }
                throw new Error(errorData.message || 'Gagal menghapus data');
            }

            const responseText = await response.text();
            console.log('Success response:', responseText);
            
            let data;
            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                console.warn('Could not parse response as JSON:', responseText);
                data = {};
            }
            
            return data;
        } catch (error) {
            console.error('Error in deleteLaporan:', error);
            throw error;
        }
    }
}; 