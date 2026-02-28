"""Script tạo dữ liệu mẫu để test."""

from app.core.database import engine, Base, SessionLocal
from app.v1.projects.models import Project
from app.v1.events.models import Event
from app.v1.blogs.models import Blog
from datetime import datetime, timedelta

def seed():
    db = SessionLocal()
    try:
        # ── Projects ──
        projects = [
            Project(
                title="AI Camera - Hệ thống giám sát thông minh",
                description="Ứng dụng AI nhận diện khuôn mặt, phát hiện đối tượng trong thời gian thực sử dụng YOLO và DeepSORT.",
                product_link="https://github.com/DUT-AI/ai-camera",
                image_url="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600",
                project_url="https://dutai.site/projects/ai-camera",
            ),
            Project(
                title="Chatbot DUT - Trợ lý ảo sinh viên",
                description="Chatbot hỗ trợ sinh viên tra cứu thông tin học tập, lịch thi, điểm số sử dụng LLM và RAG.",
                product_link="https://github.com/DUT-AI/chatbot-dut",
                image_url="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600",
                project_url="https://dutai.site/projects/chatbot",
            ),
            Project(
                title="Smart Parking - Bãi đỗ xe thông minh",
                description="Hệ thống nhận diện biển số xe tự động, quản lý chỗ đỗ xe bằng Computer Vision.",
                product_link="https://github.com/DUT-AI/smart-parking",
                image_url="https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=600",
                project_url="https://dutai.site/projects/smart-parking",
            ),
            Project(
                title="Document OCR - Số hóa tài liệu",
                description="Công cụ OCR trích xuất văn bản từ ảnh tài liệu, hóa đơn, biên lai sử dụng PaddleOCR.",
                product_link="https://github.com/DUT-AI/document-ocr",
                image_url="https://images.unsplash.com/photo-1568702846914-96b305d2uj08?w=600",
            ),
            Project(
                title="Emotion Detection - Nhận diện cảm xúc",
                description="Mô hình Deep Learning phân tích cảm xúc khuôn mặt trong video realtime.",
                product_link="https://github.com/DUT-AI/emotion-detection",
                image_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
            ),
            Project(
                title="DUT AI Website",
                description="Website chính thức của CLB DUT-AI, được xây dựng bằng Next.js và FastAPI.",
                product_link="https://github.com/DUT-AI/dut-ai-web",
                image_url="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
                project_url="https://dutai.site",
            ),
        ]

        # ── Events ──
        now = datetime.utcnow()
        events = [
            Event(
                title="Workshop: Giới thiệu về Large Language Models",
                description="Buổi workshop giới thiệu về LLM, cách sử dụng GPT API, và xây dựng ứng dụng AI với Langchain. Phù hợp cho sinh viên mới bắt đầu.",
                location="Phòng F205, ĐH Bách Khoa Đà Nẵng",
                event_date=now + timedelta(days=7),
                image_url="https://images.unsplash.com/photo-1591453089816-0fbb971b2f8d?w=600",
            ),
            Event(
                title="Hackathon AI 2026 - DUT Edition",
                description="Cuộc thi hackathon 48 giờ với chủ đề AI for Education. Giải thưởng lên tới 10 triệu đồng. Đăng ký theo nhóm 3-5 người.",
                location="Hội trường lớn, ĐH Bách Khoa Đà Nẵng",
                event_date=now + timedelta(days=30),
                image_url="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600",
            ),
            Event(
                title="Seminar: Computer Vision trong thực tế",
                description="Chia sẻ từ anh Nguyễn Văn A - AI Engineer tại VinAI về ứng dụng Computer Vision trong sản xuất công nghiệp.",
                location="Phòng A101, ĐH Bách Khoa Đà Nẵng",
                event_date=now - timedelta(days=5),
                image_url="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600",
            ),
            Event(
                title="Training: Git & GitHub cho dự án AI",
                description="Buổi training cơ bản về Git workflow, branching strategy, và CI/CD cho các dự án Machine Learning.",
                location="Lab AI, Tầng 3 Nhà F",
                event_date=now - timedelta(days=15),
                image_url="https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=600",
            ),
            Event(
                title="Demo Day - Showcase dự án CLB",
                description="Buổi trình bày kết quả các dự án CLB trong học kỳ. Mời các thầy cô và doanh nghiệp tham dự đánh giá.",
                location="Phòng hội thảo F301",
                event_date=now + timedelta(days=60),
                image_url="https://images.unsplash.com/photo-1540575467063-178a50c6a789?w=600",
            ),
        ]

        # ── Blogs ──
        blogs = [
            Blog(
                title="Hướng dẫn Fine-tuning LLM với LoRA",
                content="## Giới thiệu\n\nFine-tuning LLM là một kỹ thuật quan trọng giúp tùy chỉnh mô hình ngôn ngữ lớn cho tác vụ cụ thể. Trong bài viết này, chúng ta sẽ tìm hiểu về LoRA (Low-Rank Adaptation) - phương pháp fine-tuning hiệu quả.\n\n## LoRA là gì?\n\nLoRA cho phép fine-tune mô hình lớn mà chỉ cần cập nhật một số lượng nhỏ tham số, giảm đáng kể chi phí tính toán...",
                authors="Nguyễn Văn An",
                views=156,
                keywords="LLM,Fine-tuning,LoRA,AI",
                created_at=now - timedelta(days=2),
                updated_at=now - timedelta(days=1),
            ),
            Blog(
                title="So sánh YOLOv8 vs YOLOv9: Nên chọn model nào?",
                content="## Tổng quan\n\nYOLO là family model phổ biến nhất cho bài toán Object Detection. Bài viết so sánh chi tiết giữa YOLOv8 và YOLOv9 về accuracy, speed, và use cases.\n\n## Benchmark\n\n| Model | mAP@50 | FPS | Params |\n|-------|--------|-----|--------|\n| YOLOv8s | 44.9 | 280 | 11.2M |\n| YOLOv9s | 46.8 | 250 | 7.2M |",
                authors="Trần Minh Khoa",
                views=89,
                keywords="YOLO,Object Detection,Computer Vision",
                created_at=now - timedelta(days=5),
                updated_at=now - timedelta(days=5),
            ),
            Blog(
                title="Xây dựng RAG Pipeline với Langchain và Qdrant",
                content="## RAG là gì?\n\nRetrieval-Augmented Generation (RAG) kết hợp khả năng tìm kiếm thông tin với sinh văn bản của LLM. Bài viết hướng dẫn xây dựng RAG pipeline hoàn chỉnh.\n\n## Kiến trúc\n\n1. Document Loader → Text Splitter → Embedding → Vector Store\n2. Query → Retriever → LLM → Response",
                authors="Lê Thị Hương",
                views=234,
                keywords="RAG,Langchain,Qdrant,Vector Database",
                created_at=now - timedelta(days=10),
                updated_at=now - timedelta(days=8),
            ),
            Blog(
                title="Deploy ML Model lên production với FastAPI + Docker",
                content="## Mở đầu\n\nViệc deploy ML model lên production là bước quan trọng nhưng thường bị bỏ qua trong quá trình học. Bài viết này sẽ hướng dẫn từ A-Z.\n\n## Tech Stack\n\n- FastAPI: Web framework\n- Docker: Containerization\n- Nginx: Reverse proxy\n- GitHub Actions: CI/CD",
                authors="Phạm Đức Anh",
                views=312,
                keywords="FastAPI,Docker,MLOps,Deployment",
                created_at=now - timedelta(days=15),
                updated_at=now - timedelta(days=14),
            ),
            Blog(
                title="Tổng hợp tài liệu học AI cho sinh viên",
                content="## Lộ trình học AI\n\n### 1. Nền tảng\n- Linear Algebra: 3Blue1Brown\n- Probability: Khan Academy\n- Python: CS50P\n\n### 2. Machine Learning\n- Andrew Ng's Machine Learning (Coursera)\n- Hands-On ML with Scikit-Learn\n\n### 3. Deep Learning\n- Fast.ai\n- Deep Learning Specialization",
                authors="CLB DUT-AI",
                views=567,
                keywords="AI,Learning,Resources,Roadmap",
                created_at=now - timedelta(days=20),
                updated_at=now - timedelta(days=18),
            ),
        ]

        db.add_all(projects + events + blogs)
        db.commit()
        print(f"✅ Đã tạo {len(projects)} projects, {len(events)} events, {len(blogs)} blogs!")

    finally:
        db.close()

if __name__ == "__main__":
    seed()
