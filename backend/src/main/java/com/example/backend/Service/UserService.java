package com.example.backend.Service;

import com.example.backend.Dto.ReadingDto;
import com.example.backend.Dto.UserDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {
    UserDto getUserDetails() throws Exception;
    boolean addNewEntry(ReadingDto readingDto) throws Exception;
    List<ReadingDto> getEntries() throws Exception;
}
