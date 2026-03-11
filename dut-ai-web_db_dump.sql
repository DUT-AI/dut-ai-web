--
-- PostgreSQL database dump
--

\restrict msMI75Tg5DnsCfdOzp3KsxF6fHltACSFzCcHHe5TOCPALiAdfp6YKcBHslfKrfi

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

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
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: dutai
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO dutai;

--
-- Name: blog_authors; Type: TABLE; Schema: public; Owner: dutai
--

CREATE TABLE public.blog_authors (
    blog_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.blog_authors OWNER TO dutai;

--
-- Name: blog_keywords; Type: TABLE; Schema: public; Owner: dutai
--

CREATE TABLE public.blog_keywords (
    blog_id integer NOT NULL,
    keyword_id integer NOT NULL
);


ALTER TABLE public.blog_keywords OWNER TO dutai;

--
-- Name: blogs; Type: TABLE; Schema: public; Owner: dutai
--

CREATE TABLE public.blogs (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    views integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    image_url character varying(1000),
    search_vector tsvector,
    summary text,
    slug character varying(500)
);


ALTER TABLE public.blogs OWNER TO dutai;

--
-- Name: blogs_id_seq; Type: SEQUENCE; Schema: public; Owner: dutai
--

CREATE SEQUENCE public.blogs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blogs_id_seq OWNER TO dutai;

--
-- Name: blogs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dutai
--

ALTER SEQUENCE public.blogs_id_seq OWNED BY public.blogs.id;


--
-- Name: introductions; Type: TABLE; Schema: public; Owner: dutai
--

CREATE TABLE public.introductions (
    id integer NOT NULL,
    content text NOT NULL
);


ALTER TABLE public.introductions OWNER TO dutai;

--
-- Name: introductions_id_seq; Type: SEQUENCE; Schema: public; Owner: dutai
--

CREATE SEQUENCE public.introductions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.introductions_id_seq OWNER TO dutai;

--
-- Name: introductions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dutai
--

ALTER SEQUENCE public.introductions_id_seq OWNED BY public.introductions.id;


--
-- Name: keywords; Type: TABLE; Schema: public; Owner: dutai
--

CREATE TABLE public.keywords (
    id integer NOT NULL,
    keyword_name character varying(255) NOT NULL,
    number_blog_contain integer
);


ALTER TABLE public.keywords OWNER TO dutai;

--
-- Name: keywords_id_seq; Type: SEQUENCE; Schema: public; Owner: dutai
--

CREATE SEQUENCE public.keywords_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.keywords_id_seq OWNER TO dutai;

--
-- Name: keywords_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dutai
--

ALTER SEQUENCE public.keywords_id_seq OWNED BY public.keywords.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: dutai
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text,
    img_urls character varying[],
    hashtag character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    summary text,
    events_date timestamp without time zone,
    facebook_url character varying
);


ALTER TABLE public.posts OWNER TO dutai;

--
-- Name: memorable_events_id_seq; Type: SEQUENCE; Schema: public; Owner: dutai
--

CREATE SEQUENCE public.memorable_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.memorable_events_id_seq OWNER TO dutai;

--
-- Name: memorable_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dutai
--

ALTER SEQUENCE public.memorable_events_id_seq OWNED BY public.posts.id;


--
-- Name: project_members; Type: TABLE; Schema: public; Owner: dutai
--

CREATE TABLE public.project_members (
    id integer NOT NULL,
    project_id integer NOT NULL,
    user_id integer NOT NULL,
    role character varying NOT NULL
);


ALTER TABLE public.project_members OWNER TO dutai;

--
-- Name: project_members_id_seq; Type: SEQUENCE; Schema: public; Owner: dutai
--

CREATE SEQUENCE public.project_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_members_id_seq OWNER TO dutai;

--
-- Name: project_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dutai
--

ALTER SEQUENCE public.project_members_id_seq OWNED BY public.project_members.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: dutai
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text,
    image_url character varying,
    features text,
    technologies text,
    demo_url character varying,
    video_url character varying
);


ALTER TABLE public.projects OWNER TO dutai;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: dutai
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO dutai;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dutai
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: public_events; Type: TABLE; Schema: public; Owner: dutai
--

CREATE TABLE public.public_events (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text,
    img_url character varying,
    events_date timestamp without time zone,
    location character varying,
    register_link character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    summary text,
    facebook_url character varying,
    tags character varying[]
);


ALTER TABLE public.public_events OWNER TO dutai;

--
-- Name: users; Type: TABLE; Schema: public; Owner: dutai
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying,
    email character varying,
    phone_number character varying,
    status character varying,
    role_id integer,
    role_name character varying,
    avatar_url character varying,
    discord_id character varying
);


ALTER TABLE public.users OWNER TO dutai;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: dutai
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO dutai;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dutai
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: workshops_id_seq; Type: SEQUENCE; Schema: public; Owner: dutai
--

CREATE SEQUENCE public.workshops_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.workshops_id_seq OWNER TO dutai;

--
-- Name: workshops_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dutai
--

ALTER SEQUENCE public.workshops_id_seq OWNED BY public.public_events.id;


--
-- Name: blogs id; Type: DEFAULT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.blogs ALTER COLUMN id SET DEFAULT nextval('public.blogs_id_seq'::regclass);


--
-- Name: introductions id; Type: DEFAULT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.introductions ALTER COLUMN id SET DEFAULT nextval('public.introductions_id_seq'::regclass);


--
-- Name: keywords id; Type: DEFAULT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.keywords ALTER COLUMN id SET DEFAULT nextval('public.keywords_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.memorable_events_id_seq'::regclass);


--
-- Name: project_members id; Type: DEFAULT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.project_members ALTER COLUMN id SET DEFAULT nextval('public.project_members_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: public_events id; Type: DEFAULT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.public_events ALTER COLUMN id SET DEFAULT nextval('public.workshops_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: dutai
--

COPY public.alembic_version (version_num) FROM stdin;
1520c599f71a
\.


--
-- Data for Name: blog_authors; Type: TABLE DATA; Schema: public; Owner: dutai
--

COPY public.blog_authors (blog_id, user_id) FROM stdin;
3	1
4	1
5	1
\.


--
-- Data for Name: blog_keywords; Type: TABLE DATA; Schema: public; Owner: dutai
--

COPY public.blog_keywords (blog_id, keyword_id) FROM stdin;
3	4
3	5
3	6
4	7
4	8
4	9
4	10
4	11
4	12
4	13
5	14
5	15
5	16
5	17
\.


--
-- Data for Name: blogs; Type: TABLE DATA; Schema: public; Owner: dutai
--

COPY public.blogs (id, title, content, views, created_at, updated_at, image_url, search_vector, summary, slug) FROM stdin;
4	Concurrency and Parallelism	# Giới thiệu\r\n\r\nTrong thời đại các mô hình ngôn ngữ lớn (LLM) và các API cho AI service phát triển mạnh mẽ, việc xây dựng các ứng dụng sử dụng chúng ngày càng phổ biến. Tuy nhiên, khi ứng dụng phải phục vụ số lượng lớn người dùng, việc xử lý đồng thời nhiều yêu cầu (request) trở thành một thách thức lớn. Các API thường có giới hạn tài nguyên và thời gian phản hồi, đòi hỏi lập trình viên không chỉ cân nhắc về cân bằng tải mà còn phải tổ chức mã nguồn sao cho hiệu quả.\r\n\r\nTrong quá trình làm việc với các dự án liên quan đến quản lý số lượng lớn request, tôi nhận thấy có hai cách tiếp cận phổ biến để xử lý vấn đề này: sử dụng đa luồng (multithreading) hoặc lập trình bất đồng bộ (asynchronous programming). Mỗi phương pháp đều có ưu và nhược điểm, và việc lựa chọn không chỉ phụ thuộc vào yêu cầu của dự án mà còn vào cách bạn tổ chức logic xử lý.\r\n\r\nMục tiêu của bài viết này là làm rõ khái niệm Concurrency và Parallelism trong Python, giúp bạn hiểu sâu hơn về hai phương pháp này để áp dụng một cách hợp lý vào dự án của mình.\r\n\r\n**Pre requisite**: Để tránh bài viết bị quá dài mình sẽ không nói lại các kiến thức cơ bản, bạn cần có hiểu biết nền tảng về **multithreading (đa luồng)** và **asynchronous (bất đồng bộ)** trong python. Phần bất đồng bộ sẽ được mình giải thích chi tiết hơn trong phần sau.\r\n\r\n# Khái niệm\r\n\r\n## **Concurrency ( Đồng thời )**\r\n\r\n- **Đồng thời** đề cập đến việc quản lý nhiều tác vụ trong cùng một khoảng thời gian, không nhất thiết các tác vụ đó phải thực thi song song cùng lúc. Các tác vụ có thể luân phiên nhau thực thi, tạo cảm giác như thể chúng đang được chạy đồng thời (đa nhiệm)\r\n\r\n![Hình ảnh mô tả xử lý đồng thời](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-65ed0104ac4f4d74a4c6e29c8195d4eb-image.png)\r\n\r\n- Đồng thời thường được triển khai bằng **multithreading** (do GIL - Global Interperter Lock, một cơ chế để hạn chế chỉ một luồng được thực thi ở một thời điểm, khiến cho multithreading chỉ thực hiện đồng thời các threads) và lập trình bất đồng bộ (**asynchronous**). Nó cho phép chương trình xử lý nhiều tác vụ bằng cách chuyển đổi giữa chúng, tiến hành trên mỗi tác vụ mà không nhất thiết phải chạy chúng cùng một lúc.\r\n\r\n## **Parallelism ( Song song )**\r\n\r\n- xử lý song song, hay tính toán song song là khả năng thực hiện nhiều tác vụ cùng lúc mà việc thực hiện task vụ này không làm gián đoạn tác vụ khác\r\n- Song song thường đạt được bằng cách sử dụng **multiprocessing**, chạy nhiều tiến trình trên các lõi CPU khác nhau.\r\n\r\n![Hình ảnh mô tả xử lý song song](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-aac017aa1d024c9e92aa5c3af3473eb6-image.png)\r\n\r\n## So sánh\r\n\r\nVậy sự khác nhau giữa 2 khái niệm này là gì? Trong **concurrency**, các task chỉ cần bắt đầu và kết thúc gối nhau, chứ không cần các công việc của task được thực thi cùng lúc trong cùng một thời điểm. Còn trong **parallelism** thì có. Hay **concurrency** chính là tập con của **parallelism**. Conncurency có thể được thực hiện trên một lõi CPU của vi xử lý, khi đó, CPU sẽ phân chia thời gian lúc thì thực hiện task này, lúc lại thực hiện task kia theo một cơ chế nhất định. Còn đối với Parallelism, cần phải có một vi xử lý với nhiều lõi CPU, khi đó mỗi task sẽ được thực thi trên một CPU độc lập.\r\n\r\n![So sánh xử lý song song và đồng thời](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-2b2bf92c61ae4fb393e3d0e4b17e1eb0-image.png)\r\n\r\n# Chương trình\r\n\r\n> Chương trình chỉ đơn giản là một tệp tĩnh, ví dụ như một script Python hoặc một tệp thực thi.\r\n> \r\n- Một chương trình nằm trên ổ đĩa ở trạng thái thụ động, và sẽ không hoạt động cho đến khi hệ điều hành (OS) nạp nó vào bộ nhớ để chạy. Khi điều đó xảy ra, chương trình trở thành một tiến trình ( progress ).\r\n\r\n![Cách hoạt động của 1 chương trình](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-a477b4065ee342f4af2ba41cb029fc18-image.png)\r\n\r\n*Trong một tiến trình, có thể tạo ra nhiều luồng để thực thi song song các công việc khác nhau, tận dụng khả năng đa nhiệm của hệ điều hành.*\r\n\r\n## Tiến trình ( Process )\r\n\r\n> **Tiến trình** là một thực thể độc lập của một chương trình đang chạy.\r\n\r\n- Mỗi tiến trình có không gian bộ nhớ riêng, tài nguyên riêng và trạng thái thực thi riêng. Các tiến trình được cách ly với nhau, có nghĩa là một tiến trình không thể can thiệp vào một tiến trình khác trừ khi thông qua các cơ chế như giao tiếp liên tiến trình (IPC) được thiết kế đặc biệt để cho phép điều đó.\r\n- Tiến trình thường được phân thành hai loại chính:\r\n    - Tiến trình I/O-bound: Dành phần lớn thời gian để chờ các thao tác input/output (nhập/xuất) hoàn thành, chẳng hạn như truy cập tệp, giao tiếp mạng hoặc chờ người dùng nhập liệu. Trong khi chờ đợi, CPU hầu như ở trạng thái nhàn rỗi.\r\n    - Tiến trình CPU-bound: Dành phần lớn thời gian để thực hiện tính toán (ví dụ: mã hóa video, phân tích số liệu). Những tác vụ này đòi hỏi rất nhiều thời gian CPU.\r\n- Vòng đời của một tiến trình:\r\n    - Một tiến trình bắt đầu ở trạng thái mới khi được tạo.\r\n    - Sau đó nó chuyển sang trạng thái sẵn sàng, chờ được cấp thời gian CPU.\r\n    - Nếu tiến trình phải chờ một sự kiện (ví dụ I/O), nó chuyển sang trạng thái chờ.\r\n    - Cuối cùng, nó kết thúc sau khi hoàn thành nhiệm vụ.\r\n\r\n## Luồng ( Thread )\r\n\r\n> **Luồng** là đơn vị thực thi nhỏ nhất bên trong một tiến trình. Một tiến trình đóng vai trò như “container” chứa các luồng, và trong suốt vòng đời của tiến trình đó, có thể tạo và hủy nhiều luồng.\r\n> \r\n- Mỗi tiến trình có ít nhất một luồng – gọi là **luồng chính** – nhưng nó cũng có thể tạo thêm các luồng phụ khác.\r\n- Các luồng chia sẻ bộ nhớ và tài nguyên chung trong cùng một tiến trình, giúp việc trao đổi dữ liệu giữa chúng rất hiệu quả. Tuy nhiên, sự chia sẻ này có thể dẫn đến các vấn đề đồng bộ như điều **kiện tranh chấp (race condition)** hoặc **deadlock** nếu không được quản lý cẩn thận. Không như tiến trình, nhiều luồng trong cùng một tiến trình không tách biệt với nhau – chỉ cần một luồng gặp sự cố cũng có thể làm sập toàn bộ tiến trình.\r\n\r\n## **Cách hệ điều hành quản lý luồng và tiến trình**\r\n\r\n- CPU tại mỗi thời điểm chỉ có thể thực thi một tác vụ trên mỗi lõi. Để xử lý nhiều tác vụ, hệ điều hành sử dụng kỹ thuật **chuyển ngữ cảnh cưỡng bức (preemptive context switching)**.\r\n\r\n> Hệ điều hành **bắt buộc** phải dùng kỹ thuật **chuyển ngữ cảnh cưỡng bức (preemptive context switching?**\r\n> \r\n> - Câu trả lời\r\n>     - **Để đảm bảo tất cả tiến trình đều nhận được CPU (tính công bằng)**\r\n>         \r\n>         Nếu không cưỡng bức, một tiến trình **có thể chiếm CPU mãi mãi** (ví dụ: vòng lặp vô hạn).\r\n>         \r\n>         → Các tiến trình khác sẽ **không bao giờ được chạy** → hệ thống bị “treo” dù thật ra không hề hỏng.\r\n>         \r\n>         ```python\r\n>         while (1) {\r\n>             // chương trình bạn viết không bao giờ nhường CPU\r\n>         }\r\n>         \r\n>         ```\r\n>         \r\n>         Nếu OS không cưỡng bức thu hồi CPU → hết phim.\r\n>         \r\n>         ➡ **Preemption giúp OS lấy lại CPU định kỳ (time slice)** để chia sẻ cho tiến trình khác.\r\n>         \r\n>     - **Để đảm bảo hệ thống phản hồi nhanh (tính tương tác)**\r\n>         \r\n>         Hệ điều hành phải phản hồi:\r\n>         \r\n>         - nhấn bàn phím\r\n>         - click chuột\r\n>         - yêu cầu của ứng dụng\r\n>         - tác vụ nền của hệ thống\r\n>         \r\n>         Nếu không có preemptive, ứng dụng nặng (VD: render video, AI training, vòng lặp lớn) → sẽ làm toàn bộ hệ thống **đơ** vì nó không tự nhường CPU.\r\n>         \r\n>         ⇒ Preemptive switching cho phép OS ngắt bất cứ tiến trình nào để ưu tiên sự kiện quan trọng.\r\n>         \r\n>     - **Đảm bảo xử lý kịp thời các tiến trình ưu tiên cao (priority scheduling)**\r\n>         \r\n>         Một số tiến trình *luôn* phải chạy ngay lập tức:\r\n>         \r\n>         - Interrupt handler (xử lý ngắt phần cứng)\r\n>         - Tiến trình hệ thống (kernel)\r\n>         - Tác vụ thời gian thực (real-time)\r\n>         - Trình xử lý âm thanh/video\r\n>         - Watchdog, security…\r\n>         \r\n>         Nếu OS không thể **cướp CPU**, tiến trình ưu tiên thấp đang chạy sẽ khiến nhiệm vụ quan trọng **trễ hạn (deadline miss)**. ⇒ Preemption **cho phép tiến trình quan trọng có thể chạy NGAY LẬP TỨC**, bất kể đang có ai chiếm CPU.\r\n>         \r\n>     - **Để tránh deadlock CPU và tăng ổn định hệ thống**\r\n>         \r\n>         Nếu OS chỉ dựa vào tiến trình tự nhường CPU (non-preemptive), thì:\r\n>         \r\n>         - lỗi lập trình\r\n>         - vòng lặp\r\n>         - CPU-bound task\r\n>         - user-space program không kiểm soát\r\n>         \r\n>         → đều có thể làm CPU bị “khóa”.\r\n>         \r\n>         Preemption làm hệ thống **an toàn hơn**, ngăn tiến trình lỗi phá hỏng toàn bộ OS.\r\n>         \r\n>     - **Hỗ trợ đa nhiệm thực sự (true multitasking)**\r\n>         \r\n>         Mắt người thấy mọi thứ chạy “song song”, vì OS chuyển qua lại giữa tiến trình cực nhanh (mỗi 1–10ms).\r\n>         \r\n>         Nếu không có preemption → máy tính chỉ chạy 1 chương trình tại một thời điểm → không thể:\r\n>         \r\n>         - nghe nhạc khi mở Word\r\n>         - vừa code vừa chạy trình duyệt\r\n>         - chạy chương trình nền (sync, update, antivirus)\r\n>         - chạy ứng dụng UI mượt mà\r\n>         \r\n>         ➡ Preemptive context switching giúp mô phỏng **đa nhiệm thời gian chia sẻ CPU**.\r\n>         \r\n- Trong quá trình chuyển ngữ cảnh, OS tạm dừng tác vụ hiện tại, lưu trạng thái của nó và tải trạng thái của tác vụ tiếp theo để thực thi. Việc chuyển đổi cực nhanh này tạo ra ảo giác rằng các tác vụ dường như được thực thi đồng thời trên một lõi CPU duy nhất.\r\n- **Đối với tiến trình**, chuyển ngữ cảnh tiêu tốn nhiều tài nguyên hơn vì hệ điều hành phải lưu và tải những không gian bộ nhớ riêng biệt.\r\n- **Đối với luồng**, việc chuyển đổi ngữ cảnh nhanh hơn do các luồng dùng chung cùng vùng nhớ trong một tiến trình. Tuy nhiên, việc chuyển đổi quá thường xuyên cũng gây ra chi               phí **overhead (phụ thêm)**, có thể làm giảm hiệu năng tổng thể.\r\n- Thực sự chỉ khi hệ thống có nhiều lõi CPU thì các tiến trình mới có thể chạy **song song đồng thời**. Mỗi lõi có thể xử lý đồng thời một tiến trình riêng biệt.\r\n\r\n![Cách hệ điều hành quản lý luồng và tiến trình](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-9427c8d2203f4919980332c21b98909e-image.png)\r\n\r\nHình minh họa trên so sánh bốn kịch bản: \r\n\r\n**(1) đơn xử lý, đơn luồng** – một tiến trình với một luồng; \r\n\r\n**(2) đơn xử lý, đa luồng** – một tiến trình với nhiều luồng; \r\n\r\n**(3) đa xử lý, đơn luồng** – nhiều tiến trình, mỗi tiến trình một luồng; \r\n\r\n**(4) đa xử lý, đa luồng** – nhiều tiến trình, mỗi tiến trình có nhiều luồng. \r\n\r\n(Các ô code, data, files biểu thị các vùng bộ nhớ/chứa dữ liệu mà chương trình sử dụng khi thực thi; register là các thanh ghi nhỏ, tốc độ cao trong CPU; stack là vùng nhớ ngăn xếp dùng để quản lý lời gọi hàm, biến cục bộ, v.v.)\r\n\r\n# **Multithreading (đa luồng)**\r\n\r\n- Multithreading hay đa luồng là một kỹ thuật lập trình cho phép một chương trình thực hiện nhiều tác vụ đồng thời trong cùng một tiến trình. Trong Python, đa luồng được sử dụng để cải thiện hiệu suất của các ứng dụng I/O-bound, nơi mà các tác vụ bị chậm do chờ đợi I/O (nhập/xuất) như đọc/ghi tệp, truy vấn cơ sở dữ liệu, hoặc kết nối mạng.\r\n- **Global Interpreter Lock (GIL):** GIL là một khóa toàn cục trong Python, đảm bảo rằng chỉ một luồng thực thi mã bytecode Python tại một thời điểm. GIL được giới thiệu nhằm đơn giản hóa quản lý bộ nhớ trong Python, bởi nhiều thao tác nội bộ (chẳng hạn việc tạo đối tượng) mặc định không an toàn khi thực thi đa luồng. Nếu không có GIL, nhiều luồng cùng truy cập vào tài nguyên chung sẽ cần các cơ chế khóa hoặc đồng bộ hóa phức tạp để ngăn chặn tình trạng race condition và lỗi hỏng dữ liệu. Điều này có nghĩa:\r\n    - Đa luồng không hiệu quả cho tác vụ CPU-bound: Vì GIL ngăn cản các luồng thực thi đồng thời trên một lõi CPU ⇒ **GIL trở thành nút thắt cổ chai ( Nhiều luồng cạnh tranh GIL phải thay phiên nhau thực thi bytecode Python )**\r\n    - Đa luồng hữu ích cho tác vụ I/O-bound: Trong khi một luồng chờ I/O, GIL có thể được nhường cho luồng khác.\r\n- Do GIL, các threads trong python sẽ được luân phiên thực hiện bởi CPU theo một chiến lược nhất định, ví dụ như thực hiện một thread trong một khoảng thời gian Δτ rồi chuyển sang thread khác, luân phiên qua lại\r\n\r\n![Mô tả xử lý đa luồng](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-fe5c4abfccaa4b639c2935e53b1c9c34-image.png)\r\n\r\n> Một trường hợp thú vị đáng chú ý là khi sử dụng hàm time.sleep – Python thực chất xử lý nó như một thao tác I/O. Hàm time.sleep không tiêu tốn CPU vì trong khoảng thời gian “ngủ” nó không thực hiện tính toán hay chạy bytecode Python nào. Thay vào đó, việc theo dõi thời gian chờ được giao cho hệ điều hành. Trong thời gian luồng “ngủ”, GIL sẽ được giải phóng, cho phép các luồng khác chạy và sử dụng trình thông dịch Python.\r\n> \r\n\r\n### **Luồng (Thread) và Tiến Trình (Process)**\r\n\r\n- Tiến trình (Process): Là một phiên bản đang chạy của một chương trình, có không gian bộ nhớ và tài nguyên riêng.\r\n- Luồng (Thread): Là một đơn vị thực thi nhỏ hơn trong tiến trình. Các luồng trong cùng một tiến trình chia sẻ cùng không gian bộ nhớ và tài nguyên.\r\n\r\nSo sánh:\r\n\r\n- Đa tiến trình (Multiprocessing): Mỗi tiến trình có GIL riêng, không chia sẻ bộ nhớ, an toàn hơn nhưng tốn tài nguyên hơn.\r\n- Đa luồng (Multithreading): Chia sẻ bộ nhớ, nhẹ hơn nhưng cần quản lý đồng bộ hóa để tránh xung đột dữ liệu\r\n\r\n# **Đa tiến trình (Multiprocessing)**\r\n\r\n- Đa tiến trình cho phép hệ thống chạy song song nhiều tiến trình, mỗi tiến trình có bộ nhớ, GIL và tài nguyên độc lập. Bên trong mỗi tiến trình đó, có thể có một hoặc nhiều luồng\r\n- Đa tiến trình giúp vượt qua những hạn chế của GIL. Điều này khiến nó đặc biệt phù hợp cho các tác vụ CPU-bound đòi hỏi nhiều tài nguyên tính toán.\r\n- Tuy nhiên, đa tiến trình cũng tốn nhiều tài nguyên hơn do mỗi tiến trình có không gian bộ nhớ riêng và phát sinh chi phí quản lý tiến trình.\r\n\r\n# **Asynchronous**\r\n\r\nBất đồng bộ (asynchronous programming) là một kỹ thuật lập trình cho phép xử lý nhiều tác vụ cùng một lúc mà không cần đợi mỗi tác vụ hoàn thành trước khi chuyển sang tác vụ tiếp theo. Trong Python, bất đồng bộ đã trở thành một phần quan trọng của ngôn ngữ, đặc biệt với sự ra đời của module `asyncio` trong Python 3.4 và các từ khóa `async` và `await` trong Python 3.5.\r\n\r\n**Cách hoạt động** **Asyncio** vận hành một **vòng lặp sự kiện** để điều phối việc thực thi các tác vụ. Các tác vụ sẽ tự nguyện “tạm dừng” khi chúng cần chờ một thứ gì đó, ví dụ đợi phản hồi mạng hoặc đọc/xử lý file. Trong khi một tác vụ đang chờ, vòng lặp sự kiện sẽ chuyển sang chạy tác vụ khác, đảm bảo không có thời gian chết vì chờ đợi.\r\n\r\n⇒ Điều này khiến asyncio đặc biệt phù hợp cho các kịch bản có nhiều tác vụ nhỏ phải chờ đợi nhiều, chẳng hạn xử lý hàng ngàn request web hoặc quản lý các truy vấn cơ sở dữ liệu. Vì mọi thứ chạy trên một luồng duy nhất, asyncio tránh được overhead và sự phức tạp của việc chuyển đổi luồng liên tục.\r\n\r\n1. Sự khác biệt giữa **Asynchronous và Multithreading:** \r\n- Đa luồng dựa vào hệ điều hành để chuyển đổi giữa các luồng khi một luồng bị chờ (chuyển ngữ cảnh cưỡng bức). Khi một luồng đang chờ, HĐH sẽ tự động chuyển sang luồng khác.\r\n- Asyncio chạy trên một luồng duy nhất và dựa vào sự hợp tác của các tác vụ – chúng tự “nhường” (tạm dừng) khi cần chờ (đa nhiệm hợp tác).\r\n\r\n**1. Tại Sao Cần Bất Đồng Bộ?**\r\n\r\n- Hiệu suất cao hơn: Bất đồng bộ cho phép chương trình xử lý nhiều tác vụ I/O cùng một lúc, cải thiện hiệu suất tổng thể.\r\n- Phản hồi nhanh hơn: Trong ứng dụng web, bất đồng bộ giúp xử lý nhiều yêu cầu khách hàng đồng thời mà không gây chậm trễ.\r\n- Sử dụng tài nguyên hiệu quả: Tiết kiệm tài nguyên hệ thống bằng cách tránh việc tạo nhiều thread hoặc process.\r\n\r\n**2. Sự Khác Biệt Giữa Đồng Bộ Và Bất Đồng Bộ**\r\n\r\n- Đồng bộ: Mỗi tác vụ được thực hiện tuần tự. Chương trình sẽ chờ một tác vụ hoàn thành trước khi chuyển sang tác vụ tiếp theo.\r\n- Bất đồng bộ: Cho phép chuyển sang tác vụ khác trong khi chờ tác vụ trước hoàn thành, thường áp dụng cho các tác vụ I/O.\r\n1. Asyncio Module\r\n\r\n`asyncio` là một thư viện trong Python cung cấp hỗ trợ cho lập trình bất đồng bộ (asynchronous programming) sử dụng coroutine. Được giới thiệu từ Python 3.4, asyncio giúp bạn viết mã không đồng bộ một cách dễ dàng và hiệu quả.\r\n\r\nDưới đây là một số thành phần của `asyncio`:\r\n\r\n![Một số thành phần của Asyncio](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-52fff8cadb004ac39b39e321dfa51cf7-image.png)\r\n\r\n**3.1. Coroutines**\r\n\r\n`Coroutine` là một hàm có thể tạm dừng thực thi của nó và trả quyền điều khiển lại cho `event loop`, để `event loop` có thể thực thi các `coroutine` khác. Trong Python, `coroutine` được định nghĩa bằng cách sử dụng từ khóa `async def`. Dùng `await` để tạm dừng coroutine hiện tại cho đến khi biểu thức sau `await` hoàn thành.\r\n\r\n`Coroutines` **không tự động chạy** khi được gọi. Chúng cần được chạy bởi `event loop` thông qua `await`, `asyncio.run()`, `asyncio.gather()`, hoặc được chuyển đổi thành `task`.\r\n\r\n**3.2. Tasks** \r\n\r\n`task` là một đối tượng bao bọc một `coroutine` và lên lịch để nó chạy trong `event loop`. Nó cho phép thực hiện đồng thời nhiều `coroutine` trong cùng một `event loop` bằng cách chuyển đổi ngữ cảnh tại các điểm `await`.\r\n\r\nCách tạo và chạy Tasks:\r\n\r\n```python\r\ntask = asyncio.create_task(my_coroutine())\r\n```\r\n\r\nKhi tạo một Task, nó được thêm vào event loop và sẽ bắt đầu thực thi khi event loop chạy. Ngoài ra có thể sử dụng các hàm như `asyncio.gather()` để chạy nhiều task đồng thời và chờ đợi kết quả của chúng.\r\n\r\n**3.4. Futures**\r\n\r\n`Future` là một đối tượng đại diện cho một kết quả sẽ có trong tương lai. Trong asyncio, `Future` thường được sử dụng để biểu diễn kết quả của các thao tác bất đồng bộ chưa hoàn thành.\r\n\r\nCách sử dụng `Future`:\r\n\r\n- Tạo Future: Thông thường, Futures được tạo và quản lý bởi event loop và các API cấp thấp.\r\n- Chờ đợi Future: Bạn có thể await trên một Future để chờ đợi kết quả của nó.\r\n- Hoàn thành Future: Một Future có thể được hoàn thành bằng cách gọi set_result() hoặc set_exception().\r\n\r\n```python\r\nfuture = loop.create_future()\r\n\r\n# Hoàn thành Future ở một nơi nào đó trong code\r\nfuture.set_result('Result')\r\n\r\n# Chờ đợi kết quả của Future\r\nresult = await future\r\n\r\n```\r\n\r\n**3.3. Event Loop**\r\n\r\n`Event Loop` là trung tâm của `asyncio`. Nó là một vòng lặp vô hạn chịu trách nhiệm quản lý và điều phối việc thực thi các `coroutine`, quản lý I/O, và xử lý các sự kiện theo lịch trình.\r\n\r\nCách hoạt động của Event Loop:\r\n\r\n- **Bắt đầu và quản lý**: Khi bạn khởi chạy một chương trình `asyncio`, `event loop` sẽ được tạo ra (hoặc lấy `event loop` hiện tại) và bắt đầu chạy.\r\n- Điều phối `Coroutines` và `Tasks`: Event loop quản lý danh sách các `coroutine` và `tasks` cần được thực thi.\r\n- Xử lý I/O bất đồng bộ: Nó chờ đợi các sự kiện I/O hoặc thời gian (timer) xảy ra và kích hoạt các callback tương ứng.\r\n- Chuyển đổi ngữ cảnh: Khi một `coroutine` tạm dừng tại một điểm `await`, `event loop` sẽ chuyển sang thực thi `coroutine` khác đang chờ đợi, đảm bảo sử dụng hiệu quả thời gian CPU.\r\n\r\n## 2 Cách viết mã bất đồng bộ\r\n\r\n### await coroutine\r\n\r\n- Ý nghĩa:\r\n    - **Chạy coroutine và CHỜ nó hoàn thành**.\r\n    - Không chuyển sang công việc khác cho đến khi xong.\r\n- Đặc điểm\r\n    - **Tuần tự** (sequential)\r\n    - Luồng async **bị chặn** tại điểm `await`\r\n    - Kết quả coroutine là **giá trị trả về** của `await`\r\n\r\n```python\r\nresult = await foo() #2s \r\n# → Chỉ khi foo() chạy xong, dòng tiếp theo mới chạy.\r\n```\r\n\r\n### **asyncio.createtask(coroutine)**\r\n\r\n- Ý nghĩa\r\n    - **Tạo một task chạy coroutine song song (concurrent)**.\r\n    - Không chờ coroutine chạy xong → chạy tiếp ngay lập tức.\r\n- Đặc điểm\r\n    - **Chạy nền** (background task)\r\n    - Task được scheduler quản lý và chạy **song song** với coroutine khác\r\n    - Muốn lấy kết quả phải `await` task sau\r\n\r\n```python\r\ntask = asyncio.create_task(foo())\r\n# tiếp tục công việc khác ngay lập tức\r\n...\r\nresult = await task  # đợi kết quả nếu cần\r\n\r\ntasks = [\r\n    asyncio.create_task(foo()), #2s\r\n    asyncio.create_task(foo()), #2s\r\n    asyncio.create_task(foo()), #2s\r\n] # chạy coroutine song song \r\n\r\nresults = await asyncio.gather(*tasks) #Tổng 2s\r\n```\r\n\r\n| Đặc điểm | `await coroutine` | `create_task(coroutine)` |\r\n| --- | --- | --- |\r\n| Bắt đầu chạy coroutine | ✔ | ✔ |\r\n| Có chờ coroutine hoàn thành? | ✔ Bắt buộc | ❌ Không chờ |\r\n| Chạy song song các coroutine? | ❌ Không | ✔ Có |\r\n| Kiểu thực thi | Tuần tự | Đồng thời (concurrent) |\r\n| Scheduler quản lý task? | ❌ Không phải Task | ✔ Là Task |\r\n| Trả về | Kết quả coroutine | Một `Task` object |\r\n| Khi dùng | Bạn *cần kết quả* từ coroutine đó.\r\nCông việc mang tính tuần tự.\r\nThứ tự thực thi quan trọng. | Muốn chạy coroutine **song song**, không chặn luồng async.\r\nChạy tác vụ nền (background job).\r\nChạy nhiều coroutine đồng thời. |\r\n\r\n**Các điểm quan trọng khác**\r\n\r\nBạn có thể kết hợp mã **đồng bộ** và **bất đồng bộ** trong cùng một chương trình. Vì mã đồng bộ sẽ chặn (blocking) chương trình, ta có thể **chuyển nó sang một luồng riêng** bằng asyncio.to_thread(). Cách làm này khiến chương trình của bạn thực sự chạy đa luồng. Trong ví dụ dưới đây, vòng lặp sự kiện asyncio chạy trên luồng chính, còn một luồng nền riêng được sử dụng để thực thi hàm sync_task (một hàm đồng bộ giả định):\r\n\r\n```python\r\npython\r\nimport asyncio\r\nimport time\r\n\r\ndef sync_task():\r\n    time.sleep(2)\r\n    return "Completed"\r\n\r\nasync def main():\r\n    result = await asyncio.to_thread(sync_task)\r\n    print(result)\r\n\r\nasyncio.run(main())\r\n```\r\n\r\nBạn cũng nên chuyển các tác vụ **CPU-bound (tốn nhiều CPU)** sang một **tiến trình** riêng biệt.\r\n\r\n# **Khi nào nên dùng mô hình đồng thời nào?**\r\n\r\n![Nên dùng xử lý song song hay đồng thời?](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-77b53a1345e24252ae7e656eca3f851c-image.png)\r\n\r\nNếu một tác vụ **không phải I/O-bound** (tức không bị giới hạn bởi I/O), hãy sử dụng **đa tiến trình**. Nếu tác vụ đó **I/O-bound**, xem xét tốc độ I/O: nếu I/O **rất chậm**, dùng **Asyncio**; nếu **không quá chậm**, dùng **đa luồng**.\r\n\r\n1. **Đa tiến trình**: \r\n    - Phù hợp nhất cho các tác vụ CPU-bound đòi hỏi nhiều tính toán.\r\n    - Khi bạn cần vượt qua GIL – mỗi tiến trình có trình thông dịch Python riêng, cho phép tận dụng song song đa lõi thực sự.\r\n2. **Đa luồng**: \r\n    - Tối ưu cho các tác vụ I/O-bound nhanh do tần suất chuyển ngữ cảnh thấp, trình thông dịch Python có xu hướng giữ trên một luồng lâu hơn.\r\n    - Không lý tưởng cho các tác vụ CPU-bound do ảnh hưởng của GIL.\r\n3. **Asyncio**: \r\n    - Lý tưởng cho các tác vụ I/O-bound chậm (ví dụ các request mạng kéo dài hoặc truy vấn CSDL lâu) vì nó quản lý thời gian chờ rất hiệu quả, giúp chương trình có khả năng mở rộng tốt.\r\n    - Không phù hợp cho các tác vụ CPU-bound nếu không di chuyển công việc sang tiến trình khác.	33	2026-03-02 16:34:27.673626	2026-03-11 07:23:21.829566	https://minio.dutai.site/dut-ai-manager-prod/blogs/async-c3c5a0ff696c4d0591fc4bdc2fcefda7-1.png	\N	Trong quá trình làm việc với các dự án liên quan đến quản lý số lượng lớn request, tôi nhận thấy có hai cách tiếp cận phổ biến để xử lý vấn đề này: sử dụng đa luồng (multithreading) hoặc lập trình bất đồng bộ (asynchronous programming). Mỗi phương pháp đều có ưu và nhược điểm, và việc lựa chọn không chỉ phụ thuộc vào yêu cầu của dự án mà còn vào cách bạn tổ chức logic xử lý.	concurrency-and-parallelism-4
5	Trực quan hóa dữ liệu bằng mathplotlib	# 1. Giới thiệu\r\n\r\n- Trong kỷ nguyên số, dữ liệu được ví như nguồn tài nguyên dầu mỏ mới, nhưng giá trị của nó không nằm ở dạng thô mà ở khả năng tinh lọc thành thông tin hữu ích. Trực quan hóa dữ liệu (Data Visualization) không đơn thuần là quá trình tạo ra các biểu đồ đồ họa; đó là một phương thức giao tiếp nhận thức, chuyển đổi các cấu trúc dữ liệu trừu tượng thành các mô hình thị giác mà não bộ con người có thể xử lý nhanh chóng. Khả năng nhận diện mẫu (pattern recognition), phát hiện xu hướng (trend detection) và tìm ra các điểm dị biệt (outlier identification) của con người được khuếch đại mạnh mẽ thông qua các kênh thị giác.\r\n- Trong quy trình Khoa học Dữ liệu (Data Science pipeline), trực quan hóa đóng vai trò kép:\r\n    1. **Phân tích Khám phá (Exploratory Data Analysis - EDA):** Giúp nhà khoa học dữ liệu hiểu cấu trúc, phân phối và chất lượng của dữ liệu trước khi áp dụng các mô hình học máy.\r\n    2. **Trình bày Kết quả (Explanatory Analysis):** Truyền tải những phát hiện phức tạp đến các bên liên quan (stakeholders) một cách thuyết phục và dễ hiểu.\r\n- Matplotlib là thư viện phổ biến nhất trong Python để trực quan hóa dữ liệu. Thư viện này được thiết kế để dễ sử dụng, hỗ trợ vẽ trực tiếp từ các cấu trúc dữ liệu cơ bản như\r\nlist hoặc numpy array.\r\n\r\n# 2. Cài đặt thư viện\r\n\r\n```bash\r\npip install matplotlib\r\nimport matplotlib.pyplot as plt\r\n```\r\n\r\n\r\n# **3. State-based vs. Object-Oriented**\r\n\r\n- Một trong những nguyên nhân gây nhầm lẫn lớn nhất cho người học Matplotlib là sự tồn tại song song của hai giao diện lập trình (API). Việc không phân biệt rõ ràng hai giao diện này dẫn đến việc viết code "lai tạp", khó bảo trì và dễ gây lỗi.\r\n- **Giao diện Pyplot (Implicit / State-based Interface):** Được thiết kế để mô phỏng MATLAB, giao diện này sử dụng các hàm toàn cục trong module `pyplot` (thường được import là `plt`). Các hàm này tự động tác động lên "Figure hiện tại" và "Axes hiện tại".\r\n    - *Ví dụ:* `plt.plot(x, y)`, `plt.title('Title')`.\r\n    - *Hạn chế:* Trạng thái toàn cục (global state) làm cho việc quản lý các biểu đồ phức tạp (nhiều subplots) trở nên rối rắm. Nó giống như việc điều khiển một con trỏ vô hình; bạn phải luôn nhớ con trỏ đang nằm ở đâu.\r\n- **Giao diện Hướng đối tượng (Explicit / Object-Oriented Interface):** Đây là cách tiếp cận "Pythonic" và được khuyến nghị cho mọi dự án nghiêm túc. Trong giao diện này, chúng ta khởi tạo các đối tượng cụ thể (`Figure`, `Axes`) và gọi phương thức trên chính các đối tượng đó.\r\n    - *Ví dụ:* `fig, ax = plt.subplots()`, `ax.plot(x, y)`, `ax.set_title('Title')`.\r\n    - *Ưu điểm:* Rõ ràng, minh bạch ("Explicit is better than implicit" - Zen of Python). Chúng ta biết chính xác lệnh vẽ đang tác động lên vùng nào. Điều này cho phép tái sử dụng code, tạo các hàm vẽ tùy biến và nhúng biểu đồ vào ứng dụng lớn.\r\n\r\n# **4. Giao diện Pyplot**\r\n\r\n> Cơ sở dữ liệu tiền boa là bản ghi về tiền boa của khách hàng tại một nhà hàng trong hai tháng rưỡi vào đầu những năm 1990. Cơ sở dữ liệu này chứa 6 cột như tổng hóa đơn, tiền boa, giới tính, người hút thuốc, ngày, giờ, kích cỡ.\r\n> \r\n\r\n```python\r\nimport pandas as pd\r\n\r\n# reading the database\r\ndata = pd.read_csv("tips.csv")\r\n\r\n# printing the top 10 rows\r\ndisplay(data.head(10))\r\n```\r\n\r\n![Cơ sở dữ liệu tiền boa](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-520df4e5289742a58157f92aef7660bc-image.png)\r\n\r\n## **4.1. Scatter Plot**\r\n\r\n<aside>\r\nScatter plot hiển thị **mối quan hệ giữa hai biến số** (x và y). Mỗi điểm trên biểu đồ là một quan sát.\r\n</aside>\r\n\r\nDùng khi nào?\r\n\r\n- Kiểm tra **tương quan** (correlation): tuyến tính, phi tuyến,…\r\n- Phát hiện **outlier**.\r\n- Xem độ **rải** của dữ liệu.\r\n\r\nVí dụ:\r\n\r\n- Chiều cao vs cân nặng\r\n- Ngày phát hành phim vs doanh thu\r\n\r\n```python\r\nimport pandas as pd\r\nimport matplotlib.pyplot as plt\r\n\r\n# reading the database\r\ndata = pd.read_csv("tips.csv")\r\n\r\n# Scatter plot with day against tip\r\nplt.scatter(data['day'], data['tip'])\r\n\r\n# Adding Title to the Plot\r\nplt.title("Scatter Plot")\r\n\r\n# Setting the X and Y labels\r\nplt.xlabel('Day')\r\nplt.ylabel('Tip')\r\n\r\nplt.show()\r\n```\r\n\r\n![Scatter plot](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-8217daf799a7423baed1319d8b259ffa-image.png)\r\n\r\n> Biểu đồ này có ý nghĩa hơn nếu chúng ta có thể thêm màu và thay đổi kích thước của các điểm.\r\n> \r\n\r\n![Scatter plot](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-1769b3fa36f04a84aa2bf9f72b819c78-image.png)\r\n\r\n```python\r\nimport pandas as pd\r\nimport matplotlib.pyplot as plt\r\n\r\n# reading the database\r\ndata = pd.read_csv("tips.csv")\r\n\r\n# Scatter plot with day against tip\r\nsc = plt.scatter(\r\n    data['day'],\r\n    data['tip'],\r\n    c=data['size'],       # màu thể hiện size\r\n    s=data['total_bill'], # kích thước thể hiện total_bill\r\n    cmap='viridis'        # thêm colormap cho đẹp (tuỳ chọn)\r\n)\r\n\r\n# Thêm title\r\nplt.title("Scatter Plot")\r\n\r\n# Thêm nhãn trục\r\nplt.xlabel('Day')\r\nplt.ylabel('Tip')\r\n\r\n# Thêm colorbar + nhãn cho colorbar\r\ncbar = plt.colorbar(sc)\r\ncbar.set_label('Party size')\r\n\r\n# Thêm chú giải cho kích thước điểm (total_bill)\r\nfrom matplotlib.lines import Line2D\r\nlegend_elements = [\r\n    Line2D([0], [0], marker='o', color='w', label='Small bill',  markersize=5,  markerfacecolor='gray'),\r\n    Line2D([0], [0], marker='o', color='w', label='Medium bill', markersize=10, markerfacecolor='gray'),\r\n    Line2D([0], [0], marker='o', color='w', label='Large bill',  markersize=15, markerfacecolor='gray'),\r\n]\r\nplt.legend(handles=legend_elements, title='Total bill', loc='upper left')\r\n\r\nplt.show()\r\n```\r\n\r\n## 4.2. Line chart\r\n\r\n<aside>\r\n\r\nLine chart mô tả **xu hướng theo thời gian** (time series). Các điểm dữ liệu được nối lại thành đường.\r\n\r\n</aside>\r\n\r\nDùng khi nào?\r\n\r\n- Theo dõi **biến động theo thời gian**: ngày, tháng, năm\r\n- So sánh **trend** giữa các nhóm\r\n- Xem **tốc độ tăng/giảm**\r\n\r\nVí dụ:\r\n\r\n- Doanh thu theo ngày\r\n- Nhiệt độ theo giờ\r\n- Giá cổ phiếu theo thời gian\r\n\r\n```python\r\n# Scatter plot with day against tip\r\nplt.plot(data['tip'])\r\nplt.plot(data['size'])\r\n\r\n# Adding Title to the Plot\r\nplt.title("Scatter Plot")\r\n\r\n# Setting the X and Y labels\r\nplt.xlabel('Day')\r\nplt.ylabel('Tip')\r\n\r\nplt.show()\r\n```\r\n\r\n![Line chart](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-9f5f1ff909124e399b3736fa2ebe6592-image.png)\r\n\r\n## **4.3. Bar Chart**\r\n\r\n<aside>\r\n\r\nBar chart so sánh **giá trị giữa các danh mục (categories)**. Chiều cao của cột thể hiện độ lớn.\r\n\r\n</aside>\r\n\r\nDùng khi nào?\r\n\r\n- So sánh **số lượng** hoặc **giá trị** giữa các nhóm\r\n- Dữ liệu dạng phân loại (categorical)\r\n\r\nVí dụ:\r\n\r\n- Số lượng phim theo thể loại\r\n- Doanh thu theo hãng phim\r\n- Số lượng bài viết theo từng tỉnh thành\r\n\r\n```python\r\n# Bar chart with day against tip\r\nplt.bar(data['day'], data['tip'])\r\n\r\nplt.title("Bar Chart")\r\n\r\n# Setting the X and Y labels\r\nplt.xlabel('Day')\r\nplt.ylabel('Tip')\r\n\r\n# Adding the legends\r\nplt.show()\r\n```\r\n\r\n![Bar Chart](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-3c32d253554a4da19bd398610240229f-image.png)\r\n\r\n## 4.4. Histogram\r\n\r\n<aside>\r\n\r\nHistogram mô tả **phân phối của một biến liên tục**. Dữ liệu được chia thành các “bins”; chiều cao là **tần suất**.\r\n\r\n</aside>\r\n\r\nDùng khi nào?\r\n\r\n- Kiểm tra **phân phối** (chuẩn, lệch phải, lệch trái…)\r\n- Tìm **outlier**\r\n- Hiểu rõ độ tập trung/độ phân tán của dữ liệu\r\n\r\nVí dụ:\r\n\r\n- Phân phối điểm thi\r\n- Phân phối doanh thu phim\r\n- Phân phối khoảng cách đo được từ cảm biến\r\n\r\n```python\r\n# histogram of total_bills\r\nplt.hist(data['total_bill'], bins=20)\r\n\r\nplt.title("Histogram")\r\n\r\n# Adding the legends\r\nplt.show()\r\n```\r\n\r\n![Histogram chart](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-cba5268f9a664343bd73ba29e17ef3ca-image.png)\r\n# **5. Giao diện Hướng đối tượng**\r\n\r\n## **5.1. Cấu trúc Phân cấp của Đối tượng Figure**\r\n\r\nCấu trúc cây (hierarchy) của một Figure là nền tảng để tùy biến mọi chi tiết.   \r\n\r\n1. **Figure (Khung tranh):**\r\n    - Là container cấp cao nhất. Nó chứa tất cả các Axes, tiêu đề chung (`suptitle`), chú giải (`legend`) và thanh màu (`colorbar`).\r\n    - Thuộc tính quan trọng: `figsize` (kích thước vật lý), `dpi` (độ phân giải), `facecolor` (màu nền).\r\n    - Mối quan hệ: `Figure` chứa danh sách các `Axes` trong thuộc tính `fig.axes`\r\n2. **Axes (Vùng vẽ):**\r\n    - Đây là thành phần quan trọng nhất và dễ gây nhầm lẫn nhất (Axes). `Axes` đại diện cho một vùng không gian dữ liệu cụ thể, bao gồm hệ tọa độ, vùng vẽ (plot area), các trục (X, Y) và các nhãn.\r\n    - Một Figure có thể chứa nhiều Axes (subplots), nhưng một Axes chỉ thuộc về một Figure.\r\n    - Hầu hết các phương thức vẽ (`.plot()`, `.scatter()`, `.bar()`) đều được gọi từ đối tượng.\r\n3. **Axis (Trục tọa độ):**\r\nMỗi `Axes` thường có hai `Axis` (XAxis và YAxis). Đối tượng này chịu trách nhiệm:\r\n    - Xác định giới hạn dữ liệu (`limits`).\r\n    - Quản lý các vạch chia (`Ticks`) và nhãn của vạch chia (`TickLabels`).\r\n    - Xác định vị trí của vạch chia thông qua `Locators` và định dạng chuỗi hiển thị thông qua `Formatters`.\r\n4. **Primitive Artists (Phần tử nguyên thủy):**\r\n    ◦ Các hình cơ bản được vẽ bên trong `Axes`: `Line2D` (đường), `Rectangle` (thanh bar), `Text` (chữ), `PathCollection` (scatter points), `AxesImage` (heatmap).\r\n\r\n## **5.2. Các hàm hay dùng**\r\n\r\n```python\r\nfig, axes = plt.subplots(\r\n  nrows=,\r\n  ncols=,\r\n  figsize=,\r\n  dpi=\r\n  constrained_layout=True\r\n)\r\n```\r\n\r\n```python\r\nax.set_title(title, fontsize=13)\r\nax.set_xlabel(xlabel)\r\nax.set_ylabel(ylabel)\r\nax.set_xlim((1, 100))\r\nax.set_ylim((0,1))\r\nax.xscale()\r\nax.yscale()\r\nax.legend()\r\n```\r\n\r\n## 5.3. Boxplot\r\n\r\n<aside>\r\n\r\nThể hiện **phân phối**, **median**, **quartile**, **outliers** của một biến số. Rất phù hợp để so sánh nhiều nhóm **categorical**.\r\n\r\n</aside>\r\n\r\nVí dụ câu hỏi:\r\n\r\n- "Tiền tip của người hút thuốc có khác nhiều so với người không hút không?"\r\n- "Ngày nào khách tip cao nhất?"\r\n\r\n```python\r\nfig, ax = plt.subplots(figsize=(8, 6))\r\ndata = [tips[tips["day"] == d]["tip"] for d in tips["day"].unique()]\r\nax.boxplot(data, labels=tips["day"].unique())\r\nax.set_title("Boxplot of Tip by Day")\r\nax.set_ylabel("Tip")\r\nfig.show()\r\n```\r\n\r\n![Boxplot](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-69c1205b70474fc7a2c6b995f3293c30-image.png)\r\n\r\n## 5.4. Violin plot\r\n\r\n<aside>\r\n\r\nVừa là boxplot, vừa có **kernel density**, cho thấy hình dạng phân phối mượt.\r\n\r\n</aside>\r\n\r\nVí dụ:\r\n\r\n- “Sự khác nhau trong phân phối tiền tip giữa khách nam và nữ?”\r\n\r\n```python\r\nfig, ax = plt.subplots(figsize=(8, 6))\r\ngroups = [tips[tips["time"] == t]["tip"] for t in tips["time"].unique()]\r\nax.violinplot(groups, showmeans=True)\r\nax.set_xticks([1, 2])\r\nax.set_xticklabels(tips["time"].unique())\r\nax.set_title("Violin Plot of Tip by Time")\r\nfig.show()\r\n```\r\n\r\n![Violin Plot](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-e664cbc99ee64f4a8fe70d43112ab6f3-image.png)\r\n## 5.5. Pie chart\r\n\r\n<aside>\r\n\r\nDùng cho tỉ lệ phần trăm, nhưng khó đọc → Không khuyến nghị nếu có lựa chọn tốt hơn.\r\n\r\n</aside>\r\n\r\n```python\r\nfig, ax = plt.subplots(figsize=(8, 6))\r\ncounts = tips["smoker"].value_counts()\r\nax.pie(counts.values, labels=counts.index, autopct="%1.1f%%")\r\nax.set_title("Smoker vs Non-Smoker Ratio")\r\nfig.show()\r\n\r\n```\r\n\r\n![Pie chart](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-31c8423945014dbc83f01e7ac0dfc4d3-image.png)\r\n\r\n## 5.6. Multiple scatter plots (facet-like)\r\n\r\n<aside>\r\n\r\nSo sánh mối quan hệ giữa hai biến trong từng nhóm, hiện hình dạng phân phối của từng nhóm, tách bạch hiệu ứng của categorical variable\r\n\r\n</aside>\r\n\r\n```python\r\nfig, axs = plt.subplots(1, 2, figsize=(14, 6), sharey=True)\r\n\r\ncategories = ["Yes", "No"]\r\n\r\nfor i, cat in enumerate(categories):\r\n    subset = tips[tips["smoker"] == cat]\r\n    axs[i].scatter(subset["total_bill"], subset["tip"])\r\n    axs[i].set_title(f"Smoker = {cat}")\r\n    axs[i].set_xlabel("Total Bill")\r\n    if i == 0:\r\n        axs[i].set_ylabel("Tip")\r\n\r\nfig.suptitle("Facet-like Scatter: Smoker vs Non-Smoker")\r\nfig.show()\r\n```\r\n\r\n![Multiple scatter plots](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-adaba6e0a8f146c2b521840d63994f66-image.png)\r\n\r\n## 5.7. Correlation heatmap\r\n\r\n<aside>\r\n\r\nHiển thị mức độ tương quan giữa các biến số\r\n\r\n</aside>\r\n\r\n```python\r\nimport numpy as np\r\n\r\nfig, ax = plt.subplots(figsize=(8, 6))\r\ncorr = tips[["total_bill", "tip", "size"]].corr()\r\n\r\ncax = ax.matshow(corr, cmap="coolwarm")\r\nfig.colorbar(cax)\r\n\r\nax.set_xticks(range(len(corr.columns)))\r\nax.set_yticks(range(len(corr.columns)))\r\nax.set_xticklabels(corr.columns)\r\nax.set_yticklabels(corr.columns)\r\n\r\nax.set_title("Correlation Matrix", pad=20)\r\nfig.show()\r\n```\r\n\r\n![Correlation heatmap](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-5a9a592e1c5d4d1fba8fade6479b01f9-image.png)\r\n\r\n# Tài liệu tham khảo\r\n\r\n[Trực quan hóa dữ liệu dùng List và Matplotlib](https://drive.google.com/file/d/1sA0qrk5bF99cG4ugeMhe_Zpvz-w5Gy5U/view)	17	2026-03-06 06:58:43.680127	2026-03-11 07:23:21.818011	https://minio.dutai.site/dut-ai-manager-prod/blogs/async-17f62998ca3e4ea7befb0666c4231977-images.jpeg	\N	Trực quan hóa dữ liệu (Data Visualization) không đơn thuần là quá trình tạo ra các biểu đồ đồ họa; đó là một phương thức giao tiếp nhận thức, chuyển đổi các cấu trúc dữ liệu trừu tượng thành các mô hình thị giác mà não bộ con người có thể xử lý nhanh chóng. Khả năng nhận diện mẫu (pattern recognition), phát hiện xu hướng (trend detection) và tìm ra các điểm dị biệt (outlier identification) của con người được khuếch đại mạnh mẽ thông qua các kênh thị giác	truc-quan-hoa-du-lieu-bang-mathplotlib-5
3	Chiến lược đánh giá mô hình	# Tổng quan chiến lược đánh giá\r\n\r\n- Trong bối cảnh phát triển vũ bão của trí tuệ nhân tạo, sự chú ý thường đổ dồn vào các kiến trúc mô hình mới lạ hay các bộ dữ liệu khổng lồ. Tuy nhiên, với tư cách là một Chuyên gia Khoa học Dữ liệu và Giảng viên, tôi khẳng định rằng "trái tim" của một hệ thống học máy (Machine Learning - ML) thành công không nằm ở sự phức tạp của thuật toán, mà nằm ở **chiến lược kiểm định (evaluation strategy)**. Một mô hình không được kiểm định đúng cách giống như một chiếc xe đua không có phanh: nó có thể chạy rất nhanh nhưng sẽ gặp thảm họa khi đối mặt với khúc cua đầu tiên của thực tế.\r\n- Việc đánh giá mô hình đã vượt xa khỏi việc đơn thuần tính toán độ chính xác (accuracy) hay sai số bình phương trung bình (MSE). Nó đã trở thành một quy trình quản trị rủi ro đa tầng, đòi hỏi sự hiểu biết sâu sắc về thống kê học, bản chất phân phối của dữ liệu và ngữ cảnh kinh doanh. Một mô hình có độ chính xác 99% trong phòng thí nghiệm (offline) vẫn có thể thất bại thảm hại khi triển khai thực tế (online) do các vấn đề như rò rỉ dữ liệu (data leakage), sự trôi dạt dữ liệu (data drift), hoặc sự thiên kiến đối với các nhóm thiểu số (fairness bias).\r\n- Một sai lầm chiến lược phổ biến là đánh đồng hiệu suất mô hình trong môi trường nghiên cứu với hiệu quả kinh doanh. Chúng ta cần phân biệt rõ hai giai đoạn đánh giá với các mục tiêu và rủi ro khác nhau.\r\n    - **Đánh giá Offline (Offline Evaluation)** Đây là giai đoạn phát triển, sử dụng dữ liệu lịch sử đã thu thập.\r\n        - **Mục tiêu:** Chọn lọc mô hình tốt nhất từ các ứng viên, tối ưu hóa siêu tham số.\r\n        - **Phương pháp:** Cross-Validation, Bootstrapping, Hold-out.\r\n        - **Ưu điểm:** Nhanh, chi phí thấp, không ảnh hưởng đến người dùng thật.\r\n        - **Nhược điểm:** Giả định rằng "tương lai sẽ giống quá khứ". Không đo lường được các yếu tố tâm lý người dùng hoặc phản hồi thời gian thực. Ví dụ, một mô hình gợi ý phim có độ chính xác cao trên dữ liệu cũ (MovieLens) có thể thất bại vì thị hiếu người dùng đã thay đổi sau một sự kiện xã hội.\r\n    - **Đánh giá Online (Online Evaluation)** Đây là giai đoạn triển khai thử nghiệm trong môi trường thực (production).\r\n        - **Mục tiêu:** Đo lường tác động thực tế lên các chỉ số kinh doanh (Business Metrics).\r\n        - **Phương pháp:** A/B Testing, Multi-armed Bandits, Interleaving.\r\n        - **Chỉ số:** Click-through Rate (CTR), Conversion Rate, Return on Investment (ROI).\r\n        - **Rủi ro:** Có thể làm giảm trải nghiệm người dùng nếu mô hình mới hoạt động kém.\r\n\r\n<aside>\r\nTài liệu này sẽ tập trung sâu vào các chiến lược **Offline**, vì đây là nền tảng kỹ thuật bắt buộc phải làm chủ trước khi bất kỳ thử nghiệm Online nào được phép diễn ra.\r\n</aside>\r\n\r\n# Các Phương pháp Kiểm định Cụ thể\r\n\r\n## Hold-out Method\r\n\r\nPhương pháp Hold-out là kỹ thuật sơ khai nhất, thường được giảng dạy trong các bài học vỡ lòng, nhưng việc áp dụng nó đòi hỏi sự cẩn trọng lớn về kích thước mẫu.\r\n\r\n**Cơ chế hoạt động:** Dữ liệu được chia ngẫu nhiên thành hai phần tách biệt: Tập huấn luyện (Training set) và Tập kiểm thử (Test set). Tỷ lệ phổ biến là 70/30 hoặc 80/20. Trong các ứng dụng phức tạp hơn, dữ liệu được chia làm ba phần: Train (để học tham số), Validation (để tinh chỉnh siêu tham số), và Test (để đánh giá cuối cùng).\r\n\r\n**Phân tích sâu:**\r\n\r\n- **Ưu điểm:** Tốc độ nhanh do chỉ huấn luyện một lần. Rất phù hợp với "Big Data" nơi việc huấn luyện lại nhiều lần là bất khả thi về mặt tài nguyên.\r\n- **Nhược điểm chí mạng:** Độ biến thiên cao (High Variance). Kết quả đánh giá phụ thuộc hoàn toàn vào việc những điểm dữ liệu nào "may mắn" rơi vào tập Train hay tập Test. Nếu tập Test vô tình chứa toàn các mẫu khó (outliers) hoặc không đại diện cho phân phối chung, mô hình sẽ bị đánh giá sai lệch.\r\n\r\n**VD: Hệ thống Phân loại Spam Email quy mô lớn**\r\n\r\n- **Bối cảnh:** Một nhà cung cấp dịch vụ email xử lý 50 triệu email mỗi ngày. Họ cần cập nhật mô hình phân loại Spam hàng tuần.\r\n- **Vấn đề:** Với 50 triệu mẫu, việc chạy K-Fold Cross-Validation (ví dụ: 5 lần) sẽ tiêu tốn tài nguyên máy chủ khổng lồ và mất quá nhiều thời gian, làm chậm quy trình cập nhật.\r\n- **Giải pháp:** Áp dụng phương pháp Hold-out. Họ trích xuất 5 triệu email mới nhất (hoặc ngẫu nhiên) làm tập Test.\r\n- **Lý giải:** Theo Định luật số lớn (Law of Large Numbers), khi kích thước mẫu $N$ đủ lớn, các đặc trưng thống kê của tập mẫu con sẽ hội tụ về các đặc trưng của tập tổng thể. Với tập Test lên tới 5 triệu mẫu, phương sai của ước lượng lỗi là cực nhỏ, khiến việc Cross-Validation trở nên thừa thãi. Hold-out ở đây là sự lựa chọn tối ưu giữa độ chính xác thống kê và chi phí tính toán.\r\n\r\n## K-Fold Cross-Validation (Kiểm định chéo K-lần)\r\n\r\n- Để khắc phục nhược điểm lãng phí dữ liệu và độ biến thiên cao của Hold-out đối với các bộ dữ liệu vừa và nhỏ, K-Fold CV được coi là tiêu chuẩn vàng (Gold Standard).\r\n- **Cơ chế hoạt động**: Dữ liệu được chia ngẫu nhiên thành $K$phần (folds) có kích thước bằng nhau. Quy trình được lặp lại $K$ lần. Trong mỗi lần lặp $i$, phần thứ $i$ được dùng làm tập kiểm thử, và $K-1$ phần còn lại hợp nhất thành tập huấn luyện. Kết quả cuối cùng là trung bình cộng của $K$ điểm số đánh giá.\r\n\r\n![Hình ảnh giải thích K-Fold](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-af15b4ec7d6e4c0fae709e6fc7da9b8c-image.png)\r\n\r\n\r\n- **Phân tích sâu:**\r\n    - **Lựa chọn K:** $K=5$ hoặc $K=10$ là các giá trị tối ưu thực nghiệm. $K$ thấp dẫn đến Bias cao (do tập train nhỏ). $K$ cao dẫn đến Variance cao và chi phí lớn.\r\n    - **Giảm thiểu Overfitting:** Vì mỗi điểm dữ liệu đều được dùng để kiểm thử đúng một lần, K-Fold cung cấp một bức tranh toàn diện hơn về khả năng tổng quát hóa của mô hình trên toàn bộ miền dữ liệu.\r\n- **VD: Định giá Bất động sản (Dữ liệu quy mô trung bình)**\r\n    - **Bối cảnh:** Một công ty prop-tech có dữ liệu của 5,000 ngôi nhà. Mục tiêu là dự đoán giá bán.\r\n    - **Vấn đề:** Khi sử dụng Hold-out 80/20, kỹ sư nhận thấy độ chính xác dao động mạnh ($R^2$ từ 0.75 đến 0.85) mỗi lần chạy lại code. Điều này khiến họ không thể kết luận liệu việc thêm đặc trưng mới (feature engineering) có thực sự cải thiện mô hình hay không.\r\n    - **Giải pháp:** Chuyển sang 10-Fold Cross-Validation.\r\n    - **Kết quả:** Họ thu được $R^2$ trung bình là 0.81 với độ lệch chuẩn thấp (0.02). Con số trung bình này đáng tin cậy hơn nhiều so với một lần chạy ngẫu nhiên. Hơn nữa, việc này cho phép họ sử dụng toàn bộ 5,000 mẫu dữ liệu để đánh giá, tránh lãng phí những mẫu nhà "độc lạ" có thể rơi vào tập train ở phương pháp hold-out.\r\n\r\n## Stratified K-Fold (Phân tầng) - Giải pháp cho Dữ liệu Mất cân bằng\r\n\r\n- Trong thực tế, dữ liệu hiếm khi phân phối đều. Đối với bài toán phân loại, việc sử dụng K-Fold ngẫu nhiên có thể dẫn đến thảm họa nếu một fold nào đó hoàn toàn không chứa lớp thiểu số (minority class).\r\n- **Cơ chế hoạt động:** Stratified K-Fold cải tiến K-Fold bằng cách đảm bảo tỷ lệ các lớp (class distribution) trong mỗi fold xấp xỉ bằng tỷ lệ của chúng trong tập dữ liệu gốc. Ví dụ: Nếu tập dữ liệu có 90% lớp A và 10% lớp B, thì mỗi fold huấn luyện và kiểm thử cũng sẽ duy trì tỷ lệ 9:1 này.\r\n![Hình ảnh giải thích Stratified K-Fold Cross Validation](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-afca4a80754a4c5bb9e9f00a2c790536-image.png)\r\n\r\n**Case Study 3: Phát hiện Gian lận Thẻ Tín dụng (Fraud Detection)**\r\n\r\n- **Bối cảnh:** Ngân hàng cần phát hiện giao dịch gian lận, vốn chỉ chiếm 0.1% tổng số giao dịch.\r\n- **Vấn đề:** Khi dùng K-Fold thường, có khả năng cao một số fold kiểm thử sẽ hoàn toàn không chứa giao dịch gian lận nào. Khi đó, việc tính toán các chỉ số như Recall hay Precision là vô nghĩa (chia cho 0) hoặc sai lệch.\r\n- **Giải pháp:** Stratified K-Fold ép buộc mỗi fold phải chứa đúng đại diện của lớp gian lận.\r\n- **Kết quả:** Đánh giá trở nên ổn định. Ngân hàng nhận thấy mô hình cũ tuy có Accuracy 99.9% nhưng F1-score chỉ đạt 0.4. Nhờ đánh giá đúng, họ chuyển sang sử dụng các hàm loss function có trọng số (weighted loss) để cải thiện khả năng bắt gian lận.\r\n\r\n## Repeated K-Fold Cross-Validation - Giảm nhiễu tối đa\r\n\r\n- Ngay cả K-Fold cũng chứa yếu tố ngẫu nhiên từ cách chia dữ liệu ban đầu. Với các tập dữ liệu nhỏ hoặc nhiều nhiễu (noisy data), kết quả của một lần chạy 10-Fold CV vẫn có thể chưa hội tụ về giá trị thực. (hay K-Fold CV **phụ thuộc vào cách chia fold,** *may rủi của việc split dữ liệu*, **không phải do mô hình)**\r\n- Cơ chế hoạt động: Phương pháp này thực hiện quy trình K-Fold $n$ lần (n_repeats). Trong mỗi lần lặp lại quy trình, dữ liệu được xáo trộn (shuffle) theo một cách khác nhau. Kết quả cuối cùng là trung bình của $K \\times n$ lần đánh giá.\r\n- Đây là cách tiếp cận "lấy cần cù bù thông minh". Bằng cách tăng số lượng mẫu đánh giá, ta giảm được sai số chuẩn của ước lượng trung bình (Standard Error of the Mean), giúp phân biệt được sự cải thiện nhỏ giữa các mô hình.\r\n\r\n\r\n![Hình ảnh mô tả ShuffleSplit](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-a8bd99f6afae4196ba288b5695804424-image.png)\r\n## Leave-One-Out Cross-Validation (LOOCV) - Chiến lược cho Dữ liệu Cực nhỏ\r\n\r\n- LOOCV là trường hợp cực đoan của K-Fold khi $K = N$ (số lượng mẫu)\r\n- Cơ chế hoạt động: Với $N$ mẫu dữ liệu, chúng ta thực hiện $N$ lần huấn luyện. Mỗi lần, chúng ta lấy đúng 1 mẫu duy nhất làm tập kiểm thử và $N-1$ mẫu còn lại để huấn luyện.\r\n- **Phân tích sâu:**\r\n    - **Ưu điểm:** Loại bỏ hoàn toàn Bias do việc chọn tập train (vì tập train gần như là toàn bộ dữ liệu). Kết quả có tính tái lập hoàn toàn (deterministic).\r\n    - **Nhược điểm:**\r\n        1. **Chi phí tính toán:** Phải train mô hình $N$ lần.\r\n        2. **Nghịch lý Phương sai (Variance Paradox):** Mặc dù Bias thấp, nhưng các mô hình được tạo ra giống nhau đến mức chúng tương quan cực cao (highly correlated). Thống kê học chỉ ra rằng trung bình của các biến tương quan cao sẽ có phương sai cao. Do đó, LOOCV có thể đánh giá sai hiệu suất thực tế trên dữ liệu mới.\r\n![Hình ảnh mô tả Leave-One-Out Cross-Validation](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-903b3ae2578a4ae8afbeee29deb22b45-image.png)\r\n\r\n\r\n**Case Study 5: Chẩn đoán Bệnh hiếm (Rare Disease Diagnosis)**\r\n\r\n- **Bối cảnh:** Bệnh viện nghiên cứu một loại bệnh di truyền cực hiếm, chỉ thu thập được 40 hồ sơ bệnh án trong 5 năm.\r\n- **Vấn đề:** Nếu dùng 5-Fold CV, mỗi fold test chỉ có 8 người. Nếu dùng Hold-out, tập train chỉ còn 30 người, quá ít để mô hình học được quy luật phức tạp.\r\n- **Giải pháp:** Áp dụng LOOCV. Mỗi lần mô hình học từ 39 người và đoán cho 1 người.\r\n- **Kết quả:** LOOCV cho phép tối đa hóa dữ liệu huấn luyện. Dù có rủi ro về phương sai, nhưng đây là lựa chọn khả dĩ duy nhất để không bỏ phí bất kỳ bệnh án quý giá nào. Các nhà nghiên cứu chấp nhận chi phí tính toán để đổi lấy khả năng tận dụng dữ liệu.\r\n\r\n## Nested Cross-Validation (CV Lồng nhau) - Chống Rò rỉ Tri thức trong Tối ưu hóa\r\n\r\n- Đây là phương pháp quan trọng nhất nhưng thường bị bỏ qua nhất. Nó giải quyết vấn đề **"Optimism Bias"** khi thực hiện tinh chỉnh siêu tham số (Hyperparameter Tuning).\r\n- **Vấn đề:** Nếu bạn dùng Cross-Validation để chọn tham số tốt nhất (ví dụ: dùng `GridSearchCV`), rồi báo cáo điểm số tốt nhất đó như là hiệu suất của mô hình, bạn đang phạm lỗi. Mô hình đã "nhìn thấy" dữ liệu validation để chỉnh sửa bản thân nó. Điểm số này sẽ lạc quan hơn thực tế.\r\n- **Cơ chế hoạt động:** Cấu trúc 2 vòng lặp lồng nhau:\r\n    - **Outer Loop (Vòng ngoài):** Chia dữ liệu thành các fold để **đánh giá hiệu suất trung thực**. Tập test của vòng này hoàn toàn chưa được đụng tới trong quá trình chọn tham số.\r\n    - **Inner Loop (Vòng trong):** Nằm bên trong mỗi fold huấn luyện của vòng ngoài. Dùng để chạy CV tìm tham số tốt nhất.\r\n![Hình ảnh mô tả Nested Cross-Validation](https://minio.dutai.site/dut-ai-manager-prod/blogs/async-9ef153c66bb14c11a55cf1a13127df2d-image.png)\r\n\r\n```python\r\nfrom sklearn.model_selection import GridSearchCV, KFold\r\n\r\n# Định nghĩa lưới tham số\r\np_grid = {"n_estimators": , "max_depth": [None, 5, 10]}\r\n\r\n# Inner CV: Dùng để tìm tham số tốt nhất\r\ninner_cv = KFold(n_splits=5, shuffle=True, random_state=42)\r\nclf = GridSearchCV(estimator=RandomForestClassifier(), param_grid=p_grid, cv=inner_cv)\r\n\r\n# Outer CV: Dùng để đánh giá mô hình đã được tối ưu tham số\r\nouter_cv = KFold(n_splits=5, shuffle=True, random_state=42)\r\n\r\n# Chạy Nested CV\r\nnested_score = cross_val_score(clf, X[:1000], y[:1000], cv=outer_cv)\r\n\r\nprint(f"Nested CV Accuracy: {nested_score.mean():.4f}")\r\nprint("Đây là ước lượng trung thực về hiệu suất mô hình trên dữ liệu chưa thấy.")\r\n```\r\n\r\n# Tài liệu tham khảo\r\n\r\n1. Model Evaluation in Model Monitoring | Fiddler AI, truy cập vào tháng 12 27, 2025, https://www.fiddler.ai/ml-model-monitoring/model-evaluation-in-model-monitoring\r\n2. Why is Model Evaluation Important in Machine Learning? - Comet, truy cập vào tháng 12 27, 2025, https://www.comet.com/site/blog/why-is-model-evaluation-important-in-machine-learning/\r\n3. A Guide to MLOps Model Monitoring for Tracking ML Model Performance - EasyFlow.tech, truy cập vào tháng 12 27, 2025, https://easyflow.tech/mlops-model-monitoring/\r\n4. Automated Data Slicing for Model Validation: A Big data - AI Integration Approach - DSpace@MIT, truy cập vào tháng 12 27, 2025, https://dspace.mit.edu/bitstream/handle/1721.1/132271/1807.06068.pdf?sequence=2&isAllowed=y\r\n5. What is Bias-Variance Tradeoff? - IBM, truy cập vào tháng 12 27, 2025, https://www.ibm.com/think/topics/bias-variance-tradeoff\r\n6. Generalization Error & Bias/Variance Tradeoff — Data Mining (BAS 474), truy cập vào tháng 12 27, 2025, https://datalab.utk.edu/bas474/chapters/Generalization.html\r\n7. Bias–Variance Tradeoff in Machine Learning: Concepts & Tutorials – BMC Software | Blogs, truy cập vào tháng 12 27, 2025, https://www.bmc.com/blogs/bias-variance-machine-learning/\r\n8. Bias-variance trade-off and model evaluation - Data Science Stack Exchange, truy cập vào tháng 12 27, 2025, https://datascience.stackexchange.com/questions/110026/bias-variance-trade-off-and-model-evaluation\r\n	29	2026-03-02 03:54:49.577781	2026-03-11 07:23:21.82312	https://minio.dutai.site/dut-ai-manager-prod/blogs/async-d3ce957b4c634d14a535b91bb9d77f49-Gemini_Generated_Image_8w36iz8w36iz8w36.png	\N	Bạn có biết rằng 'trái tim' tạo nên sự thành công của một hệ thống học máy không nằm ở những thuật toán hào nhoáng, mà chính là một chiến lược kiểm định khắt khe? Hãy cùng bài viết này đào sâu vào các phương pháp đánh giá Offline cốt lõi – tấm khiên quản trị rủi ro bắt buộc phải có để đảm bảo mô hình của bạn không trở thành 'bom xịt' khi bước ra thế giới thực!	chien-luoc-danh-gia-mo-hinh-3
\.


--
-- Data for Name: introductions; Type: TABLE DATA; Schema: public; Owner: dutai
--

COPY public.introductions (id, content) FROM stdin;
1	# Giới thiệu về DUT AI\r\n\r\n**DUT AI** là Câu lạc bộ Trí tuệ Nhân tạo trực thuộc **Trường Đại học Bách khoa - Đại học Đà Nẵng (DUT)**. Chúng mình là nơi hội tụ của những tâm hồn đam mê công nghệ, cùng nhau khám phá và chinh phục thế giới trí tuệ nhân tạo đầy tiềm năng.\r\n\r\n## 🎯 Tầm nhìn & Sứ mệnh\r\nChúng mình tin rằng AI không chỉ là công cụ, mà là chìa khóa để giải quyết các vấn đề thực tiễn của xã hội.\r\n* **Kết nối:** Tạo môi trường giao lưu cho sinh viên yêu thích AI/ML/Data Science.\r\n* **Phát triển:** Hỗ trợ thành viên nghiên cứu các dự án thực tế và tham gia các cuộc thi công nghệ lớn.\r\n* **Chia sẻ:** Lan tỏa kiến thức AI thông qua các buổi Workshop và Blog chuyên sâu.\r\n\r\n## 🚀 Các hoạt động chính\r\n1.  **Nghiên cứu dự án:** Triển khai các project như *xxx* (App học tiếng Anh cho sinh viên & người đi làm), *yyy* (App), và các hệ thống AI ứng dụng.\r\n2.  **Đào tạo nội bộ:** Tổ chức các khóa học từ cơ bản đến nâng cao về Python, Deep Learning, và Computer Vision.\r\n3.  **Workshop & Event:** Tổ chức các buổi talkshow cùng chuyên gia và các cuộc thi Hackathon.\r\n\r\n## 🤝 Tại sao nên đồng hành cùng DUT AI?\r\nDù bạn là một "newbie" mới bắt đầu hay một "expert" dày dặn kinh nghiệm, DUT AI luôn có không gian để bạn tỏa sáng. Chúng mình đề cao giá trị **Integrity** và tinh thần **Dreams Never Need Half Hearts**.\r\n\r\n---\r\n*Cùng nhau, chúng ta kiến tạo tương lai với AI!*
\.


--
-- Data for Name: keywords; Type: TABLE DATA; Schema: public; Owner: dutai
--

COPY public.keywords (id, keyword_name, number_blog_contain) FROM stdin;
2	AI	0
3	Deep Learning	0
4	Model Validation	1
5	Data Science	1
6	Model Testing	1
7	Concurrency	1
8	Parallelism	1
9	Multiprocessing	1
10	multithreading	1
11	asynchronous	1
12	Coroutines	1
13	Event Loop	1
14	Trực quan hóa dữ liệu	1
15	Data Visualization	1
16	Mathplotlib	1
17	Chart	1
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: dutai
--

COPY public.posts (id, title, description, img_urls, hashtag, created_at, updated_at, summary, events_date, facebook_url) FROM stdin;
3	Team Speakee Đạt Giải “Công Nghệ Tiềm Năng” Tại Grab The Beyond – Dấu Ấn Tự Hào Của DUT AI CLUB	Grab The Beyond là cuộc thi công nghệ dành cho các đội thi sáng tạo, tập trung vào việc phát triển những giải pháp có tính ứng dụng thực tiễn và tiềm năng phát triển trong tương lai.\r\n\r\nTại sân chơi này, Team Speakee đã xuất sắc đạt giải “Công Nghệ Tiềm Năng”, ghi dấu ấn với một sản phẩm ứng dụng AI trong hỗ trợ luyện nói tiếng Anh.\r\n\r\nSpeakee là nền tảng giúp người học cải thiện kỹ năng speaking thông qua công nghệ nhận diện giọng nói và AI phản hồi theo thời gian thực. Ứng dụng cung cấp chấm điểm phát âm, góp ý ngữ pháp, gợi ý từ vựng và mô phỏng tình huống giao tiếp, giúp người dùng luyện tập chủ động mọi lúc, mọi nơi.\r\n\r\nGiải thưởng là sự ghi nhận cho tính sáng tạo, khả năng ứng dụng công nghệ và tiềm năng phát triển lâu dài của Speakee trong lĩnh vực EdTech. 🚀	{https://minio.dutai.site/dut-ai-manager-prod/posts/async-b2b9c02350874124bf4cc791d02c28e0-IMG_7460.JPG,https://minio.dutai.site/dut-ai-manager-prod/posts/async-b82f89ec24a442be89a67d96344ddae1-IMG_7454.JPG,https://minio.dutai.site/dut-ai-manager-prod/posts/async-40e9e59f9c65450997c4cce935850ea5-IMG_7448.JPG,"https://minio.dutai.site/dut-ai-manager-prod/posts/async-bfc581539f5144808790286bf5d6b4bf-IMG_7439 2.JPG",https://minio.dutai.site/dut-ai-manager-prod/posts/async-9f39b6c4cd7a4f2f9b6b85ab80c859e8-BC.NHAN-6001.JPEG}	\N	2026-03-01 09:37:37.54147	2026-03-01 09:37:37.541473	Team Speakee chính thức đạt giải “Công Nghệ Tiềm Năng” tại cuộc thi Grab The Beyond, đánh dấu một cột mốc quan trọng trong hành trình phát triển sản phẩm và khẳng định năng lực công nghệ của sinh viên DUT AI CLUB.	\N	https://www.facebook.com/share/p/1GZgjEHKQ4/
1	YEP 2025 – Khởi Đầu Thế Hệ AI Tiên Phong | Khóa Tuyển Đầu Tiên Của DUT AI CLUB	YEP 2025 của DUT AI CLUB không diễn ra trong phòng họp hay trên những slide tổng kết, mà bắt đầu bằng khói bếp, lá dong xanh và những đôi tay còn vụng về khi lần đầu gói bánh.\r\n\r\nGiữa nhịp sống bận rộn với deadline dự án, training và thi đấu, các thành viên đã có một ngày cùng nhau ngồi lại, chia nhóm vo nếp, rửa lá, gói bánh và canh bếp lửa suốt nhiều giờ liền. Không còn khoảng cách giữa các ban, không còn là senior hay newbie — chỉ còn những người bạn chung một mái nhà DUT AI CLUB.\r\n\r\nTiếng cười vang lên khi chiếc bánh đầu tiên bị “méo nhẹ”. Những câu chuyện được kể bên bếp lửa, từ hành trình vào CLB đến những dự định năm mới. Khoảnh khắc đó, YEP không chỉ là Year End Party — mà là sự kết nối, là kỷ niệm, là tinh thần đồng đội được thắp sáng.	{https://minio.dutai.site/dut-ai-manager-prod/posts/async-053a21c4883c4405aa75bf7f46ef443d-IMG_8752.JPG,https://minio.dutai.site/dut-ai-manager-prod/posts/async-e50595f84a1f492ea6747e433535c82a-IMG_8769.JPG,https://minio.dutai.site/dut-ai-manager-prod/posts/async-eeafba34fc26452f8635423f9a5a60db-IMG_8681.JPG,https://minio.dutai.site/dut-ai-manager-prod/posts/async-d816d93a50d3417ab2c7b276f040b5db-20260208_182636.JPG,https://minio.dutai.site/dut-ai-manager-prod/posts/async-9c61c066c5034d728e3cdd386816766c-277ee06f2abeef2bf5b4dc19ce50f07f.JPEG,https://minio.dutai.site/dut-ai-manager-prod/posts/async-9987159ba1124bf29511cf279073e732-df8664d53b13e4e2db4a2132ee754145.JPEG,https://minio.dutai.site/dut-ai-manager-prod/posts/async-3e9e27d290204ef691896ecbfc2a9c85-e3a058005c7124068d5d131608637dba.JPEG,https://minio.dutai.site/dut-ai-manager-prod/posts/async-68e4226d961b421ebeebca0506ed1a2f-c2c840feed2a9d1695cebadeba43a08d.JPEG,https://minio.dutai.site/dut-ai-manager-prod/posts/async-3206d195c0574bfb9bb65539dcdc6230-28cd5b83f2d03aa45c60309a67fdf63f.JPEG}	None	2026-03-01 09:09:04.11168	2026-03-06 19:07:44.182885	YEP 2025 đánh dấu cột mốc quan trọng khi DUT AI CLUB chính thức mở khóa tuyển đầu tiên trong năm, chào đón những thành viên trẻ đam mê công nghệ, sáng tạo và sẵn sàng bứt phá trong lĩnh vực Trí tuệ nhân tạo.	\N	https://www.facebook.com/share/r/189AfHjT8w/
2	19/11 – Khi DUT AI CLUB Gửi Lời Cảm Ơn Đến Những Chàng Trai Thầm Lặng	Trong mỗi dự án chạy deadline đến sát giờ, trong mỗi buổi training tối muộn, trong từng dòng code, từng thiết kế, từng kế hoạch truyền thông… luôn có sự hiện diện của những chàng trai kiên nhẫn, trách nhiệm và âm thầm gánh vác.\r\n\r\n19/11 là dịp để cả CLB cùng nhau gửi một lời chúc, một món quà nhỏ, hay đơn giản chỉ là một tràng vỗ tay thật lớn dành cho các bạn nam đã và đang đồng hành cùng DUT AI CLUB. Không chỉ là đồng đội trong công việc, họ còn là những người bạn luôn sẵn sàng hỗ trợ, chia sẻ và giữ tinh thần tích cực cho cả team. Vì đôi khi, điều một người cần không phải là spotlight — mà là sự ghi nhận.\r\n\r\nNgày 19/11 khép lại bằng những tiếng cười và những lời chúc giản dị, nhưng đủ để nhắc rằng: DUT AI CLUB không chỉ xây dựng công nghệ, mà còn xây dựng sự tôn trọng và trân trọng lẫn nhau.	{https://minio.dutai.site/dut-ai-manager-prod/posts/async-5131a481de02441da43a5a588e2264c4-IMG_6406.jpg,https://minio.dutai.site/dut-ai-manager-prod/posts/async-d0516ee7477a4861a7cc500e2c7a3788-IMG_6510.JPG,https://minio.dutai.site/dut-ai-manager-prod/posts/async-9dd100776869476e825ff78f18da8e9d-IMG_6509.JPG,https://minio.dutai.site/dut-ai-manager-prod/posts/async-334221e21c3145b88c650cdec2765851-IMG_6508.JPG,https://minio.dutai.site/dut-ai-manager-prod/posts/async-f63be221158c4613a224f895436c757d-IMG_6503.JPG}	None	2026-03-01 09:31:28.799391	2026-03-06 19:08:32.984516	Ngày 19/11 – Quốc tế Nam giới – tại DUT AI CLUB không phải là một buổi lễ quá lớn, mà là một dịp nhỏ nhưng đủ ấm để nhắc nhau rằng: sự cố gắng thầm lặng luôn xứng đáng được ghi nhận.	\N	https://www.facebook.com/share/p/18FHd8W5m7/
\.


--
-- Data for Name: project_members; Type: TABLE DATA; Schema: public; Owner: dutai
--

COPY public.project_members (id, project_id, user_id, role) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: dutai
--

COPY public.projects (id, title, description, image_url, features, technologies, demo_url, video_url) FROM stdin;
3	Hệ thống quản lý nội bộ	mô tả về hệ thống	https://minio.dutai.site/dut-ai-manager-prod/projects/20260214_144919_vai-tro-va-cach-quan-ly-he-thong-mang-noi-bo-2.jpg	\N	\N	\N	\N
4	Speakee	mô tả về speakee 	https://minio.dutai.site/dut-ai-manager-prod/projects/20260214_145024_images (3).jpeg	\N	\N	\N	\N
5	Hệ thống checkin	mô tả về hệ thống checkin	https://minio.dutai.site/dut-ai-manager-prod/projects/20260214_145209_vai-tro-va-cach-quan-ly-he-thong-mang-noi-bo-2.jpg	\N	\N	\N	\N
6	Website câu lạc bộ	Mô tả về website câu lạc bộ	https://minio.dutai.site/dut-ai-manager-prod/projects/20260214_145341_10.jpg	\N	\N	\N	\N
7	App cứu hộ	Ứng dụng hỗ trợ người dùng trong các tình huống khẩn cấp như bão, lũ lụt, sạt lở hoặc động đất. Chỉ với vài thao tác, người dùng có thể gửi tín hiệu cầu cứu và chia sẻ vị trí để được hỗ trợ nhanh nhất. Ứng dụng giúp kết nối với lực lượng cứu hộ, cập nhật thông tin cảnh báo và đảm bảo hỗ trợ kịp thời, an toàn trong thiên tai.	https://phunuvietnam.mediacdn.vn/media/news/1862d19958c52ad5235ecba486902a0f/giup-dan-khac-phuc-bao.jpg	\N	\N	\N	\N
\.


--
-- Data for Name: public_events; Type: TABLE DATA; Schema: public; Owner: dutai
--

COPY public.public_events (id, title, description, img_url, events_date, location, register_link, created_at, updated_at, summary, facebook_url, tags) FROM stdin;
1	𝐅𝐔𝐓𝐔𝐑𝐄 𝐌𝐄𝐃𝐈𝐀 𝐋𝐄𝐀𝐃𝐄𝐑𝐒 𝟐𝟎𝟐𝟓 𝐜𝐮̀𝐧𝐠 𝐃𝐔𝐓 𝐀𝐈 𝐂𝐋𝐔𝐁 🌟 📣 𝐃𝐔𝐓 𝐀𝐈 𝐂𝐋𝐔𝐁 𝐓𝐔𝐘𝐄̂̉𝐍 𝐌𝐄𝐃𝐈𝐀 𝐓𝐄𝐀𝐌 	🔹 𝐐𝐮𝐲𝐞̂̀𝐧 𝐥𝐨̛̣𝐢:\r\n • Phát triển kỹ năng content, design, branding\r\n • Làm việc trong môi trường sáng tạo, kỷ luật\r\n • Trực tiếp tham gia và đồng hành trong các dự án công nghệ và AI, tham gia các cuộc thi AI thực chiến cùng team DUT AI!\r\n🔹 𝐍𝐡𝐢𝐞̣̂𝐦 𝐯𝐮̣:\r\n • Sản xuất nội dung fanpage (bài viết, ấn phẩm, dự án)\r\n • Thiết kế và đảm bảo hình ảnh truyền thông chuyên nghiệp\r\n • Phối hợp triển khai truyền thông cho sự kiện & cuộc thi\r\nỨng tuyển ngay hôm nay để trở thành một phần của Media Team DUT AI và bắt đầu hành trình trải nghiệm, học hỏi và phát triển.\r\n⏰ Hạn đóng form: 𝐓𝐡𝐮̛́ 𝟒 – 𝟎𝟒/𝟑/𝟐𝟎𝟐𝟔\r\n📩 Link đăng ký: \r\nhttps://forms.gle/1RyVdMGstK3wK3Ef9	https://minio.dutai.site/dut-ai-manager-prod/public_events/async-167a2cecf07f49049eb485895a60913c-Quyền lợi team media.png	2026-03-04 12:00:00	\N	https://forms.gle/1RyVdMGstK3wK3Ef9	2026-03-01 10:36:12.507395	2026-03-01 10:36:12.507398	DUT AI CLUB chính thức tìm kiếm những mảnh ghép cho Ban Truyền thông – nơi cùng nhau xây dựng hình ảnh, kể câu chuyện và lan tỏa tinh thần của CLB.	https://www.facebook.com/share/p/1bUyvtcAA8/	{}
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: dutai
--

COPY public.users (id, name, email, phone_number, status, role_id, role_name, avatar_url, discord_id) FROM stdin;
27	Bùi Khắc Bình	khacbinh16604@gmail.com	0917438446	active	3	teammate	https://minio.dutai.site/dut-ai-manager-prod/avatars/27_20260124_174400.jpg	694819278473658459
16	Biện Cao Cường	puppy261205@gmail.com	0353975769	active	2	leader	https://minio.dutai.site/dut-ai-manager-prod/avatars/16_20260124_163625.png	1184123351325745152
10	Quế Đình Anh Tú	quedinhanhtu@gmail.com	0346747117	active	3	teammate	https://minio.dutai.site/dut-ai-manager-prod/avatars/10_20260124_174038.jpg	751016211936182333
12	Lương Duy Toàn	luongduytoan2006@gmail.com	0905669785	active	3	teammate	https://minio.dutai.site/dut-ai-manager-prod/avatars/12_20260124_175854.jpg	752363594842374204
20	Đàm Phú Quý	phuquydam06@gmail.com	0356780244	active	3	teammate	https://minio.dutai.site/dut-ai-manager-prod/avatars/20_20260124_174317.png	896247187405684746
31	Nguyễn Đỗ Khánh Linh 	nguyenlinh33662222@gmail.com	0865371670	active	3	teammate	\N	\N
25	Lê Quang Thái	lequangthai1709@gmail.com	0343301709	active	3	teammate	https://minio.dutai.site/dut-ai-manager-prod/avatars/25_20260124_174401.jpg	764761696874528783
3	Phạm Thị Thảo Nguyên	thaonguyenhead@gmail.com	0949362209	active	1	admin	https://minio.dutai.site/dut-ai-manager-prod/avatars/3_20260227_170458.png	853144471121952769
24	Võ Ngọc Huy	ngochuy603vn@gmail.com	0388718807	active	3	teammate	\N	\N
28	Nguyễn Văn Chương	nguyenvanchuongwind@gmail.com	0384196174	active	3	teammate	\N	848928928781303859
21	Lê Xuân Hòa	custina0987123@gmail.com	0828908271	active	2	leader	\N	1083295777612370001
26	Nguyễn Văn Lộc	nloc02052005@gmail.com	0913409579	active	3	teammate	\N	754160443211251874
22	Trương Thị Ngọc Huyền	ngochuyen237.vn@gmail.com	0935516370	active	3	teammate	\N	1287765694707929132
18	Trà Quốc Nguyên	traquocnguyen090506@gmail.com	0788541026	active	3	teammate	https://minio.dutai.site/dut-ai-manager-prod/avatars/18_20260124_174525.jpg	1285606402802450545
17	Trần Thị Tuyết Trinh	trinhtran180206@gmail.com	0866472034	active	3	teammate	\N	1434211133069459537
29	Hệ thống	huynhphuocnguyen2412@gmail.com	0931960822	active	1	admin	\N	\N
15	Trần Hữu Dũng	dngdth123@gmail.com	0867347321	active	2	leader	\N	1408102915050307874
8	Nguyễn Thành Danh 	danhn8880@gmail.com	0962559015	active	3	teammate	\N	1227610699149082749
7	Nguyễn Hữu Rin 	nhr1410x@gmail.com	0333525460	active	3	teammate	https://minio.dutai.site/dut-ai-manager-prod/avatars/7_20260124_174511.jpg	1203979258242793554
30	Hệ thống checkin	hethongcheckin@gmail.com	0931960822	active	4	He thong checkin	\N	\N
6	Châu Thanh Nam Trung	chauthanhnamtrung310@gmail.com	0329602195	inactive	3	teammate	\N	\N
2	Vương Ngọc Hậu	vuongngochau2004@gmail.com	0393453221	active	1	admin	\N	761073402571784212
1	Huỳnh Phước Nguyên	huynhphuocnguyen.dev@gmail.com	0931960822	active	1	admin	https://minio.dutai.site/dut-ai-manager-prod/avatars/1_20260124_091109.jpg	363660101631868929
23	Nguyễn Quang Bình 	nqbinh1702@gmail.com	0787546469	active	3	teammate	\N	722732855842832496
13	Trương Bùi Diễn	dientruong2104@gmail.com	0359377430	active	3	teammate	https://minio.dutai.site/dut-ai-manager-prod/avatars/13_20260124_174637.jpeg	871957484368171018
32	Phan Vũ Long	caibutbi2.0@gmail.com	0357359206	active	3	teammate	https://minio.dutai.site/dut-ai-manager-prod/avatars/32_20260211_170629.png	1039063385712627712
9	Nguyễn Hoàng Minh	nguyenhoangminh782005@gmail.com	0919025448	active	3	teammate	\N	791564058767261707
5	Trương Minh Hiển 	hienminh1332004@gmail.com	0965119610	active	2	leader	\N	843737225737011260
19	Phan Tấn Sơn	sonphantan410106@gmail.com	0905514206	active	3	teammate	https://minio.dutai.site/dut-ai-manager-prod/avatars/19_20260124_174446.jpg	1435563728740286574
14	Trần Thị Hoài Như	nhutranthihoai35@gmail.com	0901974609	active	3	teammate	https://minio.dutai.site/dut-ai-manager-prod/avatars/14_20260124_165423.jpg	907981831406759947
4	Ngô Văn Đắc Trí	dactri641@gmail.com	0896678463	active	3	teammate	https://minio.dutai.site/dut-ai-manager-prod/avatars/4_20260124_161828.jpg	871186671838826497
11	Hoàng Nguyễn Tài Danh	meowmeow01aa@gmail.com	0384228128	active	3	teammate	https://minio.dutai.site/dut-ai-manager-prod/avatars/11_20260124_174836.jpg	828177194030596146
\.


--
-- Name: blogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dutai
--

SELECT pg_catalog.setval('public.blogs_id_seq', 5, true);


--
-- Name: introductions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dutai
--

SELECT pg_catalog.setval('public.introductions_id_seq', 1, true);


--
-- Name: keywords_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dutai
--

SELECT pg_catalog.setval('public.keywords_id_seq', 17, true);


--
-- Name: memorable_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dutai
--

SELECT pg_catalog.setval('public.memorable_events_id_seq', 3, true);


--
-- Name: project_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dutai
--

SELECT pg_catalog.setval('public.project_members_id_seq', 1, false);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dutai
--

SELECT pg_catalog.setval('public.projects_id_seq', 7, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dutai
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: workshops_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dutai
--

SELECT pg_catalog.setval('public.workshops_id_seq', 1, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: blog_authors blog_authors_pkey; Type: CONSTRAINT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.blog_authors
    ADD CONSTRAINT blog_authors_pkey PRIMARY KEY (blog_id, user_id);


--
-- Name: blog_keywords blog_keywords_pkey; Type: CONSTRAINT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.blog_keywords
    ADD CONSTRAINT blog_keywords_pkey PRIMARY KEY (blog_id, keyword_id);


--
-- Name: blogs blogs_pkey; Type: CONSTRAINT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_pkey PRIMARY KEY (id);


--
-- Name: introductions introductions_pkey; Type: CONSTRAINT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.introductions
    ADD CONSTRAINT introductions_pkey PRIMARY KEY (id);


--
-- Name: keywords keywords_pkey; Type: CONSTRAINT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.keywords
    ADD CONSTRAINT keywords_pkey PRIMARY KEY (id);


--
-- Name: posts memorable_events_pkey; Type: CONSTRAINT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT memorable_events_pkey PRIMARY KEY (id);


--
-- Name: project_members project_members_pkey; Type: CONSTRAINT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.project_members
    ADD CONSTRAINT project_members_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: public_events workshops_pkey; Type: CONSTRAINT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.public_events
    ADD CONSTRAINT workshops_pkey PRIMARY KEY (id);


--
-- Name: ix_blogs_id; Type: INDEX; Schema: public; Owner: dutai
--

CREATE INDEX ix_blogs_id ON public.blogs USING btree (id);


--
-- Name: ix_blogs_search_vector; Type: INDEX; Schema: public; Owner: dutai
--

CREATE INDEX ix_blogs_search_vector ON public.blogs USING gin (search_vector);


--
-- Name: ix_blogs_slug; Type: INDEX; Schema: public; Owner: dutai
--

CREATE UNIQUE INDEX ix_blogs_slug ON public.blogs USING btree (slug);


--
-- Name: ix_keywords_id; Type: INDEX; Schema: public; Owner: dutai
--

CREATE INDEX ix_keywords_id ON public.keywords USING btree (id);


--
-- Name: ix_keywords_keyword_name; Type: INDEX; Schema: public; Owner: dutai
--

CREATE UNIQUE INDEX ix_keywords_keyword_name ON public.keywords USING btree (keyword_name);


--
-- Name: ix_posts_id; Type: INDEX; Schema: public; Owner: dutai
--

CREATE INDEX ix_posts_id ON public.posts USING btree (id);


--
-- Name: ix_public_events_id; Type: INDEX; Schema: public; Owner: dutai
--

CREATE INDEX ix_public_events_id ON public.public_events USING btree (id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: dutai
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: dutai
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ix_users_name; Type: INDEX; Schema: public; Owner: dutai
--

CREATE INDEX ix_users_name ON public.users USING btree (name);


--
-- Name: blog_authors blog_authors_blog_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.blog_authors
    ADD CONSTRAINT blog_authors_blog_id_fkey FOREIGN KEY (blog_id) REFERENCES public.blogs(id);


--
-- Name: blog_authors blog_authors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.blog_authors
    ADD CONSTRAINT blog_authors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: blog_keywords blog_keywords_blog_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.blog_keywords
    ADD CONSTRAINT blog_keywords_blog_id_fkey FOREIGN KEY (blog_id) REFERENCES public.blogs(id);


--
-- Name: blog_keywords blog_keywords_keyword_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.blog_keywords
    ADD CONSTRAINT blog_keywords_keyword_id_fkey FOREIGN KEY (keyword_id) REFERENCES public.keywords(id);


--
-- Name: project_members project_members_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.project_members
    ADD CONSTRAINT project_members_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id);


--
-- Name: project_members project_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dutai
--

ALTER TABLE ONLY public.project_members
    ADD CONSTRAINT project_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict msMI75Tg5DnsCfdOzp3KsxF6fHltACSFzCcHHe5TOCPALiAdfp6YKcBHslfKrfi

