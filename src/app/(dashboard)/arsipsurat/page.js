'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Chip,
  TablePagination,
  TextField,
  InputAdornment,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Card } from '@/components/ui/card';
import ArchiveIcon from '@mui/icons-material/Archive';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { API_ENDPOINTS, getHeaders } from '@/config/api';

// Tema
const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
});

// Styled Components
const StyledCard = styled(Card)`
  background: linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%);
  border-radius: 16px;
  color: white;
  position: relative;
  overflow: hidden;
  min-height: 140px;
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

export default function ArsipSurat() {
  const [arsipSurat, setArsipSurat] = useState([]);
  const [filteredArsip, setFilteredArsip] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const fetchArsip = async () => {
    try {
      const [resMasuk, resKeluar] = await Promise.all([
        fetch(API_ENDPOINTS.SURAT_MASUK_GET_ALL, { headers: getHeaders() }),
        fetch(API_ENDPOINTS.SURAT_KELUAR_GET_ALL, { headers: getHeaders() }),
      ]);

      if (!resMasuk.ok || !resKeluar.ok) throw new Error('Gagal mengambil data arsip');

      const dataMasuk = await resMasuk.json();
      const dataKeluar = await resKeluar.json();

      const masuk = dataMasuk.map((s) => ({ ...s, jenisSurat: 'masuk' }));
      const keluar = dataKeluar.map((s) => ({ ...s, jenisSurat: 'keluar' }));

      const combined = [...masuk, ...keluar].sort(
        (a, b) => new Date(b.tanggalSurat) - new Date(a.tanggalSurat)
      );

      setArsipSurat(combined);
      setFilteredArsip(combined);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchArsip();
  }, []);

  useEffect(() => {
    const filtered = arsipSurat.filter(
      (item) =>
        item.perihal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tanggalSurat?.includes(searchQuery)
    );
    setFilteredArsip(filtered);
    setPage(0); // Reset ke halaman pertama setelah pencarian
  }, [searchQuery, arsipSurat]);

  const handleSearch = (value) => setSearchQuery(value);
  const handleChangePage = (event, newPage) => setPage(newPage);

  const getJenisChip = (jenis) =>
    jenis === 'masuk' ? (
      <Chip label="Surat Masuk" color="success" size="small" />
    ) : (
      <Chip label="Surat Keluar" color="error" size="small" />
    );

  const paginatedData = filteredArsip.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Header */}
        <StyledCard>
          <ContentWrapper>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Arsip Surat
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Lihat seluruh arsip surat masuk dan keluar dalam bentuk tabel yang rapi
            </Typography>
          </ContentWrapper>
          <IconWrapper>
            <ArchiveIcon sx={{ fontSize: 180 }} />
          </IconWrapper>
        </StyledCard>

        {/* Search Input */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Cari berdasarkan perihal atau tanggal surat..."
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Table */}
        {loading ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                
                  <TableCell><strong>Nomor Surat</strong></TableCell>
                  <TableCell><strong>Tanggal Surat</strong></TableCell>
                  <TableCell><strong>Perihal</strong></TableCell>
                  <TableCell><strong>Jenis</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Tidak ada arsip ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.nomor || '-'}</TableCell>
                      <TableCell>{item.tanggal}</TableCell>
                      <TableCell>{item.perihal}</TableCell>
                      <TableCell>{getJenisChip(item.jenisSurat)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredArsip.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[]}
            />
          </TableContainer>
        )}
      </Box>
    </ThemeProvider>
  );
}
