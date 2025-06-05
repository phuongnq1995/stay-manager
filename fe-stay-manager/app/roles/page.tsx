

"use client";

import React, { useState, useEffect } from 'react';

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [newRole, setNewRole] = useState({ name: '', privileges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const rolesResponse = await fetch('/api/roles');
        const rolesData = await rolesResponse.json();
        setRoles(rolesData);

        const privilegesResponse = await fetch('/api/master/privileges');
        const privilegesData = await privilegesResponse.json();
        setPrivileges(privilegesData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setNewRole({ ...newRole, [e.target.name]: e.target.value });
  };

  const handlePrivilegeChange = (e) => {
    const selectedPrivileges = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setNewRole({ ...newRole, privileges: selectedPrivileges });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRole),
      });

      if (response.ok) {
        // Refresh roles list
        const rolesResponse = await fetch('/api/roles');
        const rolesData = await rolesResponse.json();
        setRoles(rolesData);

        // Clear the form
        setNewRole({ name: '', privileges: [] });
      } else {
        console.error('Failed to create role');
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
      <h1>Roles</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={newRole.name}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Privileges:
          <select
            multiple
            name="privileges"
            value={newRole.privileges}
            onChange={handlePrivilegeChange}
          >
            {privileges.map((privilege) => (
              <option key={privilege} value={privilege}>
                {privilege}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Create Role</button>
      </form>
      <h2>Role List</h2>
      <ul>
        {roles.map((role) => (
          <li key={role.id}>
            {role.name} - {role.privileges.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RolesPage;

