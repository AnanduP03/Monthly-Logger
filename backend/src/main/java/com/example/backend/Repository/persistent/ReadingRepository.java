package com.example.backend.Repository.persistent;

import com.example.backend.Model.persistent.Reading;
import com.example.backend.Model.persistent.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReadingRepository extends CrudRepository<Reading,Long> {
    Reading findByUser(User user);
    Reading findByDate(String date);

    Iterable<Reading> findAllByYear(String year);

    boolean existsByUser(User user);
    boolean existsByDate(String date);
    boolean existsByDateAndUser(String date,User user);



}
