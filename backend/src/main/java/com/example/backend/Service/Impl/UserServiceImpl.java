package com.example.backend.Service.Impl;

import com.example.backend.Dto.ReadingDto;
import com.example.backend.Dto.UserDto;
import com.example.backend.Model.persistent.Reading;
import com.example.backend.Model.persistent.User;
import com.example.backend.Repository.persistent.ReadingRepository;
import com.example.backend.Repository.persistent.UserRepository;
import com.example.backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {


    @Autowired
    UserRepository userRepository;

    @Autowired
    ReadingRepository readingRepository;

    public User getUser(){
        String username=SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username);
    }

    @Override
    public UserDto getUserDetails() throws Exception {
        try{
            User user=getUser();
            return UserDto.builder().username(user.getUsername()).consumerNumber(user.getConsumerNumber()).build();
        }catch (Exception e){
            System.out.println("loc: UserServiceImpl; fn: getUserDetails(); "+e.getMessage());
            throw new Exception(e.getMessage());
        }
    }

    public boolean addNewEntry(ReadingDto readingDto) throws Exception{
        try{
            User user=getUser();
            if(readingRepository.existsByDateAndUser(readingDto.getDate(),user)){
                throw new RuntimeException("Entry already present for this month"+readingDto.getDate());
            }
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            LocalDate date=LocalDate.parse(readingDto.getDate(),formatter);
            Reading reading=Reading.builder().date(date.toString()).user(user).year(String.valueOf(date.getYear())).importReading(readingDto.getImportReading()).exportReading(readingDto.getExportReading()).solarReading(readingDto.getSolarReading()).build();
            readingRepository.save(reading);
            return true;
        }catch (Exception e){
            System.out.println("loc: UserServiceImpl; fn: addNewEntry; "+e.getMessage());
            System.out.println(e.getStackTrace());
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public List<ReadingDto> getEntries() throws Exception {
        try{
            User user=getUser();
            String year=String.valueOf(LocalDate.now().getYear());
            List<Reading> list= (List<Reading>) readingRepository.findAllByYear(year);

            return list.stream()
                    .map(
                            reading ->
                                    ReadingDto
                                            .builder()
                                            .date(reading.getDate())
                                            .importReading(reading.getImportReading())
                                            .exportReading(reading.getExportReading())
                                            .solarReading(reading.getSolarReading())
                                            .year(reading.getYear())
                                            .build()
                    )
                    .toList();
        }catch (Exception e){
            System.out.println("loc: UserServiceImpl; fn: getEntries; "+e.getMessage());
            throw new Exception(e.getMessage());
        }
    }
}
