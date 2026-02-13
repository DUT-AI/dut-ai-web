from django.db import models
from wagtail.models import Page
from wagtail.api import APIField
from wagtail.admin.panels import FieldPanel

from wagtailmarkdown.fields import MarkdownField 

class HomePage(Page):
    pass

class IntroductionPage(Page):
    body = MarkdownField(verbose_name="Nội dung giới thiệu (Markdown)")

    content_panels = Page.content_panels + [
        FieldPanel('body'), 
    ]

    api_fields = [
        APIField('body'),
    ]