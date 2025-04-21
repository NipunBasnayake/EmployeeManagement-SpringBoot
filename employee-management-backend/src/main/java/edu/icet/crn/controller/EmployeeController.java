package edu.icet.crn.controller;

import edu.icet.crn.dto.Employee;
import edu.icet.crn.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employee")
@RequiredArgsConstructor
@CrossOrigin
public class EmployeeController {

    final EmployeeService employeeService;

    @PostMapping("/add")
    public void addEmployee(@RequestBody Employee employee) {
        employeeService.saveEmployee(employee);
    }

    @GetMapping("/all")
    public List<Employee> getAllEmployees() {
        return employeeService.getAll();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteEmployee(@PathVariable Integer id) {
        employeeService.deleteEmployee(id);
    }

    @PutMapping("/update")
    public void updateEmployee(@RequestBody Employee employee) {
        employeeService.updateEmployee(employee);
    }

    @GetMapping("/search-by-id/{id}")
    public Employee getEmployeeById(@PathVariable Integer id) {
        return employeeService.searchById(id);
    }

    @GetMapping("/search-by-name/{name}")
    public List<Employee> searchEmployee(@PathVariable String name) {
        return employeeService.searchByName(name);
    }

}
