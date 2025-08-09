import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getCustomers } from '../services/reportService';
import { Customer, User, UserRole } from '../types';
import { Card } from '../components/ui/Card';
import { getUsers } from '../services/userService';
import { Select } from '../components/ui/Select';
import { Spinner } from '../components/ui/Spinner';
import { CustomerTable } from '../components/CustomerTable';

const LeadsManager: React.FC = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filterableUsers, setFilterableUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setIsLoading(true);
        try {
            const fetchedCustomers = await getCustomers(user);
            setCustomers(fetchedCustomers);
            if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
                // Fetch all users for the filter, as any user can register a customer
                setFilterableUsers(getUsers());
            }
        } catch(e) {
            console.error("Failed to load customers", e);
        } finally {
            setIsLoading(false);
        }
      }
    };
    loadData();
  }, [user]);

  const filteredCustomers = useMemo(() => {
    // For admins/super-admins, apply the user filter from the dropdown
    if ((user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) && selectedUser !== 'all') {
      return customers.filter(c => c.registeredBy && c.registeredBy.id === selectedUser);
    }
    // For sales users, the 'customers' state is already pre-filtered by the service.
    // For admins, if 'all' is selected, show the entire list of customers.
    return customers;
  }, [customers, selectedUser, user]);

  if (!user) {
    return null; // or a loading spinner
  }

  const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Leads Manager</h1>

      {isAdmin && (
        <Card className="mb-6">
          <div className="flex justify-end">
              <div className="w-full md:w-64">
                  <Select id="user-filter" label="Filter Berdasarkan Penginput" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                      <option value="all">Semua Pengguna</option>
                      {filterableUsers.map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                      ))}
                  </Select>
              </div>
          </div>
        </Card>
      )}
      
      {isLoading ? (
        <div className="py-10"><Spinner /></div>
      ) : (
        <CustomerTable customers={filteredCustomers} showSalesColumn={isAdmin} />
      )}
    </div>
  );
};

export default LeadsManager;