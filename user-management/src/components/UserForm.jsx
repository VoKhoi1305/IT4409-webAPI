import React, { useState } from 'react';
import { Check } from 'lucide-react';

const UserForm = ({ user, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.phone) {
      onSubmit(formData);
    }
  };

  return (
    <div className="user-form">
      <div className="form-group">
        <label className="form-label">Họ và tên</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
          placeholder="Nhập họ tên"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
          placeholder="example@email.com"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Số điện thoại</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="form-input"
          placeholder="0123456789"
        />
      </div>

      <div className="form-actions">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="btn btn-primary"
        >
          <Check size={20} />
          {isLoading ? 'Đang xử lý...' : user ? 'Cập nhật' : 'Thêm mới'}
        </button>
        <button onClick={onCancel} className="btn btn-secondary">
          Hủy
        </button>
      </div>
    </div>
  );
};

export default UserForm;