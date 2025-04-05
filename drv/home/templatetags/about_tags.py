from django import template

register = template.Library()

@register.filter
def split_paragraphs(text):
    """Split text into paragraphs by newline characters"""
    if text:
        return text.split('\n\n')
    return []

