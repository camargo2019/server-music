-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Tempo de geração: 27/06/2022 às 18:11
-- Versão do servidor: 10.6.5-MariaDB-1:10.6.5+maria~focal
-- Versão do PHP: 8.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `youtube_musicas`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `cmr_musicas`
--

CREATE TABLE `cmr_musicas` (
  `id` int(11) NOT NULL,
  `nome` text NOT NULL,
  `capa` text NOT NULL,
  `url_music` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Despejando dados para a tabela `cmr_musicas`
--

INSERT INTO `cmr_musicas` (`id`, `nome`, `capa`, `url_music`) VALUES
(64, 'MEGA FUNK - Ela Me Falou Que Quer Rave - MEGA FUNK - Ela Me Falou Que Quer Rave', 'https://lh3.googleusercontent.com/4doAnx4ElpcHmiZDUqlkLDEo513DFnxOWOjr6ZhRAMahPwhSAsHBFjYQV_lZrUazZ8T1GdO_YoXqulXP=w544-h544-l90-rj', '32Vkj18gXIE'),
(65, 'Mais Tocadas no Baile Funk Top do Momento - Mais Tocadas no Baile Funk Top do Momento', 'https://lh3.googleusercontent.com/LWY4M0ZBk6ieoyJ5I-Q_HB_ctZkZDxfVkP6SLOVh2-6g-8w9p4Cf6ED-mYbaUI7vehACoTlt2nhi5WuD=w544-h544-l90-rj', 'h9R7wQI_ulY'),
(66, 'Glamurosa - Glamurosa', 'https://lh3.googleusercontent.com/cH6wijmRlt-hQoKnI94_P8Ik1VPBmq_zHxy_vL-SUzKd9Uoljoi7E9gserVPSlJnH6KOWsovlMi7AEk=w544-h544-l90-rj', 'BiuxHS66T2E');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `cmr_musicas`
--
ALTER TABLE `cmr_musicas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `cmr_musicas`
--
ALTER TABLE `cmr_musicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
