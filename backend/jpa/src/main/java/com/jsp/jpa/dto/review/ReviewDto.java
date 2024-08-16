package com.jsp.jpa.dto.review;

import lombok.Data;

import java.util.List;

public class ReviewDto {
    private int memberIdx;

    public int getMemberIdx() {
        return memberIdx;
    }

    public void setMemberIdx(int memberIdx) {
        this.memberIdx = memberIdx;
    }
}
