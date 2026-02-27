import io
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.core.files.base import ContentFile

def generate_receipt_pdf(payment_obj):
    template_path = 'payments/receipt_template.html'
    context = {'payment': payment_obj}
    
    template = get_template(template_path)
    html = template.render(context)
    
    result = io.BytesIO()
    
    pdf = pisa.pisaDocument(io.BytesIO(html.encode("UTF-8")), result)
    
    if not pdf.err:
        file_name = f"Receipt_{payment_obj.razorpay_order_id}.pdf"
        return ContentFile(result.getvalue(), name=file_name)
    
    return None