import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Content.css';

const Content = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  
  const API_BASE_URL = 'http://localhost:8080/employee';

  useEffect(() => {
    fetchEmployees();
    
    const handleResize = () => {
      const searchSection = document.querySelector('.search-add-section');
      if (window.innerWidth < 768) {
        searchSection.classList.add('flex-column');
        searchSection.classList.remove('align-items-center');
      } else {
        searchSection.classList.remove('flex-column');
        searchSection.classList.add('align-items-center');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/all`);
      if (!response.ok) throw new Error("Failed to fetch employee data");
      const data = await response.json();
      setEmployeeList(data);
      setFilteredList(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setError("Failed to load employee data.");
      setIsLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load employee data.',
        confirmButtonColor: '#457b9d'
      });
    }
  };

  const searchEmployee = () => {
    if (searchQuery.trim() === "") {
      setFilteredList(employeeList);
      return;
    }
    
    const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term);
    
    const filtered = employeeList.filter(employee => 
      searchTerms.every(term => 
        employee.name?.toLowerCase().includes(term) || 
        employee.position?.toLowerCase().includes(term) || 
        employee.department?.toLowerCase().includes(term) || 
        employee.email?.toLowerCase().includes(term)
      )
    );
    
    setFilteredList(filtered);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === "") {
      setFilteredList(employeeList);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchEmployee();
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedList = [...filteredList].sort((a, b) => {
      if (a[key] === null) return 1;
      if (b[key] === null) return -1;
      
      if (key === 'salary') {
        return direction === 'ascending' 
          ? parseInt(a[key]) - parseInt(b[key])
          : parseInt(b[key]) - parseInt(a[key]);
      }
      
      if (typeof a[key] === 'string') {
        return direction === 'ascending'
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      }
      
      return direction === 'ascending' 
        ? a[key] - b[key]
        : b[key] - a[key];
    });
    
    setFilteredList(sortedList);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' 
      ? <span className="sort-indicator">▲</span> 
      : <span className="sort-indicator">▼</span>;
  };

  const addEmployee = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add New Employee',
      html: `
        <div class="container text-start custom-swal-form">
          <div class="mb-3">
            <label for="swal-name" class="form-label fw-bold">Full Name</label>
            <input id="swal-name" class="form-control shadow-sm" placeholder="Enter full name">
          </div>
          <div class="mb-3">
            <label for="swal-position" class="form-label fw-bold">Position</label>
            <select id="swal-position" class="form-select shadow-sm">
              <option value="">Select Position</option>
              <option>Intern SE</option>
              <option>Associate SE</option>
              <option>Software Engineer</option>
              <option>Senior SE</option>
              <option>Associate Tech Lead</option>
              <option>Tech Lead</option>
              <option>Senior Tech Lead</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="swal-department" class="form-label fw-bold">Department</label>
            <select id="swal-department" class="form-select shadow-sm">
              <option value="">Select Department</option>
              <option>IT</option>
              <option>HR</option>
              <option>Finance</option>
              <option>Marketing</option>
              <option>Operations</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="swal-salary" class="form-label fw-bold">Salary (LKR)</label>
            <input id="swal-salary" type="number" class="form-control shadow-sm" placeholder="Enter salary">
          </div>
          <div class="mb-3">
            <label for="swal-date" class="form-label fw-bold">Date of Hire</label>
            <input id="swal-date" type="date" class="form-control shadow-sm">
          </div>
          <div class="mb-3">
            <label for="swal-email" class="form-label fw-bold">Email</label>
            <input id="swal-email" type="email" class="form-control shadow-sm" placeholder="Enter email">
          </div>
          <div class="mb-3">
            <label for="swal-mobile" class="form-label fw-bold">Mobile Number</label>
            <input id="swal-mobile" type="text" class="form-control shadow-sm" placeholder="Enter mobile number">
          </div>
        </div>
      `,
      customClass: {
        container: 'custom-swal-container',
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        confirmButton: 'custom-swal-confirm-btn',
        cancelButton: 'custom-swal-cancel-btn'
      },
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-plus"></i> Add Employee',
      confirmButtonColor: '#2a9d8f',
      cancelButtonColor: '#6c757d',
      preConfirm: () => {
        const name = document.getElementById('swal-name').value.trim();
        const position = document.getElementById('swal-position').value;
        const department = document.getElementById('swal-department').value;
        const salary = document.getElementById('swal-salary').value;
        const dateOfHire = document.getElementById('swal-date').value;
        const email = document.getElementById('swal-email').value.trim();
        const mobileNumber = document.getElementById('swal-mobile').value.trim();
        
        if (!name || !position || !department || !salary || !dateOfHire || !email || !mobileNumber) {
          Swal.showValidationMessage('Please fill in all fields');
          return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          Swal.showValidationMessage('Please enter a valid email address');
          return false;
        }
        
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(mobileNumber.replace(/\D/g, ''))) {
          Swal.showValidationMessage('Please enter a valid 10-digit phone number');
          return false;
        }
        
        return {
          name,
          position,
          department,
          salary,
          dateOfHire,
          email,
          mobileNumber
        };
      }
    });

    if (formValues) {
      try {
        Swal.fire({
          title: 'Adding Employee...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        const response = await fetch(`${API_BASE_URL}/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formValues)
        });

        if (!response.ok) {
          throw new Error('Failed to add employee');
        }

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Employee added successfully!',
          confirmButtonColor: '#2a9d8f',
          timer: 2000,
          timerProgressBar: true
        });
        
        fetchEmployees();
      } catch (error) {
        console.error('Error adding employee:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
          confirmButtonColor: '#e63946'
        });
      }
    }
  };

  const updateEmployee = async (id) => {
    try {
      Swal.fire({
        title: 'Loading Employee Data...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      const response = await fetch(`${API_BASE_URL}/search-by-id/${id}`);
      if (!response.ok) throw new Error('Employee not found');
      const employee = await response.json();

      const { value: formValues } = await Swal.fire({
        title: 'Update Employee',
        html: `
          <div class="container text-start custom-swal-form">
            <div class="mb-3">
              <label for="swal-name" class="form-label fw-bold">Full Name</label>
              <input id="swal-name" class="form-control shadow-sm" value="${employee.name}">
            </div>
            <div class="mb-3">
              <label for="swal-position" class="form-label fw-bold">Position</label>
              <select id="swal-position" class="form-select shadow-sm">
                <option ${employee.position === 'Intern SE' ? 'selected' : ''}>Intern SE</option>
                <option ${employee.position === 'Associate SE' ? 'selected' : ''}>Associate SE</option>
                <option ${employee.position === 'Software Engineer' ? 'selected' : ''}>Software Engineer</option>
                <option ${employee.position === 'Senior SE' ? 'selected' : ''}>Senior SE</option>
                <option ${employee.position === 'Associate Tech Lead' ? 'selected' : ''}>Associate Tech Lead</option>
                <option ${employee.position === 'Tech Lead' ? 'selected' : ''}>Tech Lead</option>
                <option ${employee.position === 'Senior Tech Lead' ? 'selected' : ''}>Senior Tech Lead</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="swal-department" class="form-label fw-bold">Department</label>
              <select id="swal-department" class="form-select shadow-sm">
                <option ${employee.department === 'IT' ? 'selected' : ''}>IT</option>
                <option ${employee.department === 'HR' ? 'selected' : ''}>HR</option>
                <option ${employee.department === 'Finance' ? 'selected' : ''}>Finance</option>
                <option ${employee.department === 'Marketing' ? 'selected' : ''}>Marketing</option>
                <option ${employee.department === 'Operations' ? 'selected' : ''}>Operations</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="swal-salary" class="form-label fw-bold">Salary (LKR)</label>
              <input id="swal-salary" type="number" class="form-control shadow-sm" value="${employee.salary}">
            </div>
            <div class="mb-3">
              <label for="swal-date" class="form-label fw-bold">Date of Hire</label>
              <input id="swal-date" type="date" class="form-control shadow-sm" value="${employee.dateOfHire}">
            </div>
            <div class="mb-3">
              <label for="swal-email" class="form-label fw-bold">Email</label>
              <input id="swal-email" type="email" class="form-control shadow-sm" value="${employee.email}">
            </div>
            <div class="mb-3">
              <label for="swal-mobile" class="form-label fw-bold">Mobile Number</label>
              <input id="swal-mobile" type="text" class="form-control shadow-sm" value="${employee.mobileNumber}">
            </div>
          </div>
        `,
        customClass: {
          container: 'custom-swal-container',
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
          confirmButton: 'custom-swal-confirm-btn',
          cancelButton: 'custom-swal-cancel-btn'
        },
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-save"></i> Update Employee',
        confirmButtonColor: '#fca311',
        cancelButtonColor: '#6c757d',
        preConfirm: () => {
          const name = document.getElementById('swal-name').value.trim();
          const position = document.getElementById('swal-position').value;
          const department = document.getElementById('swal-department').value;
          const salary = document.getElementById('swal-salary').value;
          const dateOfHire = document.getElementById('swal-date').value;
          const email = document.getElementById('swal-email').value.trim();
          const mobileNumber = document.getElementById('swal-mobile').value.trim();
          
          if (!name || !position || !department || !salary || !dateOfHire || !email || !mobileNumber) {
            Swal.showValidationMessage('Please fill in all fields');
            return false;
          }
          
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            Swal.showValidationMessage('Please enter a valid email address');
            return false;
          }
          
          const phoneRegex = /^\d{10}$/;
          if (!phoneRegex.test(mobileNumber.replace(/\D/g, ''))) {
            Swal.showValidationMessage('Please enter a valid 10-digit phone number');
            return false;
          }
          
          return {
            id: employee.id,
            name,
            position,
            department,
            salary,
            dateOfHire,
            email,
            mobileNumber
          };
        }
      });

      if (formValues) {
        Swal.fire({
          title: 'Updating Employee...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        const response = await fetch(`${API_BASE_URL}/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formValues)
        });

        if (!response.ok) {
          throw new Error('Failed to update employee');
        }

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Employee updated successfully!',
          confirmButtonColor: '#fca311',
          timer: 2000,
          timerProgressBar: true
        });
        
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        confirmButtonColor: '#e63946'
      });
    }
  };

  const deleteEmployee = async (id, name) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `You are about to delete <strong>${name}</strong>. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#e63946',
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#6c757d',
      customClass: {
        confirmButton: 'btn-lg',
        cancelButton: 'btn-lg'
      }
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Deleting Employee...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete employee');
        }

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Employee has been deleted.',
          confirmButtonColor: '#457b9d',
          timer: 2000,
          timerProgressBar: true
        });
        
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
          confirmButtonColor: '#e63946'
        });
      }
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'LKR 0';
    return `LKR ${parseInt(salary).toLocaleString()}`;
  };

  const handleSwipe = () => {
    const tableContainer = document.querySelector('.table-responsive');
    if (!tableContainer) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    tableContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    tableContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
    }, false);
    
    const handleSwipeGesture = () => {
      if (touchEndX < touchStartX) {
        tableContainer.scrollLeft += 100;
      }
      if (touchEndX > touchStartX) {
        tableContainer.scrollLeft -= 100;
      }
    };
  };

  useEffect(() => {
    handleSwipe();
  }, [filteredList]);

  const renderSkeletonLoader = () => {
    return Array(5).fill().map((_, i) => (
      <tr key={`skeleton-${i}`} className="skeleton-row">
        <td><div className="skeleton-cell"></div></td>
        <td><div className="skeleton-cell"></div></td>
        <td><div className="skeleton-cell"></div></td>
        <td><div className="skeleton-cell"></div></td>
        <td><div className="skeleton-cell"></div></td>
        <td><div className="skeleton-cell"></div></td>
        <td><div className="skeleton-cell"></div></td>
        <td><div className="skeleton-cell"></div></td>
        <td><div className="skeleton-cell"></div></td>
        <td><div className="skeleton-cell skeleton-action"></div></td>
      </tr>
    ));
  };

  return (
    <div className="container">
      <div className="content">
        <div className="page-title">
          <h1>Employee Management</h1>
          <div className="subtitle">Manage your organization's employees</div>
        </div>
        
        <div className="search-add-section">
          <div className="search-container">
            <input
              type="text"
              id="searchInput"
              className="form-control search-input"
              placeholder="Search by name, position, department..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
            />
            <button className="btn btn-primary" onClick={searchEmployee}>
              <i className="fas fa-search"></i> Search
            </button>
          </div>
          <button className="btn btn-success add-btn" onClick={addEmployee}>
            <i className="fas fa-plus"></i> Add Employee
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <span>Employee List</span>
              {filteredList.length > 0 && (
                <span className="record-count">{filteredList.length} Records</span>
              )}
            </div>
          </div>
          <div className="card-body">
            {isLoading ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Position</th>
                      <th>Department</th>
                      <th>Salary</th>
                      <th>Date of Hire</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderSkeletonLoader()}
                  </tbody>
                </table>
              </div>
            ) : error ? (
              <div className="alert alert-danger">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
                <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchEmployees}>
                  <i className="fas fa-sync-alt"></i> Retry
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <div className="swipe-instruction d-md-none">
                  <i className="fas fa-hand-point-right"></i> Swipe to view more
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th className="sortable" onClick={() => requestSort('id')}>
                        Employee ID {getSortIndicator('id')}
                      </th>
                      <th className="sortable" onClick={() => requestSort('name')}>
                        Name {getSortIndicator('name')}
                      </th>
                      <th className="sortable" onClick={() => requestSort('position')}>
                        Position {getSortIndicator('position')}
                      </th>
                      <th className="sortable" onClick={() => requestSort('department')}>
                        Department {getSortIndicator('department')}
                      </th>
                      <th className="sortable" onClick={() => requestSort('salary')}>
                        Salary {getSortIndicator('salary')}
                      </th>
                      <th className="sortable" onClick={() => requestSort('dateOfHire')}>
                        Date of Hire {getSortIndicator('dateOfHire')}
                      </th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="text-center py-5">
                          <div className="no-data">
                            <i className="fas fa-search fa-3x mb-3"></i>
                            <h5>No employees found</h5>
                            <p className="text-muted">Try adjusting your search criteria</p>
                            {searchQuery && (
                              <button 
                                className="btn btn-outline-primary btn-sm mt-2" 
                                onClick={() => {
                                  setSearchQuery('');
                                  setFilteredList(employeeList);
                                }}
                              >
                                Clear Search
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredList.map((employee, index) => (
                        <tr key={employee.id} className="employee-row">
                          <td>{index + 1}</td>
                          <td>
                            <span className="employee-id">{employee.id}</span>
                          </td>
                          <td>
                            <div className="employee-name">{employee.name}</div>
                          </td>
                          <td>
                            <span className={`position-badge position-${employee.position.replace(/\s+/g, '-').toLowerCase()}`}>
                              {employee.position}
                            </span>
                          </td>
                          <td>
                            <span className={`department-badge department-${employee.department.toLowerCase()}`}>
                              {employee.department}
                            </span>
                          </td>
                          <td className="salary-cell">{formatSalary(employee.salary)}</td>
                          <td>{employee.dateOfHire}</td>
                          <td className="email-cell">
                            <a href={`mailto:${employee.email}`} className="employee-email">
                              {employee.email}
                            </a>
                          </td>
                          <td>
                            <a href={`tel:${employee.mobileNumber}`} className="employee-phone">
                              {employee.mobileNumber}
                            </a>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn btn-warning btn-sm" 
                                onClick={() => updateEmployee(employee.id)}
                                title="Update Employee"
                              >
                                <i className="fas fa-edit"></i>
                                <span className="d-none d-lg-inline ms-1">Update</span>
                              </button>
                              <button 
                                className="btn btn-danger btn-sm" 
                                onClick={() => deleteEmployee(employee.id, employee.name)}
                                title="Delete Employee"
                              >
                                <i className="fas fa-trash"></i>
                                <span className="d-none d-lg-inline ms-1">Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;