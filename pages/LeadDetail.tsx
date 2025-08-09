
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAllCustomers, getAllReports } from '../services/reportService';
import { Customer, VisitReport } from '../types';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';

const PhoneIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>);
const EmailIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>);
const LocationIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>);
const ExternalLinkIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>);

const LeadDetail: React.FC = () => {
    const { customerId } = useParams<{ customerId: string }>();
    const { user } = useAuth();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [visitHistory, setVisitHistory] = useState<VisitReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!user || !customerId) return;
            setIsLoading(true);
            try {
                const [allCustomers, allReports] = await Promise.all([
                    getAllCustomers(),
                    getAllReports()
                ]);
                
                const foundCustomer = allCustomers.find(c => c.id === customerId);
                
                if (foundCustomer) {
                    setCustomer(foundCustomer);
                    const history = allReports.filter(report => report.customerName.toLowerCase() === foundCustomer.customerName.toLowerCase());
                    setVisitHistory(history);
                }
            } catch (error) {
                console.error("Failed to load lead details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [user, customerId]);

    if (isLoading) {
        return <div className="py-10"><Spinner /></div>;
    }

    if (!customer) {
        return (
            <Card className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Pelanggan tidak ditemukan</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Data pelanggan dengan ID ini tidak dapat ditemukan.</p>
                <Link to="/leads" className="mt-4 inline-block text-blue-600 hover:underline">Kembali ke Leads Manager</Link>
            </Card>
        );
    }
    
    return (
        <div className="container mx-auto">
            <nav className="mb-4 text-sm" aria-label="Breadcrumb">
              <ol className="list-none p-0 inline-flex">
                <li className="flex items-center">
                  <Link to="/leads" className="text-gray-500 hover:text-blue-600">Leads Manager</Link>
                  <svg className="fill-current w-3 h-3 mx-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/></svg>
                </li>
                <li className="text-gray-800 dark:text-gray-200" aria-current="page">
                  {customer.customerName}
                </li>
              </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{customer.customerName}</h2>
                        {customer.businessName && <p className="text-md text-gray-600 dark:text-gray-300 mb-4">{customer.businessName}</p>}
                        
                        <dl className="space-y-3">
                            <div className="flex items-start">
                                <dt className="flex-shrink-0"><PhoneIcon /></dt>
                                <dd className="ml-3 text-gray-700 dark:text-gray-300">{customer.phoneNumber}</dd>
                            </div>
                             {customer.email && (
                                <div className="flex items-start">
                                    <dt className="flex-shrink-0"><EmailIcon /></dt>
                                    <dd className="ml-3 text-gray-700 dark:text-gray-300">{customer.email}</dd>
                                </div>
                            )}
                             <div className="flex items-start">
                                <dt className="flex-shrink-0"><LocationIcon /></dt>
                                <dd className="ml-3 text-gray-700 dark:text-gray-300">{customer.address}</dd>
                            </div>
                        </dl>
                        {customer.notes && (
                            <a 
                                href={customer.notes}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 font-medium text-sm text-blue-600 dark:text-blue-500 hover:underline inline-flex items-center"
                            >
                                Buka Peta Lokasi <ExternalLinkIcon />
                            </a>
                        )}
                         <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                             Didaftarkan oleh {customer.registeredBy?.name || 'N/A'} pada {new Date(customer.registrationDate).toLocaleDateString('id-ID')}
                         </p>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Riwayat Kunjungan</h2>
                        {visitHistory.length > 0 ? (
                            <ul className="space-y-4">
                                {visitHistory.map(visit => (
                                    <li key={visit.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">Dikunjungi oleh: {visit.salesPerson.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(visit.timestamp).toLocaleString('id-ID')}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${visit.interestLevel === 'Tinggi' ? 'bg-green-100 text-green-800' : visit.interestLevel === 'Sedang' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                Minat: {visit.interestLevel}
                                            </span>
                                        </div>
                                        {visit.notes && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 p-2 rounded">{visit.notes}</p>}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">Belum ada riwayat kunjungan untuk pelanggan ini.</p>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LeadDetail;