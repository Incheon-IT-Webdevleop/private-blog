package com.jsp.jpa.model;

import jakarta.persistence.*;
import lombok.Data;

import java.lang.reflect.Member;
import java.time.LocalDateTime;

@Entity(name = "review")
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_idx")
    private Integer reviewIdx;


    @JoinColumn(name = "member_idx", nullable = false)
    private int member;

    @Column(name = "review_title", nullable = false, length = 40)
    private String reviewTitle;

    @Column(name = "review_content", nullable = false, columnDefinition = "TEXT")
    private String reviewContent;

    @Column(name = "review_img", columnDefinition = "TEXT")
    private String reviewImg;

    @Column(name = "review_date", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime reviewDate;

    @Column(name = "review_category", nullable = false)
    private Integer reviewCategory;

}
