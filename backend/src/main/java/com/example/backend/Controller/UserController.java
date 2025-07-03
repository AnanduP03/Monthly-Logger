package com.example.backend.Controller;

import com.example.backend.Dto.ReadingDto;
import com.example.backend.Dto.UserDto;
import com.example.backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin("*")
public class UserController {


    @Autowired
    UserService userService;

    @GetMapping("/test")
    public ResponseEntity<?> authTest(){
        System.out.println("Auth test successfull");
        Map<String,String> res=new HashMap<>();
        res.put("message","Auth test successful");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("/details")
    public ResponseEntity<?> details(){
        try{
            UserDto userDto=userService.getUserDetails();
            return new ResponseEntity<>(userDto,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/entry")
    public ResponseEntity<?> getEntries(){
        try{
            List<ReadingDto> readingDtos=userService.getEntries();
            return new ResponseEntity<>(readingDtos,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/entry")
    public ResponseEntity<?> addEntry(ReadingDto readingDto){
        Map<String,String> responseMap=new HashMap<>();
        try{
            if(userService.addNewEntry(readingDto)){
                responseMap.put("status","success");
                responseMap.put("message","Successfully added the entry");
                return new ResponseEntity<>(responseMap,HttpStatus.OK);
            }else{
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }catch (Exception e){
            responseMap.put("status","false");
            responseMap.put("message",e.getMessage());
            return new ResponseEntity<>(responseMap,HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
