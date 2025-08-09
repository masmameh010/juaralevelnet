import { UserRole } from '../types';
import type { VisitReport, User, Customer } from '../types';
import { GOOGLE_APPS_SCRIPT_URL } from '../config';

const REPORTS_KEY = 'levelnet-visit-reports';
const CUSTOMERS_KEY = 'levelnet-customers';

// --- Reports Local Storage ---
const getReportsFromStorage = (): VisitReport[] => {
  try {
    const storedReports = localStorage.getItem(REPORTS_KEY);
    return storedReports ? JSON.parse(storedReports) : [];
  } catch (error) {
    console.error("Failed to parse reports from localStorage", error);
    return [];
  }
};

const saveReportsToStorage = (reports: VisitReport[]) => {
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  } catch (error)
  {
    console.error("Failed to save reports to localStorage", error);
  }
};

// --- Customers Local Storage ---
const getCustomersFromStorage = (): Customer[] => {
  try {
    const storedCustomers = localStorage.getItem(CUSTOMERS_KEY);
    return storedCustomers ? JSON.parse(storedCustomers) : [];
  } catch (error) {
    console.error("Failed to parse customers from localStorage", error);
    return [];
  }
};

const saveCustomersToStorage = (customers: Customer[]) => {
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  } catch (error) {
    console.error("Failed to save customers to localStorage", error);
  }
};


// --- API Functions ---

export const saveReport = async (report: Omit<VisitReport, 'id'>): Promise<VisitReport> => {
  const reports = getReportsFromStorage();
  const newReport: VisitReport = {
    ...report,
    id: `report-${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  const updatedReports = [...reports, newReport];
  saveReportsToStorage(updatedReports);

  // Sync with Google Sheets
  if (GOOGLE_APPS_SCRIPT_URL) {
    try {
      const payload = {
        type: 'visitReport',
        data: newReport,
      };
      fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });
    } catch (error) {
        console.error('Failed to sync report to Google Sheets:', error);
    }
  } else {
    console.warn('GOOGLE_APPS_SCRIPT_URL is not set. Skipping sync.');
  }

  return newReport;
};

export const saveCustomer = async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
  const customers = getCustomersFromStorage();
  const newCustomer: Customer = {
    ...customer,
    id: `customer-${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  const updatedCustomers = [...customers, newCustomer];
  saveCustomersToStorage(updatedCustomers);
  
  if (GOOGLE_APPS_SCRIPT_URL) {
    try {
      const payload = {
        type: 'customerRegistration',
        data: newCustomer,
      };
      
      fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });
    } catch (error) {
      console.error('Failed to sync customer to Google Sheets:', error);
    }
  } else {
    console.warn('GOOGLE_APPS_SCRIPT_URL is not set. Skipping sync.');
  }

  return newCustomer;
};

export const getAllReports = async (): Promise<VisitReport[]> => {
    const localReports = getReportsFromStorage();

    if (GOOGLE_APPS_SCRIPT_URL) {
        try {
            const reportUrl = `${GOOGLE_APPS_SCRIPT_URL}?action=getReports`;
            const response = await fetch(reportUrl);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const networkReports: VisitReport[] = await response.json();
            
            // Merge network data with new local-only data
            const networkReportIds = new Set(networkReports.map(r => r.id));
            const newLocalReports = localReports.filter(lr => !networkReportIds.has(lr.id));
            const combinedReports = [...networkReports, ...newLocalReports];
            
            const sortedData = combinedReports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            
            saveReportsToStorage(sortedData);
            return sortedData;
        } catch (error) {
            console.error("Failed to fetch reports from Google Sheets, falling back to localStorage.", error);
            // On network error, return stale data from local storage.
            return localReports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }
    }
    // If no URL, just use local storage
    return localReports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const getAllCustomers = async (): Promise<Customer[]> => {
    const localCustomers = getCustomersFromStorage();

    if (GOOGLE_APPS_SCRIPT_URL) {
        try {
            const customerUrl = `${GOOGLE_APPS_SCRIPT_URL}?action=getCustomers`;
            const response = await fetch(customerUrl); 
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const networkCustomers: Customer[] = await response.json();

            // Merge network data with new local-only data
            const networkCustomerIds = new Set(networkCustomers.map(c => c.id));
            const newLocalCustomers = localCustomers.filter(lc => !networkCustomerIds.has(lc.id));
            const combinedCustomers = [...networkCustomers, ...newLocalCustomers];

            const sortedData = combinedCustomers.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
            
            saveCustomersToStorage(sortedData);
            return sortedData;
        } catch (error) {
            console.error("Failed to fetch customers from Google Sheets, falling back to localStorage.", error);
            // On network error, return stale data from local storage.
            return localCustomers.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
        }
    }
    // If no URL, just use local storage
    return localCustomers.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
};


export const getReports = async (user: User): Promise<VisitReport[]> => {
  const reports = await getAllReports();
  if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
    return reports;
  }
  return reports.filter(report => report.salesPerson.id === user.id);
};

export const getCustomers = async (user: User): Promise<Customer[]> => {
  const customers = await getAllCustomers();
  if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
    return customers;
  }
  return customers.filter(customer => customer.registeredBy && customer.registeredBy.id === user.id);
};