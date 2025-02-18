package edu.icet.crn.service.impl;

import edu.icet.crn.dto.Employee;
import edu.icet.crn.entity.EmployeeEntity;
import edu.icet.crn.repository.EmployeeRepository;
import edu.icet.crn.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    final EmployeeRepository employeeRepository;
    final ModelMapper modelMapper;

    @Override
    public void saveEmployee(Employee employee) {
        employeeRepository.save(modelMapper.map(employee, EmployeeEntity.class));
    }

    @Override
    public List<Employee> getAll() {
        List<EmployeeEntity> employeeEntityList = employeeRepository.findAll();
        List<Employee> employeeList = new ArrayList<>();
        employeeEntityList.forEach(employeeEntity -> {
            Employee employee = modelMapper.map(employeeEntity, Employee.class);
            employeeList.add(employee);
        });
        return employeeList;
    }

    @Override
    public void deleteEmployee(Integer id) {
        employeeRepository.deleteById(id);
    }

    @Override
    public void updateEmployee(Employee employee) {
        employeeRepository.save(modelMapper.map(employee, EmployeeEntity.class));
    }

    @Override
    public List<Employee> searchByName(String name) {
        List<EmployeeEntity> employeeEntityList = employeeRepository.findByName(name);
        List<Employee> employeeList = new ArrayList<>();
        employeeEntityList.forEach(employeeEntity -> {
            employeeList.add(modelMapper.map(employeeEntity, Employee.class));
        });
        return employeeList;
    }

}
