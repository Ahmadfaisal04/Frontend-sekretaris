'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, Typography, Card, CardContent, IconButton, Tooltip,
  Alert, CircularProgress, TablePagination, Chip, Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { API_ENDPOINTS, getHeaders } from '@/config/api';

// Styled components
const StyledCard = styled(Card)({
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
  overflow: 'hidden'
});

const HeaderBox = styled(Box)({
  background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
  padding: '24px',
  color: 'white',
  borderRadius: '16px 16px 0 0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

const FilePreviewBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
  marginTop: theme.spacing(1),
}));

export default function SuratMasuk() {
  const [rows, setRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [initialFormData, setInitialFormData] = useState(null);
  const [formData, setFormData] = useState({
    nomor: '',
    tanggal: null,
    perihal: '',
    asal: '',
    file: null,
    existingFile: '',
    existingTitle: ''
  });
  const [previewFile, setPreviewFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null); // Tambahkan state untuk menyimpan file yang sudah ada
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.SURAT_MASUK_GET_ALL, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Gagal mengambil data surat masuk');

      const data = await response.json();
      setRows(data);
      setError(null);
    } catch (err) {
      setError('Gagal mengambil data surat masuk');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file' && files[0]) {
      const file = files[0];
      setFormData(prev => ({ ...prev, file }));
      setPreviewFile(URL.createObjectURL(file));
      setExistingFile(null); // Reset existing file jika memilih file baru
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, tanggal: date }));
  };

  const handleSave = async () => {
    if (!formData.nomor || !formData.tanggal || !formData.perihal || !formData.asal) {
      setError('Semua field harus diisi');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('nomor', formData.nomor);
      data.append('tanggal', dayjs(formData.tanggal).format('YYYY-MM-DD'));
      data.append('perihal', formData.perihal);
      data.append('asal', formData.asal);


      // Logika pengiriman file yang diperbaiki
      if (formData.file && typeof formData.file === 'object') {
        // Jika ada file baru, kirim file baru
        data.append('file', formData.file);
      } else {
        // Jika tidak ada file baru tapi ada existing file, kirim path file lama
        data.append('existing_file', formData.existingFile);
        data.append('existing_title', formData.existingTitle);
      }

      const endpoint = editingId
        ? API_ENDPOINTS.SURAT_MASUK_UPDATE(editingId)
        : API_ENDPOINTS.SURAT_MASUK_ADD;

      const response = await fetch(endpoint, {
        method: editingId ? 'PUT' : 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan data');
      }

      setShowModal(false);
      fetchData();
      Swal.fire({
        icon: 'success',
        title: editingId ? 'Data berhasil diupdate!' : 'Data berhasil ditambahkan!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Gagal menyimpan data',
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    const formattedData = {
      nomor: row.nomor,
      tanggal: dayjs(row.tanggal),
      perihal: row.perihal,
      asal: row.asal,
      file: row.file, // Reset file baru
      existingFile: row.file,
      existingTitle: row.title,
    };

    setFormData(formattedData);
    setInitialFormData(formattedData);
    setEditingId(row.id);

    // Simpan informasi file yang sudah ada
    if (row.file) {
      setExistingFile(row.file);
      const backendBaseUrl = "http://localhost:8088";
      const filePath = row.file.startsWith(".") ? row.file.replace(".", "") : row.file;
      const previewUrl = `${backendBaseUrl}${filePath}`;
      setPreviewFile(previewUrl);
    } else {
      setExistingFile(null);
      setPreviewFile(null);
    }

    setShowModal(true);
  };

  const isFormChanged = () => {
    if (!initialFormData) return false;

    return (
      formData.nomor !== initialFormData.nomor ||
      formData.tanggal.format("YYYY-MM-DD") !== dayjs(initialFormData.tanggal).format("YYYY-MM-DD") ||
      formData.perihal !== initialFormData.perihal ||
      formData.asal !== initialFormData.asal ||
      // jika file baru diupload
      (formData.file instanceof File)
    );
  };



  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data yang dihapus tidak dapat dikembalikan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a237e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await fetch(API_ENDPOINTS.SURAT_MASUK_DELETE(id), {
          method: 'DELETE',
          headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Gagal menghapus data');
        Swal.fire('Berhasil!', 'Data surat masuk telah dihapus.', 'success');
        fetchData();
      } catch (err) {
        Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <StyledCard>
      <HeaderBox>
        <Typography variant="h6">Data Surat Masuk</Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => {
            setShowModal(true);
            setEditingId(null);
            setFormData({
              nomor: '',
              tanggal: null,
              perihal: '',
              asal: '',
              file: null
            });
            setPreviewFile(null);
            setExistingFile(null);
            setError(null);
          }}
        >
          Tambah Surat
        </Button>
      </HeaderBox>

      <CardContent>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nomor Surat</strong></TableCell>
                <TableCell><strong>Tanggal</strong></TableCell>
                <TableCell><strong>Perihal</strong></TableCell>
                <TableCell><strong>Asal</strong></TableCell>
                <TableCell><strong>File</strong></TableCell>
                <TableCell><strong>Aksi</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.nomor}</TableCell>
                  <TableCell>{dayjs(row.tanggal).format('DD-MM-YYYY')}</TableCell>
                  <TableCell>{row.perihal}</TableCell>
                  <TableCell>{row.asal}</TableCell>
                  <TableCell>
                    {row.file && (
                      <Tooltip title="Lihat File">
                        <IconButton
                          component="a"
                          href={`http://localhost:8088/${row.file.replace(/^\./, '')}`}
                          target="_blank"
                        >
                          <DescriptionIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(row)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Hapus">
                      <IconButton onClick={() => handleDelete(row.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </CardContent>

      {/* Dialog Form */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Surat Masuk' : 'Tambah Surat Masuk'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth margin="dense" label="Nomor Surat" name="nomor"
            value={formData.nomor} onChange={handleInputChange}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Tanggal"
              value={formData.tanggal}
              onChange={handleDateChange}
              slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
            />
          </LocalizationProvider>
          <TextField
            fullWidth margin="dense" label="Perihal" name="perihal"
            value={formData.perihal} onChange={handleInputChange}
          />
          <TextField
            fullWidth margin="dense" label="Asal Surat" name="asal"
            value={formData.asal} onChange={handleInputChange}
          />
          <Button variant="outlined" component="label" sx={{ mt: 2 }}>
            Pilih File
            <input type="file" name="file" hidden onChange={handleInputChange} />
          </Button>
          {(previewFile || existingFile) && (
            <FilePreviewBox>
              <Avatar><DescriptionIcon /></Avatar>
              <Typography variant="body2">
                {formData.file?.name || existingFile?.split('/').pop()}
              </Typography>
              {(previewFile || existingFile) && (
                <a
                  href={previewFile || `http://localhost:8088${existingFile.replace(/^\./, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="small">Lihat</Button>
                </a>
              )}
            </FilePreviewBox>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Batal</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading || (editingId && !isFormChanged())}
          >
            {editingId ? 'Update' : 'Simpan'}
          </Button>

        </DialogActions>
      </Dialog>
    </StyledCard>
  );
}