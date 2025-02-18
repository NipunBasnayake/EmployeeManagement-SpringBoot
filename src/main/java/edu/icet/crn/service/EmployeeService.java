package edu.icet.crn.service;

import edu.icet.crn.dto.Employee;

import java.util.List;

public interface EmployeeService {

    void saveEmployee(Employee employee);

    List<Employee> getAll();

    void deleteEmployee(Integer id);

    void updateEmployee(Employee employee);

    List<Employee> searchByName(String name);
}
