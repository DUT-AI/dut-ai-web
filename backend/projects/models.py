from django.db import models
from wagtail.models import Page, Orderable
from modelcluster.fields import ParentalKey

# Import MultipleChooserPanel và FieldPanel
from wagtail.admin.panels import FieldPanel, MultipleChooserPanel

from wagtail.snippets.models import register_snippet
from wagtail.api import APIField
from wagtailmarkdown.fields import MarkdownField
from wagtail.search import index

# --- 1. TẠO KHO CHỨA THÀNH VIÊN (SNIPPET) ---
@register_snippet
class Member(index.Indexed, models.Model):
    full_name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, blank=True)
    
    # Cấu hình tìm kiếm
    search_fields = [
        index.SearchField('full_name', partial_match=True),
        index.SearchField('email', partial_match=True),
    ]

    def __str__(self):
        return self.full_name

    class Meta:
        verbose_name = "Thành viên"
        verbose_name_plural = "Danh sách thành viên"

# --- 2. BẢNG TRUNG GIAN (Bắt buộc cho MultipleChooserPanel) ---
class ProjectMember(Orderable):
    page = ParentalKey('projects.ProjectPage', related_name='project_members', on_delete=models.CASCADE)
    member = models.ForeignKey('projects.Member', on_delete=models.CASCADE, related_name='+')

    panels = [
        FieldPanel('member'),
    ]

# --- 3. MODEL DỰ ÁN ---
class ProjectPage(Page):
    description = MarkdownField(verbose_name="Mô tả dự án (Markdown)")
    product_link = models.URLField(blank=True, verbose_name="Link sản phẩm")
    
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        verbose_name="Hình ảnh đại diện"
    )

    # --- CẤU HÌNH ADMIN ---
    content_panels = Page.content_panels + [
        FieldPanel('description'),
        
        # SỬA LẠI ĐOẠN NÀY: Bỏ hết các tham số thừa, chỉ giữ lại cái cần thiết
        MultipleChooserPanel(
            'project_members',
            chooser_field_name="member",
            label="Chọn thành viên tham gia",
        ),
        
        FieldPanel('product_link'),
        FieldPanel('image'),
    ]

    # --- API ---
    def image_url(self):
        if self.image:
            return self.get_site().root_url + self.image.file.url
        return None

    def member_names(self):
        # Lặp qua bảng trung gian để lấy tên
        return [pm.member.full_name for pm in self.project_members.all()]

    api_fields = [
        APIField('description'),
        APIField('member_names'),
        APIField('product_link'),
        APIField('image_url'),
    ]