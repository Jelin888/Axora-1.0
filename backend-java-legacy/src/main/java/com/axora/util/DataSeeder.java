package com.axora.util;

import com.axora.entity.*;
import com.axora.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Seeds AXORA with demo data on first run so the application can be
 * explored immediately. These accounts and records are for LOCAL
 * DEVELOPMENT / DEMO PURPOSES ONLY — do not use in production.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FreelancerProfileRepository freelancerProfileRepository;
    private final ClientProfileRepository clientProfileRepository;
    private final ProjectCategoryRepository categoryRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final OfferRepository offerRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // already seeded
        }

        System.out.println("=== AXORA: Seeding demo data (local development only) ===");

        // ---- Categories ----
        List<String> categoryNames = List.of("Web Development", "Mobile Development", "UI/UX Design",
                "Data Science", "AI/ML", "Cloud", "Cybersecurity", "Digital Marketing", "Content Writing");
        categoryNames.forEach(name -> {
            ProjectCategory c = new ProjectCategory();
            c.setName(name);
            categoryRepository.save(c);
        });

        // ---- Skills ----
        List<String> skillNames = List.of("Java", "Spring Boot", "React", "MySQL", "JavaScript",
                "Node.js", "Python", "Figma", "AWS", "Docker", "TypeScript", "MongoDB");
        skillNames.forEach(name -> {
            Skill s = new Skill();
            s.setName(name);
            skillRepository.save(s);
        });

        // ---- Admin ----
        User admin = new User();
        admin.setFullName("AXORA Admin");
        admin.setEmail("jelinjelin888@gmail.com");
        admin.setPassword(passwordEncoder.encode("Jelin@_@888"));
        admin.setRole(Role.ROLE_ADMIN);
        admin.setStatus(UserStatus.ACTIVE);
        userRepository.save(admin);

        // ---- Freelancers ----
        String[][] freelancers = {
                {"John Doe", "john@axora.com", "Full Stack Developer", "Bengaluru", "5", "800"},
                {"Priya Sharma", "priya@axora.com", "UI/UX Designer", "Mumbai", "4", "600"},
                {"Arjun Mehta", "arjun@axora.com", "Java Spring Boot Developer", "Pune", "6", "900"},
                {"Sara Khan", "sara@axora.com", "Mobile App Developer", "Delhi", "3", "700"},
                {"Rahul Verma", "rahul@axora.com", "Data Scientist", "Hyderabad", "4", "1000"}
        };
        for (String[] f : freelancers) {
            User u = new User();
            u.setFullName(f[0]);
            u.setEmail(f[1]);
            u.setPassword(passwordEncoder.encode("Freelancer@123"));
            u.setRole(Role.ROLE_FREELANCER);
            u.setStatus(UserStatus.ACTIVE);
            userRepository.save(u);

            FreelancerProfile p = new FreelancerProfile();
            p.setUser(u);
            p.setProfessionalTitle(f[2]);
            p.setBio("Experienced " + f[2] + " passionate about delivering quality work on AXORA.");
            p.setLocation(f[3]);
            p.setExperienceYears(Integer.parseInt(f[4]));
            p.setHourlyRate(new BigDecimal(f[5]));
            p.setAvailable(true);
            p.setAverageRating(4.5 + Math.random() * 0.4);
            p.setCompletedProjects(5 + (int) (Math.random() * 10));
            freelancerProfileRepository.save(p);
        }

        // ---- Clients ----
        String[][] clients = {
                {"TechNova Pvt Ltd", "client1@axora.com", "TechNova"},
                {"BrightRetail Inc", "client2@axora.com", "BrightRetail"},
                {"Skyline Ventures", "client3@axora.com", "Skyline"}
        };
        User firstClient = null;
        for (String[] c : clients) {
            User u = new User();
            u.setFullName(c[0]);
            u.setEmail(c[1]);
            u.setPassword(passwordEncoder.encode("Client@123"));
            u.setRole(Role.ROLE_CLIENT);
            u.setStatus(UserStatus.ACTIVE);
            userRepository.save(u);
            if (firstClient == null) firstClient = u;

            ClientProfile p = new ClientProfile();
            p.setUser(u);
            p.setCompanyName(c[2]);
            p.setAbout("A growing company looking for great freelance talent via AXORA.");
            clientProfileRepository.save(p);
        }

        // ---- Sample Projects ----
        List<ProjectCategory> categories = categoryRepository.findAll();
        String[][] projects = {
                {"Build an E-Commerce Website", "React + Spring Boot + MySQL e-commerce platform.", "React,Spring Boot,MySQL", "25000"},
                {"Portfolio Website for Designer", "Modern responsive portfolio site.", "React,CSS", "5000"},
                {"Mobile App for Food Delivery", "Cross-platform food delivery app.", "React Native,Node.js", "40000"},
                {"AI Chatbot Integration", "Integrate an AI chatbot into existing website.", "Python,AI/ML", "18000"},
                {"UI/UX Redesign for SaaS Dashboard", "Redesign dashboard for better usability.", "Figma,UI/UX", "12000"},
                {"Cloud Migration Project", "Migrate on-prem servers to AWS.", "AWS,Docker", "30000"},
                {"Content Writing for Blog", "20 SEO-optimized blog articles.", "Content Writing", "8000"},
                {"Cybersecurity Audit", "Full security audit of web application.", "Cybersecurity", "22000"},
                {"Data Dashboard with Analytics", "Build analytics dashboard with charts.", "Python,Data Science", "16000"},
                {"Digital Marketing Campaign", "Run a 3-month digital marketing campaign.", "Digital Marketing", "10000"}
        };
        int i = 0;
        for (String[] proj : projects) {
            Project p = new Project();
            p.setClient(firstClient);
            p.setTitle(proj[0]);
            p.setDescription(proj[1]);
            p.setRequiredSkills(proj[2]);
            p.setBudget(new BigDecimal(proj[3]));
            p.setDeadline(LocalDate.now().plusDays(30));
            p.setProjectType(ProjectType.FIXED_PRICE);
            p.setStatus(ProjectStatus.OPEN);
            p.setCategory(categories.get(i % categories.size()));
            projectRepository.save(p);
            i++;
        }

        // ---- Sample Offer ----
        Offer offer = new Offer();
        offer.setTitle("AXORA PRO OFFER");
        offer.setDescription("Get 20% off platform service fees.");
        offer.setStartDate(LocalDate.now());
        offer.setEndDate(LocalDate.of(2026, 9, 30));
        offer.setStatus(OfferStatus.ACTIVE);
        offerRepository.save(offer);

        System.out.println("=== AXORA: Demo data seeded successfully ===");
        System.out.println("Admin login -> jelinjelin888@gmail.com / Jelin@_@888");
    }
}
