
CREATE DATABASE IF NOT EXISTS mendit_db;

USE mendit_db;


-- =========================================
-- 1. USERS TABLE (STUDENT + ADMIN)
-- =========================================

CREATE TABLE IF NOT EXISTS users (
    user_id INT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,

    -- Student details
    roll_number VARCHAR(30),
    department VARCHAR(100),
    semester TINYINT,

    -- Common contact detail
    mobile VARCHAR(15),

    -- Admin details
    admin_id VARCHAR(50),
    designation VARCHAR(100),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id),
    UNIQUE (email),
    UNIQUE (roll_number),
    UNIQUE (admin_id)
);


-- =========================================
-- 2. COMPLAINTS TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS complaints (
    complaint_id INT NOT NULL AUTO_INCREMENT,
    student_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(60) NOT NULL,
    building VARCHAR(100) NOT NULL,
    floor VARCHAR(30),
    room_or_area VARCHAR(100) NOT NULL,
    photo_path VARCHAR(500),
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    admin_note TEXT,

    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,

    PRIMARY KEY (complaint_id),

    CONSTRAINT fk_complaints_student
        FOREIGN KEY (student_id)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
);


-- =========================================
-- 3. FEEDBACK TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS feedback (
    feedback_id INT NOT NULL AUTO_INCREMENT,
    complaint_id INT NOT NULL,
    rating INT NOT NULL,
    comments TEXT,

    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (feedback_id),
    UNIQUE (complaint_id),

    FOREIGN KEY (complaint_id)
        REFERENCES complaints(complaint_id)
        ON DELETE RESTRICT
);


-- =========================================
-- 4. DEMO USER DATA
-- =========================================

INSERT IGNORE INTO users
    (user_id, full_name, email, password, role,
     roll_number, department)
VALUES
    (1, 'Demo Student', 'student.demo@example.edu',
     'DEMO_ONLY_NOT_A_PASSWORD', 'STUDENT',
     'DEMO001', 'Computer Science'),

    (2, 'Demo Admin', 'admin.demo@example.edu',
     'DEMO_ONLY_NOT_A_PASSWORD', 'ADMIN',
     NULL, NULL),

    (3, 'Riya Sharma', 'riya.demo@example.edu',
     'DEMO_ONLY_NOT_A_PASSWORD', 'STUDENT',
     'DEMO002', 'Civil Engineering'),

    (4, 'Kabir Mehta', 'kabir.demo@example.edu',
     'DEMO_ONLY_NOT_A_PASSWORD', 'STUDENT',
     'DEMO003', 'Computer Science');


-- =========================================
-- 5. DEMO COMPLAINT DATA
-- =========================================

INSERT IGNORE INTO complaints
    (complaint_id, student_id, title, description,
     category, building, floor, room_or_area,
     photo_path, priority, status, admin_note,
     submitted_at, resolved_at)
VALUES

    (1, 1, 'Leaking tap in Block B',
     'Water is leaking continuously from the washroom tap.',
     'PLUMBING', 'Block B', '2', 'Washroom',
     NULL, 'MEDIUM', 'RESOLVED',
     'Demo repair completed.',
     '2026-11-01 10:00:00', '2026-11-02 14:30:00'),

    (2, 1, 'Projector not working',
     'The projector turns on, but no image appears.',
     'ELECTRICAL', 'Science Block', '2', 'Room 204',
     NULL, 'HIGH', 'UNDER_REVIEW',
     NULL, '2026-11-05 09:15:00', NULL),

    (3, 3, 'Library lights flickering',
     'The lights near the reading area keep flickering.',
     'ELECTRICAL', 'Central Library', '1', 'Reading Hall',
     NULL, 'MEDIUM', 'RESOLVED',
     'Faulty tube lights were replaced.',
     '2026-11-03 11:20:00', '2026-11-04 16:10:00'),

    (4, 4, 'Broken bench near canteen',
     'One of the benches has a loose and damaged leg.',
     'FURNITURE', 'Canteen Block', 'Ground',
     'Outdoor seating area',
     NULL, 'LOW', 'UNDER_REVIEW',
     NULL, '2026-11-06 12:05:00', NULL),

    (5, 3, 'Overflowing dustbin',
     'The dustbin beside the seminar hall is full and needs clearing.',
     'CLEANING', 'Academic Block A', 'Ground',
     'Outside Seminar Hall',
     NULL, 'MEDIUM', 'RESOLVED',
     'Area cleaned and bin emptied.',
     '2026-11-07 09:40:00', '2026-11-07 13:25:00'),

    (6, 4, 'Air conditioner not cooling',
     'The classroom AC is running but not cooling the room.',
     'AC_COOLING', 'Science Block', '3', 'Room 305',
     NULL, 'HIGH', 'IN_PROGRESS',
     'Admin update: maintenance check started.',
     '2026-11-08 08:30:00', NULL),

    (7, 1, 'Wi-Fi unavailable in study area',
     'Campus Wi-Fi is not connecting in the second-floor study area.',
     'IT_TECH', 'Central Library', '2', 'Study Area',
     NULL, 'MEDIUM', 'ON_HOLD',
     'Pending network equipment check.',
     '2026-11-09 14:15:00', NULL),

    (8, 3, 'Water cooler not working',
     'The water cooler is not dispensing water.',
     'EQUIPMENT', 'Hostel Block C', 'Ground',
     'Common Room',
     NULL, 'URGENT', 'SUBMITTED',
     NULL, '2026-11-10 10:05:00', NULL);


-- =========================================
-- 6. DEMO FEEDBACK DATA
-- =========================================

INSERT IGNORE INTO feedback
    (feedback_id, complaint_id, rating, comments)
VALUES

    (1, 1, 5, 'The issue was fixed quickly.'),

    (2, 3, 4, 'The lights are working properly now.'),

    (3, 5, 5, 'The area was cleaned the same day.');
