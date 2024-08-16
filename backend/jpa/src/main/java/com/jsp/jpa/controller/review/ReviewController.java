package com.jsp.jpa.controller.review;

import com.jsp.jpa.model.review.Review;
import com.jsp.jpa.repository.review.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @PostMapping("/review")
    public Review createReview(@RequestBody Review review) {
        // 여기에서 필요에 따라 추가 로직을 수행할 수 있습니다.
        return reviewRepository.save(review);
    }
}