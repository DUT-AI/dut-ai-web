from django.core.management.base import BaseCommand
from projects.models import Member # Nhớ đảm bảo import đúng model Member
import requests
import os
from dotenv import load_dotenv

load_dotenv()

class Command(BaseCommand):
    help = 'Đồng bộ User từ API manage.dutai.site về Wagtail Snippet'

    def handle(self, *args, **kwargs):
        api_key = os.getenv("DUT_MANAGER_API_KEY")
        if not api_key:
            self.stdout.write(self.style.ERROR('Chưa có API Key trong .env'))
            return

        url = "https://manage.dutai.site/api/v1/users"
        headers = {"Authorization": f"Bearer {api_key}"}
        
        self.stdout.write("Đang gọi API lấy danh sách User...")
        
        try:
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                json_data = response.json()
                
                # --- 1. DEBUG: In ra cấu trúc thực tế để xem ---
                # self.stdout.write(f"Dữ liệu nhận được: {json_data}") 

                # --- 2. TỰ ĐỘNG TÌM LIST USER ---
                user_list = []
                
                if isinstance(json_data, list):
                    # Trường hợp 1: API trả về thẳng 1 list
                    user_list = json_data
                elif isinstance(json_data, dict):
                    # Trường hợp 2: API trả về dict (VD: {"data": [...]})
                    # Ta thử tìm các key phổ biến
                    if 'data' in json_data:
                        user_list = json_data['data']
                    elif 'users' in json_data:
                        user_list = json_data['users']
                    elif 'results' in json_data:
                        user_list = json_data['results']
                    else:
                        self.stdout.write(self.style.ERROR(f'Không tìm thấy mảng user trong các key: data, users, results. Các key hiện có: {list(json_data.keys())}'))
                        return

                # --- 3. BẮT ĐẦU ĐỒNG BỘ ---
                count = 0
                for u in user_list:
                    # Kiểm tra xem u có phải là dict không (tránh lỗi 'str' object has no attribute 'get')
                    if isinstance(u, dict):
                        # Lấy dữ liệu an toàn
                        name = u.get('full_name') or u.get('name') or u.get('username') or u.get('email')
                        email = u.get('email', '')
                        
                        if name:
                            # Lưu vào database (Update nếu trùng email, tạo mới nếu chưa có)
                            # Nếu không có email làm khóa chính thì dùng tên
                            if email:
                                Member.objects.update_or_create(email=email, defaults={'full_name': name})
                            else:
                                Member.objects.get_or_create(full_name=name)
                            count += 1
                    else:
                        self.stdout.write(self.style.WARNING(f"Bỏ qua dữ liệu lạ: {u}"))

                self.stdout.write(self.style.SUCCESS(f'Đã đồng bộ thành công {count} thành viên!'))
            else:
                self.stdout.write(self.style.ERROR(f'Lỗi API: {response.status_code} - {response.text}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Lỗi code: {str(e)}'))