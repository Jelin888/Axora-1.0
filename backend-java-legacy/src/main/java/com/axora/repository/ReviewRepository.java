package com.axora.repository;

import com.axora.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByReviewee_Id(Long revieweeId);
    List<Review> findByProject_Id(Long projectId);
    boolean existsByProject_IdAndReviewer_Id(Long projectId, Long reviewerId);
}
