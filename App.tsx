
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LaporanKunjungan from './pages/LaporanKunjungan';
import RekapData from './pages/RekapData';
import { Spinner } from './components/ui/Spinner';
import PendaftaranPelanggan from './pages/PendaftaranPelanggan';
import LeadsManager from './pages/LeadsManager';
import LeadDetail from './pages/LeadDetail';
import Media from './pages/Media';
import Akun from './pages/Akun';

const AppRoutes: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner />
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        );
    }

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/laporan" element={<LaporanKunjungan />} />
                <Route path="/rekap" element={<RekapData />} />
                <Route path="/pendaftaran" element={<PendaftaranPelanggan />} />
                <Route path="/leads" element={<LeadsManager />} />
                <Route path="/leads/:customerId" element={<LeadDetail />} />
                <Route path="/media" element={<Media />} />
                <Route path="/akun" element={<Akun />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Layout>
    );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;