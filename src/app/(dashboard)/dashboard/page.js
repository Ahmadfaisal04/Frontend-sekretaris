'use client';

import {
  Box,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Card } from '@/components/ui/card';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import SendIcon from '@mui/icons-material/Send';
import SearchHistory from '@/components/dashboard/search-history';
import { useState, useEffect } from 'react';
import { API_ENDPOINTS, getHeaders } from '@/config/api';

// Buat tema MUI
const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
});

// Styled Components
const StyledCard = styled(Card)`
  background: ${({ variant }) => {
    const gradients = {
      blue: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
      green: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
      red: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
    };
    return gradients[variant] || gradients.blue;
  }};
  border-radius: 16px;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
  color: white;
  position: relative;
  overflow: hidden;
  min-height: 140px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.2) 0%, transparent 60%);
    opacity: 0.6;
    z-index: 1;
  }
`;

const IconWrapper = styled(Box)`
  position: absolute;
  right: -20px;
  bottom: -20px;
  opacity: 0.2;
  z-index: 0;
`;

const ContentWrapper = styled(Box)`
  position: relative;
  z-index: 2;
  padding: 24px;
`;

export default function Dashboard() {
  const [daftarSurat, setDaftarSurat] = useState([]);
  const [filteredDaftarSurat, setFilteredDaftarSurat] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalSuratMasuk, setTotalSuratMasuk] = useState(0);
  const [totalSuratKeluar, setTotalSuratKeluar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuratMasuk = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SURAT_MASUK_GET_ALL, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error('Gagal mengambil data surat masuk');
      return await response.json();
    } catch (error) {
      console.error('Error fetching surat masuk:', error);
      throw error;
    }
  };

  const fetchSuratKeluar = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SURAT_KELUAR_GET_ALL, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error('Gagal mengambil data surat keluar');
      return await response.json();
    } catch (error) {
      console.error('Error fetching surat keluar:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [dataMasuk, dataKeluar] = await Promise.all([
          fetchSuratMasuk(),
          fetchSuratKeluar(),
        ]);

        const masukWithType = dataMasuk.map((item) => ({
          ...item,
          jenisSurat: 'masuk',
        }));
        const keluarWithType = dataKeluar.map((item) => ({
          ...item,
          jenisSurat: 'keluar',
        }));

        const combined = [...masukWithType, ...keluarWithType];
        setDaftarSurat(combined);
        setFilteredDaftarSurat(combined);

        setTotalSuratMasuk(dataMasuk.length);
        setTotalSuratKeluar(dataKeluar.length);
      } catch (error) {
        setError(error.message || 'Gagal mengambil data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = daftarSurat.filter(
      (item) =>
        item.perihal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.jenisSurat?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tanggalSurat?.includes(searchQuery)
    );
    setFilteredDaftarSurat(filtered);
  }, [searchQuery, daftarSurat]);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, padding: { xs: 2, sm: 3, md: 4 } }}>
        {/* Welcome */}
        <StyledCard variant="blue">
          <ContentWrapper>
            <Typography variant="h3" component="div" sx={{ fontWeight: 700, fontSize: { xs: '1.8rem', sm: '2.4rem' }, mb: 2 }}>
              Selamat Datang di Sistem Persuratan Desa
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Kelola persuratan desa dengan lebih mudah dan efisien
            </Typography>
          </ContentWrapper>
          <IconWrapper>
            <MarkEmailReadIcon sx={{ fontSize: '180px' }} />
          </IconWrapper>
        </StyledCard>

        {/* Statistik Surat */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <StyledCard variant="green">
              <ContentWrapper>
                <Typography variant="h6">Total Surat Masuk</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {totalSuratMasuk}
                </Typography>
              </ContentWrapper>
              <IconWrapper>
                <MarkEmailReadIcon sx={{ fontSize: '150px' }} />
              </IconWrapper>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={6}>
            <StyledCard variant="red">
              <ContentWrapper>
                <Typography variant="h6">Total Surat Keluar</Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {totalSuratKeluar}
                </Typography>
              </ContentWrapper>
              <IconWrapper>
                <SendIcon sx={{ fontSize: '150px' }} />
              </IconWrapper>
            </StyledCard>
          </Grid>
        </Grid>

        {/* Riwayat Surat */}

      </Box>
    </ThemeProvider>
  );
}
