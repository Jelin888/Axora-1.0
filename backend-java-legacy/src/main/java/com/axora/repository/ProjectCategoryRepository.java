package com.axora.repository;

import com.axora.entity.ProjectCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectCategoryRepository extends JpaRepository<ProjectCategory, Long>, JpaSpecificationExecutor<ProjectCategory> {
}
