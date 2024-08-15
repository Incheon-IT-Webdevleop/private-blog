package com.jsp.jpa.dto.review;

import lombok.Data;

import java.util.List;

@Data
public class ReviewDto {

    private String title;
    private String content;
    private List<String> images;
    private int memberIdx;
    private int reviewCategory;

}
