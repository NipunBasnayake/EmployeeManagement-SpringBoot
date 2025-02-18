package edu.icet.crn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Employee {
    private Integer id;
    private String name;
    private String position;
    private String department;
    private Double salary;
    private String dateOfHire;
    private String mobileNumber;
    private String email;
}
