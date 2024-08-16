package com.jsp.jpa.controller.diary;

import com.jsp.jpa.model.diary.Diary;
import com.jsp.jpa.repository.diary.DiaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/auth")
public class DiaryController {
    @Autowired
    private DiaryRepository diaryRepository;

    @PostMapping("/diaryInsert")
    public Diary creatediary(@RequestBody Diary diary) {
        // 여기에서 필요에 따라 추가 로직을 수행할 수 있습니다.
        return diaryRepository.save(diary);
    }

    @GetMapping("/diary")
    public Diary diaryselect(@RequestBody Diary diary, @PathVariable("user_idx") int idx, Model model){
        System.out.print(idx);
        return null;
    }
}
