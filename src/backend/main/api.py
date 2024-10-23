from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from ninja import NinjaAPI, Schema
from ninja_jwt.authentication import JWTAuth
from django.http import JsonResponse
from ninja_jwt.tokens import RefreshToken


from ninja_jwt.controller import NinjaJWTDefaultController
from ninja_jwt.authentication import JWTAuth
from django.contrib.auth.models import User
from ninja import Schema
from ninja_extra import (
    ModelConfig,
    ModelControllerBase,
    ModelSchemaConfig,
    api_controller,
    NinjaExtraAPI
)
from main.models import UserProfile



api = NinjaExtraAPI(title="CyGree")

api.register_controllers(NinjaJWTDefaultController)

class AuthSchema(Schema):
    username: str
    password: str

@api.post('/register')
def register(request, payload: AuthSchema):
    if User.objects.filter(username=payload.username).exists():
        return JsonResponse({"success": False, "error": "User already exists."})
    user = User.objects.create_user(username=payload.username, password=payload.password)
    return {"success": True, "user_id": user.id}

@api.post('/login')
def login(request, payload: AuthSchema):
    user = authenticate(username=payload.username, password=payload.password)
    if user:
        refresh = RefreshToken.for_user(user)
        return JsonResponse({'refresh': str(refresh), 'access': str(refresh.access_token)})
    return JsonResponse({'error': 'Invalid credentials'}, status=400)

#First create user with basic details
#Password updation and other critical operations are performed on user model
@api_controller("/user",tags=["User"])
class UserModelController(ModelControllerBase):
    model_config = ModelConfig(
        model = User,
        allowed_routes=['create',"find_one", "update", "patch", "delete"],
        schema_config=ModelSchemaConfig(include=["id","password","username","first_name","last_name","email"]),
    )
api.register_controllers(UserModelController)

#Hold extra information related to user to setup its profile
@api_controller("/profile",tags=["Profile"],auth=JWTAuth())
class ProfileModelController(ModelControllerBase):
    model_config = ModelConfig(
        model=UserProfile,
        allowed_routes=['create',"find_one", "update", "patch", "delete"],
        schema_config=ModelSchemaConfig(read_only_fields=["id"]),
    )
api.register_controllers(ProfileModelController)
