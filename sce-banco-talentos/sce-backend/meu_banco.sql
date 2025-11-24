--
-- PostgreSQL database dump
--

\restrict Albzf5aXkoBbq2oxGPXvo5V2ga1kgWb2D49sda41sv5Ag2vqLzR5OdnbbcASW9F

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: curriculos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.curriculos (
    id integer NOT NULL,
    nome_completo character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    telefone character varying(50),
    cidade character varying(100),
    estado character varying(10),
    area_interesse character varying(100),
    tipo_vaga character varying(50),
    link_curriculo text,
    autorizado boolean DEFAULT false,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.curriculos OWNER TO postgres;

--
-- Name: curriculos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.curriculos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.curriculos_id_seq OWNER TO postgres;

--
-- Name: curriculos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.curriculos_id_seq OWNED BY public.curriculos.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vagas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vagas (
    id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    local character varying(255) NOT NULL,
    tipo character varying(50) NOT NULL,
    descricao text NOT NULL,
    criado_em timestamp without time zone DEFAULT now()
);


ALTER TABLE public.vagas OWNER TO postgres;

--
-- Name: vagas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vagas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vagas_id_seq OWNER TO postgres;

--
-- Name: vagas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vagas_id_seq OWNED BY public.vagas.id;


--
-- Name: curriculos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curriculos ALTER COLUMN id SET DEFAULT nextval('public.curriculos_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vagas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vagas ALTER COLUMN id SET DEFAULT nextval('public.vagas_id_seq'::regclass);


--
-- Data for Name: curriculos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.curriculos (id, nome_completo, email, telefone, cidade, estado, area_interesse, tipo_vaga, link_curriculo, autorizado, criado_em) FROM stdin;
1	teste	teste@exemplo.com	91996254818	Belém	PA	Administrativo	CLT	https://github.com/YasmimSarmento/SCE_Servicos_Combinados	f	2025-11-20 09:29:41.613074
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password) FROM stdin;
\.


--
-- Data for Name: vagas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vagas (id, titulo, local, tipo, descricao, criado_em) FROM stdin;
1	teste	belém	CLT	teste01\n	2025-11-23 10:18:33.337896
\.


--
-- Name: curriculos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.curriculos_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: vagas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vagas_id_seq', 1, true);


--
-- Name: curriculos curriculos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.curriculos
    ADD CONSTRAINT curriculos_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: vagas vagas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vagas
    ADD CONSTRAINT vagas_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict Albzf5aXkoBbq2oxGPXvo5V2ga1kgWb2D49sda41sv5Ag2vqLzR5OdnbbcASW9F

