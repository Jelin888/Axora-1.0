package com.axora.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "skills", uniqueConstraints = @UniqueConstraint(columnNames = "name"))
public class Skill extends BaseEntity {

    @Column(nullable = false, unique = true, length = 100)
    private String name;
}
