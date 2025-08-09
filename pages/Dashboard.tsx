
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { getReports } from '../services/reportService';
import { getSalesUsers } from '../services/userService';
import { User, UserRole, VisitReport, InterestLevel } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card className="flex items-center p-4">
        <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500">
            {icon}
        </div>
        <div>
            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{value}</p>
        </div>
    </Card>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<VisitReport[]>([]);
  const [salesUsers, setSalesUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadData();
  }, [user, isAdmin]);

  const { visitsToday, totalVisits } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visitsTodayCount = reports.filter(
      (report) => new Date(report.timestamp).getTime() >= today.getTime()
    ).length;
    
    return {
        visitsToday: visitsTodayCount,
        totalVisits: reports.length
    };
  }, [reports]);

  const salesDailyProgress = useMemo(() => {
    if (!isAdmin) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysReports = reports.filter(
        (report) => new Date(report.timestamp).getTime() >= today.getTime()
    );

    const progressMap = new Map<string, number>();
    todaysReports.forEach(report => {
        const salesId = report.salesPerson.id;
        progressMap.set(salesId, (progressMap.get(salesId) || 0) + 1);
    });
    
    return salesUsers.map(salesUser => ({
        ...salesUser,
        visits: progressMap.get(salesUser.id) || 0
    })).sort((a,b) => b.visits - a.visits); // sort by most visits

  }, [reports, salesUsers, isAdmin]);
  
  const teamPerformanceData = useMemo(() => {
    if (!isAdmin) return [];
    
    const visitsBySales = new Map<string, number>();
    reports.forEach(report => {
        const salesId = report.salesPerson.id;
        visitsBySales.set(salesId, (visitsBySales.get(salesId) || 0) + 1);
    });

    return salesUsers.map(sales => ({
      name: sales.name.split(' ')[0],
      visits: visitsBySales.get(sales.id) || 0,
    })).filter(d => d.visits > 0).sort((a,b) => b.visits - a.visits);

  }, [reports, salesUsers, isAdmin]);

  const visitTrendData = useMemo(() => {
    if (!isAdmin) return [];
    const visitsByDate = new Map<string, number>();
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const filteredReports = reports.filter(r => new Date(r.timestamp) >= last30Days);

    filteredReports.forEach(report => {
        const date = new Date(report.timestamp).toISOString().split('T')[0];
        visitsByDate.set(date, (visitsByDate.get(date) || 0) + 1);
    });
    
    return Array.from(visitsByDate.entries())
      .map(([date, visits]) => ({ date, visits }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  }, [reports, isAdmin]);

  const interestLevelData = useMemo(() => {
    if (!isAdmin) return [];
    const interestCounts: { [key in InterestLevel]?: number } = {};

    reports.forEach(report => {
        interestCounts[report.interestLevel] = (interestCounts[report.interestLevel] || 0) + 1;
    });

    return Object.entries(interestCounts).map(([name, value]) => ({ name, value }));
  }, [reports, isAdmin]);
  
  const PIE_COLORS = {
      [InterestLevel.TINGGI]: '#10B981',
      [InterestLevel.SEDANG]: '#F59E0B',
      [InterestLevel.RENDAH]: '#EF4444',
      [InterestLevel.MENOLAK_POSM]: '#6B7280',
  };
  
  const target = 15;
  const visitsTodayMessage = user?.role === 'SALES'
    ? `${visitsToday} / ${target} Kunjungan`
    : `${visitsToday} Kunjungan`;

  if (isLoading) {
    return (
        <div className="flex justify-center items-center py-10">
            <Spinner />
        </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Dashboard
      </h1>
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <StatCard 
          title={isAdmin ? "Total Kunjungan Hari Ini" : "Kunjungan Hari Ini"}
          value={visitsTodayMessage}
          icon={<CalendarIcon />}
        />
        <StatCard
          title="Total Laporan"
          value={totalVisits}
          icon={<DocumentIcon />}
        />
         {user?.role === 'SALES' && (
            <StatCard
                title="Target Harian"
                value={visitsToday >= target ? "Tercapai!" : "Belum Tercapai"}
                icon={visitsToday >= target ? <CheckIcon /> : <ExclamationIcon />}
            />
         )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Selamat Datang!</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gunakan menu di samping untuk membuat laporan kunjungan baru atau melihat rekapitulasi data.
            {isAdmin && " Anda memiliki akses untuk melihat semua laporan dari tim sales."}
          </p>
        </Card>
        
        {isAdmin && (
            <Card>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Progress Harian Tim Sales</h2>
                {salesDailyProgress.length > 0 ? (
                    <ul className="space-y-3">
                        {salesDailyProgress.map(sales => (
                            <li key={sales.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <span className="text-gray-700 dark:text-gray-300">{sales.name}</span>
                                <span className="font-bold text-gray-900 dark:text-white bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded-md text-sm">{sales.visits} Kunjungan</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">Belum ada laporan kunjungan hari ini dari tim sales.</p>
                )}
            </Card>
        )}
      </div>

       {isAdmin && (
            <>
            <div className="my-8 border-t border-gray-200 dark:border-gray-700"></div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Analitik Visual Tim</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Kinerja Tim (Total Kunjungan)</h3>
                    {teamPerformanceData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={teamPerformanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip wrapperClassName="!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-600 rounded-md shadow-lg" />
                                <Legend />
                                <Bar dataKey="visits" name="Total Kunjungan" fill="#3B82F6" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <p className="text-gray-500 dark:text-gray-400 text-center py-10">Tidak ada data untuk ditampilkan.</p>}
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Distribusi Tingkat Minat</h3>
                    {interestLevelData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                           <PieChart>
                                <Pie data={interestLevelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {interestLevelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name as InterestLevel] || '#8884d8'} />
                                    ))}
                                </Pie>
                                <Tooltip wrapperClassName="!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-600 rounded-md shadow-lg" />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <p className="text-gray-500 dark:text-gray-400 text-center py-10">Tidak ada data untuk ditampilkan.</p>}
                </Card>
            </div>
             <div className="grid grid-cols-1 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Tren Kunjungan (30 Hari Terakhir)</h3>
                    {visitTrendData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={visitTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip wrapperClassName="!bg-white dark:!bg-gray-800 !border-gray-300 dark:!border-gray-600 rounded-md shadow-lg" />
                                <Legend />
                                <Line type="monotone" dataKey="visits" name="Jumlah Kunjungan" stroke="#10B981" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : <p className="text-gray-500 dark:text-gray-400 text-center py-10">Tidak ada data untuk ditampilkan.</p>}
                </Card>
             </div>
            </>
        )}
    </div>
  );
};

// SVG Icons
const CalendarIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
);
const DocumentIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
);
const CheckIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);
const ExclamationIcon: React.FC = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
);

export default Dashboard;