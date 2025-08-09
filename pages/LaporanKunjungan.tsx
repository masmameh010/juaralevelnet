import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { saveReport } from '../services/reportService';
import { getCurrentLocation } from '../services/locationService';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { InterestLevel, UserRole } from '../types';
import type { LocationData } from '../types';

type LocationStatus = 'fetching' | 'success' | 'error';

const SpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const LaporanKunjungan: React.FC = () => {
  const { user } = useAuth();
  const [customerName, setCustomerName] = useState('');
  const [interestLevel, setInterestLevel] = useState<InterestLevel>(InterestLevel.SEDANG);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchLocation = () => {
      setLocationStatus('fetching');
      setError('');
      getCurrentLocation()
        .then(currentLoc => {
          setLocation(currentLoc);
          setLocationStatus('success');
        })
        .catch(err => {
          setError(err.message || 'Gagal mendapatkan lokasi. Pastikan izin lokasi telah diaktifkan di browser Anda.');
          setLocationStatus('error');
        });
  }

  useEffect(() => {
    if (user?.role === UserRole.SALES) {
      fetchLocation();
    }
  }, [user]);

  const resetForm = () => {
    setCustomerName('');
    setInterestLevel(InterestLevel.SEDANG);
    setPhoneNumber('');
    setNotes('');
    setLocation(null);
    fetchLocation();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !location || !user) {
      setError('Nama calon pelanggan dan lokasi wajib diisi.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await saveReport({
        salesPerson: user,
        timestamp: new Date().toISOString(),
        location,
        customerName,
        interestLevel,
        phoneNumber,
        notes
      });
      setSuccess('Laporan berhasil disimpan dan sedang disinkronkan!');
      resetForm();
    } catch (err) {
      setError('Gagal menyimpan laporan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
       setTimeout(() => setSuccess(''), 5000);
    }
  };
  
  const renderLocationStatus = () => {
    switch (locationStatus) {
      case 'fetching':
        return <p className="flex items-center text-sm text-yellow-600 dark:text-yellow-400"><SpinnerIcon className="animate-spin -ml-1 mr-2 h-4 w-4" /> Mendeteksi lokasi Anda...</p>;
      case 'success':
        return location && <p className="text-sm text-green-600 dark:text-green-400">Lokasi berhasil dideteksi! ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})</p>;
      case 'error':
        return (
            <div className="flex items-center gap-x-3">
                <p className="text-sm text-red-600 dark:text-red-400">Gagal mendapatkan lokasi.</p>
                <button
                    type="button"
                    onClick={fetchLocation}
                    className="rounded-md bg-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                    Coba Lagi
                </button>
            </div>
        );
      default:
        return null;
    }
  };

  if (user?.role !== UserRole.SALES) {
    return (
        <Card>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Akses Ditolak</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Hanya sales yang dapat membuat laporan kunjungan.</p>
        </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Form Laporan Kunjungan</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Waktu & Tanggal</label>
          <p className="text-gray-700 dark:text-gray-300">{new Date().toLocaleString('id-ID')}</p>
        </div>

        <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Lokasi</label>
            {renderLocationStatus()}
        </div>

        <Input
          id="customerName"
          label="Nama Calon Pelanggan"
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />

        <Select
          id="interestLevel"
          label="Tingkat Minat"
          value={interestLevel}
          onChange={(e) => setInterestLevel(e.target.value as InterestLevel)}
          required
        >
          {Object.values(InterestLevel).map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </Select>

        <Input
          id="phoneNumber"
          label="Nomor HP (Opsional)"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        
        <div>
            <label htmlFor="notes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Keterangan Tambahan</label>
            <textarea
                id="notes"
                rows={4}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Tulis keterangan tambahan di sini..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            ></textarea>
        </div>
        
        <Button type="submit" isLoading={isSubmitting} disabled={!location || isSubmitting}>
          Kirim Laporan
        </Button>
      </form>
    </Card>
  );
};

export default LaporanKunjungan;