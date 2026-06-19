import React, { useEffect, useState } from 'react'
import './Users.css'

const Users = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const res = await fetch('http://localhost:4000/allusers');
        const data = await res.json();
        setUsers(data);
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    const deleteUser = async (userId, userName) => {
        if (!window.confirm(`Bạn có chắc muốn xóa tài khoản "${userName}"?`)) return;
        await fetch('http://localhost:4000/deleteuser', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });
        await fetchUsers();
    }

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN');
    }

    const getCartItemCount = (cartData) => {
        if (!cartData) return 0;
        return Object.values(cartData).reduce((sum, qty) => sum + qty, 0);
    }

    return (
        <div className='admin-users'>
            <h1>Quản lý người dùng</h1>
            <p className='admin-users-count'>Tổng số: <b>{users.length}</b> tài khoản</p>
            <div className='admin-users-table-wrapper'>
                <table className='admin-users-table'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Ngày đăng ký</th>
                            <th>Giỏ hàng</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 && (
                            <tr><td colSpan={6} style={{textAlign:'center'}}>Chưa có tài khoản nào.</td></tr>
                        )}
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{formatDate(user.date)}</td>
                                <td>{getCartItemCount(user.cartData)} sản phẩm</td>
                                <td>
                                    <button
                                        className='admin-users-delete'
                                        onClick={() => deleteUser(user._id, user.name)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Users
