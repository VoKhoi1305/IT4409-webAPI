import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import apiService from './services/apiService';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import Modal from './components/Modal';
import UserForm from './components/UserForm';
import UserTable from './components/UserTable';
import Alert from './components/Alert';

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });

  const usersPerPage = 5;

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  /**
   * Show alert message
   */
  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), 3000);
  };

  /**
   * Fetch all users from API
   */
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getUsers();
      setUsers(data);
      setFilteredUsers(data);
      showAlert('Tải dữ liệu thành công!', 'success');
    } catch (error) {
      showAlert('Lỗi khi tải dữ liệu người dùng!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

 
  const handleCreateUser = async (userData) => {
  setIsLoading(true);
  try {
    const newUser = await apiService.createUser(userData);
    const updatedUsers = [...users, { ...newUser, id: users.length + 1 }];  
    setUsers(updatedUsers);
    setIsModalOpen(false);
    showAlert('Thêm người dùng thành công!', 'success');
  } catch (error) {
    showAlert('Lỗi khi thêm người dùng!', 'error');
  } finally {
    setIsLoading(false);
  }
};

  const handleUpdateUser = async (userData) => {
    setIsLoading(true);
    try {
      await apiService.updateUser(editingUser.id, userData);
     
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id ? { ...user, ...userData } : user
      );
      setUsers(updatedUsers);
      setIsModalOpen(false);
      setEditingUser(null);
      showAlert('Cập nhật người dùng thành công!', 'success');
    } catch (error) {
      showAlert('Lỗi khi cập nhật người dùng!', 'error');
    } finally {
      setIsLoading(false);
    }
  };


  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn xóa ${user.name}?`)) return;

    try {
      await apiService.deleteUser(user.id);
      const updatedUsers = users.filter((u) => u.id !== user.id);
      setUsers(updatedUsers);
      showAlert('Xóa người dùng thành công!', 'success');
    } catch (error) {
      showAlert('Lỗi khi xóa người dùng!', 'error');
    }
  };

 
  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };


  const handleAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

 
  const handleFormSubmit = (userData) => {
    if (editingUser) {
      handleUpdateUser(userData);
    } else {
      handleCreateUser(userData);
    }
  };


  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="app-container">
      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: '', type: '' })}
      />

      <div className="main-content">
      
        <div className="app-header">
          <h1 className="app-title">Quản lý người dùng</h1>
        </div>


        <div className="actions-bar">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          
          <button onClick={handleAdd} className="btn btn-add">
            <Plus size={20} />
            Thêm người dùng
          </button>
        </div>


        <UserTable
          users={currentUsers}
          onEdit={handleEdit}
          onDelete={handleDeleteUser}
          isLoading={isLoading}
        />


        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}


        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        >
          <UserForm
            user={editingUser}
            onSubmit={handleFormSubmit}
            onCancel={handleModalClose}
            isLoading={isLoading}
          />
        </Modal>
      </div>
    </div>
  );
}

export default App;