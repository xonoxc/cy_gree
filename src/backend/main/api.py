from .services import UserModelService
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

#First create user with basic details
#Password updation and other critical operations are performed on user model
@api_controller("/user",tags=["User"])
class UserModelController(ModelControllerBase):
    service=UserModelService(model=User)
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
