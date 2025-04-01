let employeeArray = [];

async function populateTable() {
    let employeeTable = document.getElementById("employeeTable");
    employeeTable.innerHTML = "";

    try {
        const response = await fetch("http://localhost:8080/employee/all");
        if (!response.ok) throw new Error("Failed to fetch employee data");
        employeeArray = await response.json();

        employeeArray.forEach((employee, index) => {
            let row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${employee.id}</td>
                    <td>${employee.name}</td>
                    <td>${employee.position}</td>
                    <td>${employee.department}</td>
                    <td>LKR ${employee.salary.toLocaleString()}</td>
                    <td>${employee.dateOfHire}</td>
                    <td>${employee.email}</td>
                    <td>${employee.mobileNumber}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2" onclick="updateEmployee(${employee.id})">Update</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${employee.id})">Delete</button>
                    </td>
                </tr>
            `;
            employeeTable.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching employee data:", error);
        Swal.fire("Error", "Failed to load employee data.", "error");
    }
}

async function updateEmployee(id) {
    try {
        const response = await fetch(`http://localhost:8080/employee/search-by-id/${id}`);
        if (!response.ok) throw new Error("Employee not found");
        const employee = await response.json();

        const { value: formValues } = await Swal.fire({
            title: 'Update Employee',
            html: `
                <div class="container text-start">
                    <div class="mb-4">
                        <label for="swal-name" class="form-label label-small">Full Name</label>
                        <input id="swal-name" class="form-control pt-2 pb-2" value="${employee.name}">
                    </div>
                    <div class="mb-4">
                        <label for="swal-position" class="form-label label-small">Position</label>
                        <select id="swal-position" class="form-select pt-2 pb-2">
                            <option ${employee.position === "Intern SE" ? "selected" : ""}>Intern SE</option>
                            <option ${employee.position === "Associate SE" ? "selected" : ""}>Associate SE</option>
                            <option ${employee.position === "Software Engineer" ? "selected" : ""}>Software Engineer</option>
                            <option ${employee.position === "Senior SE" ? "selected" : ""}>Senior SE</option>
                            <option ${employee.position === "Associate Tech Lead" ? "selected" : ""}>Associate Tech Lead</option>
                            <option ${employee.position === "Tech Lead" ? "selected" : ""}>Tech Lead</option>
                            <option ${employee.position === "Senior Tech Lead" ? "selected" : ""}>Senior Tech Lead</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label for="swal-department" class="form-label label-small">Department</label>
                        <select id="swal-department" class="form-select pt-2 pb-2">
                            <option ${employee.department === "IT" ? "selected" : ""}>IT</option>
                            <option ${employee.department === "HR" ? "selected" : ""}>HR</option>
                            <option ${employee.department === "Finance" ? "selected" : ""}>Finance</option>
                            <option ${employee.department === "Marketing" ? "selected" : ""}>Marketing</option>
                            <option ${employee.department === "Operations" ? "selected" : ""}>Operations</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label for="swal-salary" class="form-label label-small">Salary (LKR)</label>
                        <input id="swal-salary" type="number" class="form-control pt-2 pb-2" value="${employee.salary}">
                    </div>
                    <div class="mb-4">
                        <label for="swal-date" class="form-label label-small">Date of Hire</label>
                        <input id="swal-date" type="date" class="form-control pt-2 pb-2" value="${employee.dateOfHire}">
                    </div>
                    <div class="mb-4">
                        <label for="swal-email" class="form-label label-small">Email</label>
                        <input id="swal-email" type="email" class="form-control pt-2 pb-2" value="${employee.email}">
                    </div>
                    <div class="mb-4">
                        <label for="swal-mobile" class="form-label label-small">Mobile Number</label>
                        <input id="swal-mobile" type="text" class="form-control pt-2 pb-2" value="${employee.mobileNumber}">
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Update Employee",
            preConfirm: () => {
                return {
                    id: employee.id,
                    name: document.getElementById("swal-name").value.trim(),
                    position: document.getElementById("swal-position").value,
                    department: document.getElementById("swal-department").value,
                    salary: document.getElementById("swal-salary").value,
                    dateOfHire: document.getElementById("swal-date").value,
                    email: document.getElementById("swal-email").value.trim(),
                    mobileNumber: document.getElementById("swal-mobile").value.trim()
                };
            }
        });

        if (formValues) {
            const response = await fetch("http://localhost:8080/employee/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValues)
            });
            if (!response.ok) throw new Error("Failed to update employee");
            Swal.fire("Success!", "Employee updated successfully!", "success");
            populateTable();
        }
    } catch (error) {
        console.error("Error updating employee:", error);
        Swal.fire("Error", error.message, "error");
    }
}

async function deleteEmployee(id) {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`http://localhost:8080/employee/delete/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Employee not found");
            Swal.fire("Success!", "Employee deleted successfully!", "success");
            populateTable();
        } catch (error) {
            console.error("Error deleting employee:", error);
            Swal.fire("Error", error.message, "error");
        }
    }
}

async function addEmployee() {
    const { value: formValues } = await Swal.fire({
        title: "Add New Employee",
        html: `
            <div class="container text-start">
                <div class="mb-4">
                    <label for="swal-name" class="form-label label-small">Full Name</label>
                    <input id="swal-name" class="form-control pt-2 pb-2" placeholder="Enter full name">
                </div>
                <div class="mb-4">
                    <label for="swal-position" class="form-label label-small">Position</label>
                    <select id="swal-position" class="form-select pt-2 pb-2">
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
                <div class="mb-4">
                    <label for="swal-department" class="form-label label-small">Department</label>
                    <select id="swal-department" class="form-select pt-2 pb-2">
                        <option value="">Select Department</option>
                        <option>IT</option>
                        <option>HR</option>
                        <option>Finance</option>
                        <option>Marketing</option>
                        <option>Operations</option>
                    </select>
                </div>
                <div class="mb-4">
                    <label for="swal-salary" class="form-label label-small">Salary (LKR)</label>
                    <input id="swal-salary" type="number" class="form-control pt-2 pb-2" placeholder="Enter salary">
                </div>
                <div class="mb-4">
                    <label for="swal-date" class="form-label label-small">Date of Hire</label>
                    <input id="swal-date" type="date" class="form-control pt-2 pb-2">
                </div>
                <div class="mb-4">
                    <label for="swal-email" class="form-label label-small">Email</label>
                    <input id="swal-email" type="email" class="form-control pt-2 pb-2" placeholder="Enter email">
                </div>
                <div class="mb-4">
                    <label for="swal-mobile" class="form-label label-small">Mobile Number</label>
                    <input id="swal-mobile" type="text" class="form-control pt-2 pb-2" placeholder="Enter mobile number">
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Add Employee",
        preConfirm: () => {
            return {
                name: document.getElementById("swal-name").value.trim(),
                position: document.getElementById("swal-position").value,
                department: document.getElementById("swal-department").value,
                salary: document.getElementById("swal-salary").value,
                dateOfHire: document.getElementById("swal-date").value,
                email: document.getElementById("swal-email").value.trim(),
                mobileNumber: document.getElementById("swal-mobile").value.trim()
            };
        }
    });

    if (formValues) {
        try {
            const response = await fetch("http://localhost:8080/employee/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValues)
            });
            if (!response.ok) throw new Error("Failed to add employee");
            Swal.fire("Success!", "Employee added successfully!", "success");
            populateTable();
        } catch (error) {
            console.error("Error adding employee:", error);
            Swal.fire("Error", error.message, "error");
        }
    }
}

function searchEmployee() {
    let searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
    let employeeTable = document.getElementById("employeeTable");
    employeeTable.innerHTML = ""; 

    if (searchInput === "") {
        populateTable();
        return;
    }

    employeeArray.forEach((employee, index) => {
        if (employee.name.toLowerCase().includes(searchInput) || employee.position.toLowerCase().includes(searchInput) || employee.department.toLowerCase().includes(searchInput)) {
            let row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${employee.id}</td>
                    <td>${employee.name}</td>
                    <td>${employee.position}</td>
                    <td>${employee.department}</td>
                    <td>LKR ${employee.salary.toLocaleString()}</td>
                    <td>${employee.dateOfHire}</td>
                    <td>${employee.email}</td>
                    <td>${employee.mobileNumber}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2" onclick="updateEmployee(${employee.id})">Update</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${employee.id})">Delete</button>
                    </td>
                </tr>
            `;
            employeeTable.innerHTML += row;
        }
    });
}

document.addEventListener("DOMContentLoaded", populateTable);