package com.axora.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "project_categories", uniqueConstraints = @UniqueConstraint(columnNames = "name"))
public class ProjectCategory extends BaseEntity {

    @Column(nullable = false, unique = true, length = 100)
    private String name;
}
