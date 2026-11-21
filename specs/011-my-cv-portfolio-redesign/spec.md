# Feature Specification: My-CV Portfolio Redesign & Interactive Adaptation

**Feature Branch**: `011-my-cv-portfolio-redesign`

**Created**: 2026-11-21

**Status**: Ready for Planning

**Input**: User description: "Chuyển đổi giao diện Member Portfolio (/members/[username]) sang phong cách thiết kế, bố cục và hiệu ứng của template my-cv; giữ màu sắc accent là xanh dương thương hiệu DUT-AI (#2563eb); hiển thị dữ liệu động từ Database (Bio, Skills, Projects, CV); tích hợp GitHub Contribution Calendar (Days I Code) và hiệu ứng Particles sao rơi nền; Cung cấp hệ thống Tab điều hướng giống my-cv (Home, About, Projects, Resume) với thanh Navbar glassmorphism; hỗ trợ cài đặt và sử dụng thêm các thư viện UI component cần thiết."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Portfolio Tab Navigation & "My-CV" Navbar (Priority: P1) 🎯 MVP

As a visitor exploring a member's portfolio at `/members/[username]`, I want a dedicated glassmorphism navigation bar with tabs (**Home**, **About**, **Projects**, **Resume**), so that I can switch seamlessly between different aspects of the member's profile exactly like the original `my-cv` application.

**Why this priority**: Directly implements the user's explicit requirement for tab navigation matching `my-cv`, structuring the entire member showcase into focused views.

**Independent Test**: Navigate to `/members/[username]` and click through each tab (**Home**, **About**, **Projects**, **Resume**) or pass `?tab=...` / hash `#...` to confirm instant view switching with smooth transitions and active tab indicators.

**Acceptance Scenarios**:

1. **Given** a visitor viewing `/members/[username]`, **When** the page loads, **Then** a sticky glassmorphic Navbar is displayed featuring the member's initials/brand logo, tabs (`Home`, `About`, `Projects`, `Resume`), and a quick action link back to the club.
2. **Given** a visitor clicking on the "About" tab, **When** selected, **Then** the view transitions to the member's biography, techstack/toolstack, and GitHub contribution calendar, while highlighting the "About" tab as active.
3. **Given** a visitor clicking on "Projects" or "Resume", **When** selected, **Then** the corresponding view renders smoothly with full state preservation.
4. **Given** a mobile viewport, **When** tapping the mobile menu toggle, **Then** the tab drawer slides open with tap targets for each tab.

---

### User Story 2 - Immersive "My-CV" Hero & Visual Atmosphere (Priority: P2)

As a visitor on the "Home" tab, I want to experience the immersive visual aesthetic of the `my-cv` template featuring interactive background particles, an animated role typewriter, a greeting banner with brand accents, and a tiltable avatar card, so that each member's personal brand is striking and memorable.

**Why this priority**: Delivers the signature visual identity and atmosphere requested by the user.

**Independent Test**: View the "Home" tab and verify that the particle starry background animates smoothly, the typewriter rotates between the member's headline/roles, social icon links respond to hover, and the overall color scheme uses the dark cosmos palette accented with DUT-AI Blue (`#2563eb`).

**Acceptance Scenarios**:

1. **Given** an active member portfolio on the "Home" tab, **When** viewed, **Then** the section presents animated starry particles, a "Hi There! 👋" heading with the member's name, dynamic typewriter text, and social icon buttons.
2. **Given** the page theme, **When** rendered, **Then** all highlights, button gradients, and focus states use the brand accent color `#2563eb` (DUT-AI Blue).
3. **Given** the introduction sub-section ("Let Me Introduce Myself"), **When** viewed, **Then** it renders the member's avatar with 3D tilt tracking, bio overview, and direct social channel buttons.

---

### User Story 3 - Dynamic "Know Who I Am" & Visual Techstack/Toolstack (Priority: P3)

As a visitor on the "About" tab, I want to view the member's comprehensive biography card and an icon grid of their technical skills and development tools, so that I can quickly assess their qualifications and technological stack in an intuitive visual format.

**Why this priority**: Connects the database-driven skill categories and bio fields directly into `my-cv`'s visual grid card layout.

**Independent Test**: Can be tested independently by updating skills and biography in the admin dashboard, then verifying that the "About" tab renders the skills as visual technology badges/icons inside responsive grid cards ("Professional Skillset" and "Tools I Use").

**Acceptance Scenarios**:

1. **Given** member profile data containing bio, quotes, and categorized skills in the database, **When** viewing the About tab, **Then** the page renders a structured biography card with quote highlights and two visual card grids: one for technical skills and one for development tools.
2. **Given** a member with custom skills stored in the database, **When** rendered, **Then** matching technology icons are displayed with hover glow effects utilizing the `#2563eb` accent.

---

### User Story 4 - Interactive GitHub Activity Calendar ("Days I Code") (Priority: P4)

As a visitor on the "About" tab, I want to inspect the member's real-time GitHub contribution graph, so that their open-source activity and coding consistency are transparently displayed.

**Why this priority**: Replicates a core signature element of `my-cv` that showcases technical credibility and activity for developers.

**Independent Test**: Can be tested by configuring a valid GitHub username on a member's profile and observing that the interactive contribution heat map renders with color intensities mapped to the DUT-AI Blue palette.

**Acceptance Scenarios**:

1. **Given** a member with a configured GitHub username, **When** visiting the About tab, **Then** the "Days I Code" section renders an interactive contribution calendar reflecting the member's real GitHub activity over the past year.
2. **Given** the GitHub calendar, **When** hovered over individual calendar blocks, **Then** tooltips display the exact date and contribution count.

---

### User Story 5 - Showcase Project Cards with Verified Club Attribution (Priority: P5)

As a visitor on the "Projects" tab, I want to explore showcased projects in card-style previews featuring thumbnails, summaries, tech tags, GitHub repository links, and live demo buttons, with official badges for club projects.

**Why this priority**: Unifies personal works with verified club projects into the aesthetic card grid defined by `my-cv`.

**Independent Test**: Can be verified by switching to the "Projects" tab, clicking GitHub and Live Demo links to confirm correct targets, and verifying that club projects display the official DUT-AI Club badge.

**Acceptance Scenarios**:

1. **Given** personal and club projects associated with the member, **When** viewing the "Projects" tab, **Then** projects are rendered as cards with image previews, project title, role subtitle, descriptive overview, tech tags, and external action buttons.
2. **Given** a club-affiliated project, **When** rendered, **Then** it features a distinctive "DUT AI Project" badge and the member's specific role title.

---

### User Story 6 - Integrated Resume & CV Preview / Download (Priority: P6)

As a visitor on the "Resume" tab, I want to view and download the member's official PDF CV directly on the page, so that I can easily retain and review their full resume.

**Why this priority**: Completes the portfolio journey by providing direct access to the member's verified resume asset.

**Independent Test**: Can be verified by switching to the "Resume" tab, downloading the PDF file, and verifying preview rendering.

**Acceptance Scenarios**:

1. **Given** an uploaded member CV PDF file, **When** viewing the "Resume" tab, **Then** top and bottom "Download CV" action buttons are prominently available.
2. **Given** an uploaded PDF CV, **When** viewing on desktop or mobile, **Then** an integrated document viewer or preview card is rendered cleanly alongside the file size indicator.

---

### Edge Cases

- **Missing Avatar or Project Thumbnails**: System must fall back to styled brand placeholders without broken image icons or cumulative layout shifts (CLS).
- **GitHub Username Not Provided or Non-Existent**: The "Days I Code" component must handle invalid handles or API rate limits defensively, falling back to a clean inactive state instead of a crashing error boundary.
- **Large PDF CV Files**: CV preview and download must be served with correct content-disposition and lazy loading.
- **Direct Tab Deep Linking**: Visiting `/members/[username]?tab=projects` or `/members/[username]#projects` must directly activate the requested tab.
- **SSR & React 19 Compatibility**: Interactive browser-dependent components (Particles, GitHub calendar, Typewriter, Tilt) must be client-isolated (`'use client'`) and defer window-dependent calls until after mounting to prevent React hydration mismatch errors.

## Functional Requirements

- **FR-001**: The system MUST provide a glassmorphic Tab Navigation Bar with tabs: `Home`, `About`, `Projects`, `Resume`.
- **FR-002**: The accent color across all interactive elements, icons, button gradients, and highlights MUST be `#2563eb` (DUT-AI Blue).
- **FR-003**: The Home tab MUST include an interactive canvas particle background, dynamic typewriter text, and 3D tilt avatar.
- **FR-004**: The About tab MUST present member biography, philosophical quote, and two visual icon grids ("Professional Skillset" and "Tools I use").
- **FR-005**: The system MUST support an interactive GitHub activity calendar reflecting real-time commit history when a GitHub profile URL or username is present.
- **FR-006**: The Projects tab MUST render both verified club projects and personal projects in cards with image thumbnails, descriptions, technology badges, GitHub buttons, and live demo links.
- **FR-007**: The Resume tab MUST provide dual download actions and preview capability for the member's uploaded PDF CV.
- **FR-008**: External UI packages may be integrated cleanly with React 19 compatibility.

## Success Criteria

- **SC-001 (Tab Navigation)**: 100% of tabs (`Home`, `About`, `Projects`, `Resume`) switch views instantly with URL deep-linking support (`?tab=...`).
- **SC-002 (Visual Alignment)**: 100% of the signature layout sections of `my-cv` are faithfully represented with `#2563eb` accent.
- **SC-003 (Data Dynamic Binding)**: 100% of member profile fields are dynamically populated from the PostgreSQL database.
- **SC-004 (Performance & Hydration)**: Zero React hydration mismatch warnings or script execution errors in browser console; LCP under 2.5s on desktop.
