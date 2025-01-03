-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 03, 2025 at 05:22 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ci4k-project`
--

-- --------------------------------------------------------

--
-- Table structure for table `app_status_logs`
--

CREATE TABLE `app_status_logs` (
  `id` int(11) NOT NULL,
  `studentID` varchar(255) DEFAULT NULL,
  `app_name` varchar(255) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_status_logs`
--

INSERT INTO `app_status_logs` (`id`, `studentID`, `app_name`, `action`, `timestamp`) VALUES
(23123124, '23123123', 'Chrome', 'opened', '2024-12-28 08:00:00'),
(23123125, '23123123', 'Chrome', 'closed', '2024-12-28 08:30:00'),
(23123126, '23123123', 'Edge', 'opened', '2024-12-28 09:00:00'),
(23123127, '23123123', 'Edge', 'closed', '2024-12-28 09:30:00'),
(23123128, 'ahsgkxzcbnbzxc111111', 'Edge', 'opened', '2024-12-28 09:15:00'),
(23123129, 'ahsgkxzcbnbzxc111111', 'Edge', 'closed', '2024-12-28 09:45:00'),
(23123130, 'ahsgkxzcbnbzxc111111', 'Brave', 'opened', '2024-12-28 10:00:00'),
(23123131, 'ahsgkxzcbnbzxc111111', 'Brave', 'closed', '2024-12-28 10:30:00'),
(23123132, 'ASAssa', 'Brave', 'opened', '2024-12-28 10:30:00'),
(23123133, 'ASAssa', 'Brave', 'closed', '2024-12-28 11:00:00'),
(23123134, 'ASAssa', 'Opera', 'opened', '2024-12-28 11:15:00'),
(23123135, 'ASAssa', 'Opera', 'closed', '2024-12-28 11:45:00'),
(23123136, 'asdsad', 'Opera', 'opened', '2024-12-28 05:30:00'),
(23123137, 'asdsad', 'Opera', 'closed', '2024-12-28 06:00:00'),
(23123138, 'asdsad', 'Chrome', 'opened', '2024-12-28 06:30:00'),
(23123139, 'asdsad', 'Chrome', 'closed', '2024-12-28 07:00:00'),
(23123140, 'asdsadasd', 'Chrome', 'opened', '2024-12-28 02:50:00'),
(23123141, 'asdsadasd', 'Chrome', 'closed', '2024-12-28 03:20:00'),
(23123142, 'asdsadasd', 'Edge', 'opened', '2024-12-28 03:30:00'),
(23123143, 'asdsadasd', 'Edge', 'closed', '2024-12-28 04:00:00'),
(23123144, 'dsadsasda', 'Edge', 'opened', '2024-12-28 14:10:37'),
(23123145, 'dsadsasda', 'Edge', 'closed', '2024-12-28 14:40:00'),
(23123146, 'dsadsasda', 'Brave', 'opened', '2024-12-28 15:00:00'),
(23123147, 'dsadsasda', 'Brave', 'closed', '2024-12-28 15:30:00'),
(23123148, 'dsfsfsdfffffffff', 'Brave', 'opened', '2024-12-28 14:40:00'),
(23123149, 'dsfsfsdfffffffff', 'Brave', 'closed', '2024-12-28 15:10:00'),
(23123150, 'dsfsfsdfffffffff', 'Opera', 'opened', '2024-12-28 15:20:00'),
(23123151, 'dsfsfsdfffffffff', 'Opera', 'closed', '2024-12-28 15:50:00'),
(23123152, 'Law', 'Opera', 'opened', '2024-12-28 03:50:00'),
(23123153, 'Law', 'Opera', 'closed', '2024-12-28 04:20:00'),
(23123154, 'Law', 'Chrome', 'opened', '2024-12-28 04:30:00'),
(23123155, 'Law', 'Chrome', 'closed', '2024-12-28 05:00:00'),
(23123156, 'law', 'Chrome', 'opened', '2024-12-28 12:45:00'),
(23123157, 'law', 'Chrome', 'closed', '2024-12-28 13:15:00'),
(23123158, 'law', 'Edge', 'opened', '2024-12-28 13:30:00'),
(23123159, 'law', 'Edge', 'closed', '2024-12-28 14:00:00'),
(23123160, 'Law', 'Edge', 'opened', '2024-12-28 13:50:00'),
(23123161, 'Law', 'Edge', 'closed', '2024-12-28 14:30:00'),
(23123162, 'Law', 'Brave', 'opened', '2024-12-28 14:45:00'),
(23123163, 'Law', 'Brave', 'closed', '2024-12-28 15:15:00'),
(23123164, 'SKIBIDI', 'Brave', 'opened', '2024-12-28 14:15:00'),
(23123165, 'SKIBIDI', 'Brave', 'closed', '2024-12-28 14:45:00'),
(23123166, 'SKIBIDI', 'Opera', 'opened', '2024-12-28 14:50:00'),
(23123167, 'SKIBIDI', 'Opera', 'closed', '2024-12-28 15:20:00'),
(23123168, 'some_student_id', 'Chrome', 'opened', '2024-12-28 02:40:00'),
(23123169, 'some_student_id', 'Chrome', 'closed', '2024-12-28 03:10:00'),
(23123170, 'some_student_id', 'Edge', 'opened', '2024-12-28 03:15:00'),
(23123171, 'some_student_id', 'Edge', 'closed', '2024-12-28 03:45:00'),
(23123172, 'w434sdfs', 'Opera', 'opened', '2024-12-28 13:55:00'),
(23123173, 'w434sdfs', 'Opera', 'closed', '2024-12-28 14:20:00'),
(23123174, 'w434sdfs', 'Brave', 'opened', '2024-12-28 14:25:00'),
(23123175, 'w434sdfs', 'Brave', 'closed', '2024-12-28 14:55:00');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `client_id` varchar(255) NOT NULL,
  `role` enum('admin','client') NOT NULL,
  `status` varchar(50) NOT NULL,
  `connect_time` datetime NOT NULL,
  `disconnect_time` datetime DEFAULT NULL,
  `duration` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `client_id`, `role`, `status`, `connect_time`, `disconnect_time`, `duration`) VALUES
(1, '1c994f84-f7c5-4b3a-9151-6038cdc35c9d', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(2, '3a785abe-bd75-4edc-9cbe-855853814a04', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(3, '994be61a-e83b-4941-b04c-47bb970b0bd7', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(4, 'a77a5def-104e-4f64-a2f0-ab708d7e2fc2', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(5, '85fd1078-0fad-4f85-9193-9287c494f442', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(6, 'c92690f3-d541-4272-a30c-4df397b22ead', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(7, '43058ce7-647a-401d-bd36-f913d2b9385f', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(8, '82827a7f-a169-451e-a039-e7517585d4de', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(9, '9e2b4da9-1d2d-40ba-88f5-58233aaa4fd3', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(10, 'bfbf8a11-bd07-4ff5-bcfd-3ea38ee240e7', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(11, '861df39a-cb1b-4b6a-ab3f-56e3be634447', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(12, 'a9d67593-ad37-4b6d-985b-5d36f7c5a63b', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(13, '779f6202-9410-4b48-b981-0e46474fe714', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(14, '0a328178-54f8-41e3-be55-82fd35c73044', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(15, '518519ce-3ffa-42ad-a353-826449e8fab4', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(16, 'c5038a56-fd51-4d65-bc6a-44cca0717faa', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(17, '6d20826b-29cc-4c8d-b424-015e0d411648', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(18, '109e3aff-d8b9-4059-8366-868726046daf', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(19, 'cd382205-1c54-43ce-95ec-9bfceff31a26', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(20, '8e24b506-e411-46ac-8c19-c1c6d5f93acc', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(21, 'ae265bdc-5389-44ce-9aea-e6ff07bfdf71', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(22, '0c600597-3951-4c77-81f5-63eebbb54405', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(23, 'd7627893-308d-4153-ace4-fa1b12c975fe', 'admin', 'Client Connected', '0000-00-00 00:00:00', NULL, NULL),
(24, '2abea1f2-14f1-4836-be6c-a1c07dc595c8', 'admin', 'Client Connected', '0000-00-00 00:00:00', NULL, NULL),
(25, 'c1c4a0bc-d3ea-4950-8d7d-aca865d8e30d', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(26, '46c4f1a3-7b8a-45bd-b945-66c1ffd63f33', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(27, 'ac79775b-fe09-464e-bb66-19875edf2640', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647),
(28, '7ed964c8-5929-4d2b-9278-f40744646476', 'admin', 'Client Connected', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 2147483647);

-- --------------------------------------------------------

--
-- Table structure for table `lab_logs`
--

CREATE TABLE `lab_logs` (
  `id` int(11) NOT NULL,
  `studentID` varchar(50) DEFAULT NULL,
  `computer_number` int(11) NOT NULL,
  `login_time` datetime NOT NULL,
  `logout_time` datetime DEFAULT NULL,
  `duration` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lab_logs`
--

INSERT INTO `lab_logs` (`id`, `studentID`, `computer_number`, `login_time`, `logout_time`, `duration`) VALUES
(1, '23123123', 101, '2024-12-28 08:00:00', '2024-12-28 10:00:00', 2),
(2, 'ahsgkxzcbnbzxc111111', 102, '2024-12-28 09:15:00', '2024-12-28 11:00:00', 2),
(3, 'ASAssa', 103, '2024-12-28 08:30:00', '2024-12-28 12:00:00', 4),
(4, 'asdsad', 104, '2024-12-28 05:21:52', '2024-12-28 07:00:00', 2),
(5, 'asdsadasd', 105, '2024-12-28 02:48:18', '2024-12-28 04:30:00', 2),
(6, 'dsadsasda', 106, '2024-12-28 14:10:37', '2024-12-28 16:00:00', 2),
(7, 'dsfsfsdfffffffff', 107, '2024-12-28 14:32:47', '2024-12-28 16:10:00', 2),
(8, 'Law', 108, '2024-12-28 03:39:10', '2024-12-28 05:00:00', 1),
(9, 'law', 109, '2024-12-28 12:42:34', '2024-12-28 14:30:00', 2),
(10, 'Law', 110, '2024-12-28 13:49:23', '2024-12-28 15:00:00', 1),
(11, 'SKIBIDI', 111, '2024-12-28 14:08:41', '2024-12-28 16:00:00', 2),
(12, 'some_student_id', 112, '2024-12-28 02:34:41', '2024-12-28 04:00:00', 1),
(13, 'w434sdfs', 113, '2024-12-28 13:50:21', '2024-12-28 15:20:00', 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `studentID` varchar(50) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `department` enum('BA','IT','TEP') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `studentID`, `full_name`, `email`, `department`, `created_at`) VALUES
(1, 'some_student_id', 'John Doe', 'john.doe@example.com', 'BA', '2024-12-27 18:34:41'),
(5, 'asdsadasd', 'asdasdasdasd', 'afsjhjkA@gmail.com', 'IT', '2024-12-27 18:48:18'),
(6, 'Law', 'asdasdasd', 'agxzczx@gmail.com', 'BA', '2024-12-27 19:39:10'),
(7, 'ahsgkxzcbnbzxc111111', '11111111111', '1asdjbsa@gmail.com', 'IT', '2024-12-27 21:14:21'),
(8, 'asdsad', 'asdasda', '1111111111@gmail.com', 'IT', '2024-12-27 21:21:52'),
(9, '23123123', '123123', '1231232@gmail.com', 'IT', '2024-12-28 03:36:09'),
(10, 'ASAssa', 'asaaAS', 'AsASA@ADS.K', 'IT', '2024-12-28 04:13:01'),
(11, 'law', 'Law', 'asdasd@gmail.com', 'IT', '2024-12-28 04:42:34'),
(12, 'asdsad', 'asdsasasasasasasasasasa', 'saaaaaaaaaaa@gmai.com', 'IT', '2024-12-28 05:05:32'),
(13, 'Law', 'alkjaslkjflakf', 'asdassadasdad@gmail.com', 'BA', '2024-12-28 05:49:23'),
(14, 'w434sdfs', 'sdffffffffffffff', 'sdfffffffffffffffff@gmail.com', 'TEP', '2024-12-28 05:50:21'),
(15, 'SKIBIDI', 'OHIO', 'LaLOYD@asasdad.c', 'IT', '2024-12-28 06:08:41'),
(16, 'dsadsasda', 'saddsadsadsa', 'aaSA@D.K', 'TEP', '2024-12-28 06:10:37'),
(17, 'dsfsfsdfffffffff', 'sdffffffffffffffffffffffffff', 'sadas@gmail.com', 'IT', '2024-12-28 06:32:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `app_status_logs`
--
ALTER TABLE `app_status_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `studentID` (`studentID`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lab_logs`
--
ALTER TABLE `lab_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_studentID` (`studentID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_studentID` (`studentID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `app_status_logs`
--
ALTER TABLE `app_status_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23123176;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `lab_logs`
--
ALTER TABLE `lab_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `app_status_logs`
--
ALTER TABLE `app_status_logs`
  ADD CONSTRAINT `app_status_logs_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `users` (`studentID`);

--
-- Constraints for table `lab_logs`
--
ALTER TABLE `lab_logs`
  ADD CONSTRAINT `fk_studentID` FOREIGN KEY (`studentID`) REFERENCES `users` (`studentID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
