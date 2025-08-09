
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { saveCustomer } from '../services/reportService';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const PendaftaranPelanggan: React.FC = () => {
  const { user } = useAuth();
  const [customerName, setCustomerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setCustomerName('');
    setBusinessName('');
    setPhoneNumber('');
    setEmail('');
    setAddress('');
    setNotes('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!customerName || !phoneNumber || !address || !notes || !user) {
      setError('Nama, No. HP, Alamat, dan Link Google Maps wajib diisi.');
      return;
    }

    const isValidUrl = (urlString: string): boolean => {
      try {
        const url = new URL(urlString);
        return (url.protocol === 'http:' || url.protocol === 'https:') &&
               (url.hostname.includes('google.com') || url.hostname.includes('maps.app.goo.gl'));
      } catch (e) {
        return false;
      }
    };

    if (!isValidUrl(notes)) {
      setError('Link Google Maps tidak valid. Harap salin link dari Google Maps (contoh: https://maps.app.goo.gl/...).');
      return;
    }

    setIsSubmitting(true);

    try {
      await saveCustomer({
        registeredBy: user,
        registrationDate: new Date().toISOString(),
        customerName,
        businessName,
        phoneNumber,
        email,
        address,
        notes,
      });
      setSuccess('Pelanggan baru berhasil didaftarkan dan sedang disinkronkan!');
      resetForm();
    } catch (err) {
      setError('Gagal mendaftarkan pelanggan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccess(''), 5000);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Form Pendaftaran Pelanggan Baru</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="customerName"
          label="Nama Pelanggan / Kontak Person"
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />

        <Input
          id="businessName"
          label="Nama Usaha (Opsional)"
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
        
        <Input
          id="phoneNumber"
          label="Nomor HP"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        
        <Input
          id="email"
          label="Email (Opsional)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <div>
            <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Alamat Lengkap</label>
            <textarea
                id="address"
                rows={3}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Tulis alamat lengkap pelanggan..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
            ></textarea>
        </div>

        <div>
            <label htmlFor="notes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Link Google Maps Lokasi</label>
            <textarea
                id="notes"
                rows={2}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Contoh: https://maps.app.goo.gl/..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                required
            ></textarea>
        </div>
        
        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
          Daftarkan Pelanggan
        </Button>
      </form>
    </Card>
  );
};

export default PendaftaranPelanggan;
