import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getReports } from '../services/reportService';
import { User, VisitReport, UserRole } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ReportTable } from '../components/ReportTable';
import { getSalesUsers } from '../services/userService';
import { Select } from '../components/ui/Select';
import { Spinner } from '../components/ui/Spinner';

type FilterType = 'all' | 'daily' | 'weekly' | 'monthly';

// --- Local Components ---
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center printable-card">
        <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-lg dark:text-blue-100 dark:bg-blue-500">
            {icon}
        </div>
        <div>
            <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
        </div>
    </div>
);

const ClipboardListIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>);
const UsersIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.978 5.978 0 0112 13a5.979 5.979 0 012.723 5.803" /></svg>);
const StarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>);
const PrintIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h1v-4a1 1 0 011-1h8a1 1 0 011 1v4h1a2 2 0 002-2v-6a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>);

const RekapData: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<VisitReport[]>([]);
  const [salesUsers, setSalesUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedSales, setSelectedSales] = useState<string>('all');
  
  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setIsLoading(true);
        try {
            const fetchedReports = await getReports(user);
            setReports(fetchedReports);
            if (isAdmin) {
                setSalesUsers(getSalesUsers());
            }
        } catch(e) {
            console.error("Failed to load reports", e);
            setReports([]);
        } finally {
            setIsLoading(false);
        }
      }
    };
    loadData();
  }, [user, isAdmin]);

  const filteredReports = useMemo(() => {
    let dateFiltered = reports;
    const now = new Date();
    
    if (filter === 'daily') {
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      dateFiltered = reports.filter(r => new Date(r.timestamp) >= today);
    } else if (filter === 'weekly') {
      const firstDayOfWeek = new Date(now);
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      firstDayOfWeek.setDate(diff);
      firstDayOfWeek.setHours(0, 0, 0, 0);
      dateFiltered = reports.filter(r => new Date(r.timestamp) >= firstDayOfWeek);
    } else if (filter === 'monthly') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      dateFiltered = reports.filter(r => new Date(r.timestamp) >= startOfMonth);
    }

    if (isAdmin && selectedSales !== 'all') {
      return dateFiltered.filter(r => r.salesPerson.id === selectedSales);
    }
    
    return dateFiltered;
  }, [reports, filter, selectedSales, user, isAdmin]);

  const summaryData = useMemo(() => {
    if (filteredReports.length === 0) {
        return { topSales: 'N/A', topInterest: 'N/A' };
    }

    const salesCounts = new Map<string, number>();
    const interestCounts = new Map<string, number>();

    for (const report of filteredReports) {
        if (isAdmin) {
            salesCounts.set(report.salesPerson.name, (salesCounts.get(report.salesPerson.name) || 0) + 1);
        }
        interestCounts.set(report.interestLevel, (interestCounts.get(report.interestLevel) || 0) + 1);
    }

    const getTopEntry = (counts: Map<string, number>) => {
        if (counts.size === 0) return 'N/A';
        return [...counts.entries()].reduce((a, b) => b[1] > a[1] ? b : a)[0];
    };

    return {
        topSales: getTopEntry(salesCounts),
        topInterest: getTopEntry(interestCounts),
    };
  }, [filteredReports, isAdmin]);
  
  const getPeriodString = () => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    const today = new Date();
    switch (filter) {
        case 'daily':
            return `Hari Ini: ${today.toLocaleDateString('id-ID', options)}`;
        case 'weekly':
            const firstDay = new Date(today);
            firstDay.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
            return `Minggu Ini: ${firstDay.toLocaleDateString('id-ID', options)} - ${today.toLocaleDateString('id-ID', options)}`;
        case 'monthly':
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            return `Bulan Ini: ${startOfMonth.toLocaleDateString('id-ID', options)} - ${today.toLocaleDateString('id-ID', options)}`;
        case 'all':
            return 'Sepanjang Waktu';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="flex justify-center items-center py-10"><Spinner /></div>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Rekap Data Kunjungan</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Laporan kinerja berdasarkan filter yang dipilih.</p>
        </div>
        <Button onClick={handlePrint} id="print-button">
            <PrintIcon />
            Cetak Laporan
        </Button>
      </div>

      <Card id="filter-section" className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter Periode Waktu</label>
                <div className="flex items-center space-x-2 mt-1">
                    <Button size="sm" variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')}>Semua</Button>
                    <Button size="sm" variant={filter === 'daily' ? 'primary' : 'secondary'} onClick={() => setFilter('daily')}>Harian</Button>
                    <Button size="sm" variant={filter === 'weekly' ? 'primary' : 'secondary'} onClick={() => setFilter('weekly')}>Mingguan</Button>
                    <Button size="sm" variant={filter === 'monthly' ? 'primary' : 'secondary'} onClick={() => setFilter('monthly')}>Bulanan</Button>
                </div>
            </div>
            {isAdmin && (
                <div className="w-full md:w-64">
                    <Select id="sales-filter" label="Filter Berdasarkan Sales" value={selectedSales} onChange={(e) => setSelectedSales(e.target.value)}>
                        <option value="all">Semua Sales</option>
                        {salesUsers.map(sales => (
                            <option key={sales.id} value={sales.id}>{sales.name}</option>
                        ))}
                    </Select>
                </div>
            )}
        </div>
      </Card>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Ringkasan Laporan ({getPeriodString()})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="Total Kunjungan" value={filteredReports.length} icon={<ClipboardListIcon />} />
            {isAdmin && <StatCard title="Sales Teraktif" value={summaryData.topSales} icon={<UsersIcon />} />}
            <StatCard title="Minat Tertinggi" value={summaryData.topInterest} icon={<StarIcon />} />
        </div>
      </div>
      
      <Card className="printable-card">
        <ReportTable reports={filteredReports} showSalesColumn={isAdmin} />
      </Card>
    </div>
  );
};

export default RekapData;