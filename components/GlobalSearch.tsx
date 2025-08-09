import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from './ui/Card';
import { Spinner } from './ui/Spinner';
import { getAllCustomers, getAllReports } from '../services/reportService';
import type { Customer, VisitReport } from '../types';

interface GlobalSearchProps {
    isOpen: boolean;
    query: string;
    onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, query, onClose }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [reports, setReports] = useState<VisitReport[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch data only when the modal is opened and data isn't already loaded
        if (isOpen && (customers.length === 0 || reports.length === 0)) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const [fetchedCustomers, fetchedReports] = await Promise.all([
                        getAllCustomers(),
                        getAllReports()
                    ]);
                    setCustomers(fetchedCustomers);
                    setReports(fetchedReports);
                } catch (error) {
                    console.error("Failed to fetch data for global search:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [isOpen, customers.length, reports.length]);

    const lowerCaseQuery = query.toLowerCase();

    const filteredCustomers = useMemo(() => {
        if (!query) return [];
        return customers.filter(c =>
            c.customerName?.toLowerCase().includes(lowerCaseQuery) ||
            c.businessName?.toLowerCase().includes(lowerCaseQuery) ||
            c.phoneNumber?.toLowerCase().includes(lowerCaseQuery) ||
            c.email?.toLowerCase().includes(lowerCaseQuery) ||
            c.address?.toLowerCase().includes(lowerCaseQuery) ||
            c.notes?.toLowerCase().includes(lowerCaseQuery)
        );
    }, [customers, lowerCaseQuery, query]);

    const filteredReports = useMemo(() => {
        if (!query) return [];
        return reports.filter(r =>
            r.customerName?.toLowerCase().includes(lowerCaseQuery) ||
            r.phoneNumber?.toLowerCase().includes(lowerCaseQuery) ||
            r.notes?.toLowerCase().includes(lowerCaseQuery)
        );
    }, [reports, lowerCaseQuery, query]);

    if (!isOpen) {
        return null;
    }

    const hasResults = filteredCustomers.length > 0 || filteredReports.length > 0;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only close if the backdrop itself was clicked, not a child element.
        // This is a more robust way than using stopPropagation.
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-start pt-20 px-4"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
        >
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Hasil Pencarian untuk "{query}"</h2>
                    <button onClick={onClose} aria-label="Tutup" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {isLoading ? (
                    <div className="py-10"><Spinner /></div>
                ) : !hasResults ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">Tidak ada hasil yang ditemukan.</p>
                ) : (
                    <div className="space-y-6">
                        {filteredCustomers.length > 0 && (
                            <section>
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 border-b pb-1">Hasil di Leads Manager</h3>
                                <ul className="space-y-2">
                                    {filteredCustomers.map(customer => (
                                        <li key={customer.id}>
                                            <Link to="/leads" onClick={onClose} className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                                <p className="font-semibold text-blue-600 dark:text-blue-400">{customer.customerName}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{customer.address}</p>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                        {filteredReports.length > 0 && (
                             <section>
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 border-b pb-1">Hasil di Laporan Kunjungan</h3>
                                <ul className="space-y-2">
                                    {filteredReports.map(report => (
                                        <li key={report.id}>
                                            <Link to="/rekap" onClick={onClose} className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                                <p className="font-semibold text-blue-600 dark:text-blue-400">{report.customerName}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {report.notes || `Minat: ${report.interestLevel}`} - {new Date(report.timestamp).toLocaleDateString('id-ID')}
                                                </p>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default GlobalSearch;