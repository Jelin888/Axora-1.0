package com.axora.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "announcements")
public class Announcement extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 3000)
    private String description;

    private String imageUrl;
    private Boolean active = true;
}
