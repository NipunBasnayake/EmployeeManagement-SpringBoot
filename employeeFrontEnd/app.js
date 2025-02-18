populateTable();

function populateTable() {
    let employeeTable = document.getElementById("employeeTable");

    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://localhost:8080/employee/all", requestOptions)
        .then(response => response.json()) 
        .then(data => {
            employeeTable.innerHTML = ""; 

            data.forEach((employee, index) => {
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
                            <button class="btn btn-warning btn-sm" onclick="updateEmployee(${employee.id})">Update</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteEmployee(${employee.id})">Delete</button>
                        </td>
                    </tr>
                `;
                employeeTable.innerHTML += row;
            });
        })
        .catch(error => console.error("Error fetching employee data:", error));
}

function updateEmployee(id) {
    console.log(id);
}

function deleteEmployee(id) {
    console.log(id);
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
                    <select id="swal-position" class="form-select  pt-2 pb-2">
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
                    <select id="swal-department" class="form-select  pt-2 pb-2">
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
        console.log("New Employee Data:", formValues);
        Swal.fire("Success!", "Employee added successfully!", "success");
        
        await fetch("http://localhost:8080/employee/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formValues)
        })
        .then(response => response.json())
        .then(data => console.log("Employee added:", data))
        .catch(error => console.error("Error adding employee:", error));
    }
}
