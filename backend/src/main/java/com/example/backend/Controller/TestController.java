package com.example.backend.Controller;

import org.springframework.web.bind.annotation.*;

import java.text.DateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

@RestController
@RequestMapping("/api/test")
@CrossOrigin("*")
public class TestController {

    @GetMapping("/date")
    public void testDate(){
        String dateString="10/06/2024";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
        LocalDate date=LocalDate.parse(dateString,formatter);
        System.out.println(date.toString());
        System.out.println(date.getYear());
    }
}
