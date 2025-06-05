

"use client";

import React, { useState, useEffect } from 'react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    enabled: true,
    roles: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersResponse = await fetch('/api/users');
        const usersData = await usersResponse.json();
        setUsers(usersData);

        const rolesResponse = await fetch('/api/roles');
        const rolesData = await rolesResponse.json();
        setRoles(rolesData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    const selectedRoles = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setNewUser({ ...newUser, roles: selectedRoles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        // Refresh users list
        const usersResponse = await fetch('/api/users');
        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Clear the form
        setNewUser({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          enabled: true,
          roles: [],
        });
      } else {
        console.error('Failed to create user');
      }
    } catch (err) {
      setError(err);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h1>Users</h1>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={newUser.firstName}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={newUser.lastName}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Enabled:
          <input
            type="checkbox"
            name="enabled"
            checked={newUser.enabled}
            onChange={(e) =>
              setNewUser({ ...newUser, enabled: e.target.checked })
            }
          />
        </label>
        <br />
        <label>
          Roles:
          <select multiple name="roles" value={newUser.roles} onChange={handleRoleChange}>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Create User</button>
      </form>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.firstName} {user.lastName} ({user.email}) - Roles: {user.roles.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;

