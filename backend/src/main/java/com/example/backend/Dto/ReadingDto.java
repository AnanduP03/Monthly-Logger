package com.example.backend.Dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReadingDto {
    private String date;
    private String importReading;
    private String exportReading;
    private String solarReading;
    private String year;
}
