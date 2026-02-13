from django.http import JsonResponse
import requests
import os
from dotenv import load_dotenv

load_dotenv()

def get_users_proxy(request):
    api_key = os.getenv("DUT_MANAGER_API_KEY")
    
    if not api_key:
        return JsonResponse({"error": "Không tìm thấy API Key trong file .env"}, status=500)

    url = "https://manage.dutai.site/api/v1/users"
    headers = {"Authorization": f"Bearer {api_key}"}
    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return JsonResponse({
                "error": "Server đích báo lỗi", 
                "status_code": response.status_code,
                "message": response.text
            }, status=response.status_code)
        
        return JsonResponse(response.json(), safe=False)

    except Exception as e:
        return JsonResponse({"error": f"Lỗi code: {str(e)}"}, status=500)