package com.jsp.jpa.model.diary;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity(name ="diary")
@Data
public class Diary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diary_idx")
    private int diary_idx;

    @Column(name = "member_idx")
    private int member_idx;

    @Column(name = "diary_date")
    private Date diary_date;

    @Column(name = "diary_emoji")
    private int diary_emoji;

    @Column(name = "diary_title")
    private String diary_title;

    @Column(name = "diary_content")
    private String diary_content;


}
