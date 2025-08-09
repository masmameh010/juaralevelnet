
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Customer } from '../types';
import { Card } from './ui/Card';

const PhoneIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 shrink-0 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>);
const LocationIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 shrink-0 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>);
const ExternalLinkIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>);
const ArrowRightIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>);
const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 4.125v-3.375c0-.621-.504-1.125-1.125-1.125h-9.75a1.125 1.125 0 00-1.125 1.125v3.375c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125z" /></svg>);
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>);


export const CustomerTable: React.FC<{ customers: Customer[]; showSalesColumn: boolean }> = ({ customers, showSalesColumn }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, customer: Customer) => {
    e.stopPropagation();
    e.preventDefault();

    const textToCopy = [
      `Nama Pelanggan: ${customer.customerName}`,
      customer.businessName && `Nama Usaha: ${customer.businessName}`,
      `No. HP: ${customer.phoneNumber}`,
      `Alamat: ${customer.address}`,
      customer.notes && `Lokasi Gmaps: ${customer.notes}`
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(textToCopy.trim()).then(() => {
        setCopiedId(customer.id);
        setTimeout(() => setCopiedId(null), 2500);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Gagal menyalin info. Perizinan browser mungkin diperlukan.');
    });
  };
  
  if (customers.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-gray-500 dark:text-gray-400">Tidak ada data pelanggan untuk ditampilkan.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {customers.map((customer) => (
        <Link
          key={customer.id}
          to={`/leads/${customer.id}`}
          aria-label={`Lihat detail untuk ${customer.customerName}`}
          className="group block h-full"
        >
          <div
            className="relative p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
          >
            <div className="flex-grow">
              {showSalesColumn && (
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 self-start px-2 py-1 rounded-full mb-3">
                  Oleh: {customer.registeredBy?.name || 'N/A'}
                </p>
              )}
              <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate" title={customer.customerName}>{customer.customerName}</h3>
                  {customer.businessName && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate" title={customer.businessName}>{customer.businessName}</p>
                  )}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 space-y-2 text-sm">
                  <p className="text-gray-800 dark:text-gray-200 flex items-start">
                      <PhoneIcon />
                      <span className="ml-2">{customer.phoneNumber}</span>
                  </p>
                  <p className="text-gray-800 dark:text-gray-200 flex items-start">
                      <LocationIcon />
                      <span className="ml-2">{customer.address}</span>
                  </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center gap-2">
                {customer.notes ? (
                    <a 
                        href={customer.notes}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-medium text-sm text-blue-600 dark:text-blue-500 hover:underline inline-flex items-center z-10 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                        Buka Peta <ExternalLinkIcon />
                    </a>
                ) : <div />}
                
                <button
                    onClick={(e) => handleCopy(e, customer)}
                    aria-label="Salin informasi pelanggan"
                    title="Salin informasi pelanggan"
                    className="flex items-center gap-x-1.5 text-xs font-semibold rounded-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-all duration-200 z-10"
                >
                    {copiedId === customer.id ? (
                        <span className="text-green-500 flex items-center gap-x-1.5">
                            <CheckIcon className="h-4 w-4"/> Disalin!
                        </span>
                    ) : (
                        <>
                            <CopyIcon className="h-4 w-4" /> Salin Info
                        </>
                    )}
                </button>
            </div>

            <div className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-transform group-hover:translate-x-1">
              <ArrowRightIcon />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
