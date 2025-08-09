import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, UserRole } from '../types';
import { getUsers, updateUser, addUser } from '../services/userService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import { Select } from '../components/ui/Select';

const Akun: React.FC = () => {
  const { user: loggedInUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('edit');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Form state inside modal
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.SALES);

  // Operation State
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadUsers = () => {
    setIsLoading(true);
    setUsers(getUsers().filter(u => u.role !== UserRole.SUPER_ADMIN));
    setIsLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole(UserRole.SALES);
    setCurrentUser(null);
    setModalError('');
  }

  const handleOpenAddModal = () => {
    resetForm();
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (userToEdit: User) => {
    resetForm();
    setModalMode('edit');
    setCurrentUser(userToEdit);
    setEmail(userToEdit.email);
    setName(userToEdit.name); // Although not editable, good to have it
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setModalError('');
    setSuccessMessage('');

    try {
      if (modalMode === 'add') {
        const newUser: Omit<User, 'id'> = { name, email, password, role };
        await addUser(newUser);
        setSuccessMessage('Pengguna baru berhasil ditambahkan.');
      } else if (currentUser) {
        const updatedUserData: User = {
          ...currentUser,
          email: email,
          password: password, // Service ignores if empty
        };
        await updateUser(updatedUserData);
        setSuccessMessage('Data pengguna berhasil diperbarui.');
      }
      
      loadUsers(); // Refresh the list
      setIsSaving(false);
      handleCloseModal();
      
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch(err: any) {
      setModalError(err.message || 'Gagal menyimpan data.');
      setIsSaving(false);
    }
  };

  if (loggedInUser?.role !== UserRole.SUPER_ADMIN) {
    return (
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Akses Ditolak</h1>
        <Card>
            <p className="text-gray-600 dark:text-gray-400">Hanya Super Admin yang dapat mengakses halaman ini.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Data Akun Pengguna</h1>
        <Button onClick={handleOpenAddModal}>
            Tambah Pengguna
        </Button>
      </div>
      
      {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{successMessage}</div>}

      <Card className="overflow-x-auto">
        {isLoading ? (
            <div className="py-10"><Spinner /></div>
        ) : (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Nama Pengguna</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Peran</th>
                        <th scope="col" className="px-6 py-3"><span className="sr-only">Aksi</span></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.name}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">{user.role}</td>
                            <td className="px-6 py-4 text-right">
                                <Button variant="secondary" onClick={() => handleOpenEditModal(user)}>
                                    Edit
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
          <Card className="w-full max-w-md">
            <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                    {modalMode === 'edit' ? `Edit Pengguna: ${currentUser?.name}` : 'Tambah Pengguna Baru'}
                </h2>
                <button onClick={handleCloseModal} aria-label="Tutup modal" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              {modalError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm" role="alert"><p>{modalError}</p></div>}
              
              {modalMode === 'add' && (
                <Input
                    id="name"
                    label="Nama Lengkap"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
              )}

              <Input
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <Input
                id="password"
                label={modalMode === 'add' ? 'Password' : 'Password Baru (kosongkan jika tidak diubah)'}
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                required={modalMode === 'add'}
              />

              {modalMode === 'add' && (
                <Select id="role" label="Peran" value={role} onChange={(e) => setRole(e.target.value as UserRole)} required>
                    <option value={UserRole.SALES}>Sales / Marketing</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                </Select>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={handleCloseModal} disabled={isSaving}>Batal</Button>
                <Button type="submit" isLoading={isSaving} disabled={isSaving}>
                    {modalMode === 'edit' ? 'Simpan Perubahan' : 'Tambah Pengguna'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Akun;