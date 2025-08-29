from pydantic import BaseModel, ConfigDict
from typing import Optional

# For tokens
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# For Users
class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    credits: int

    model_config = ConfigDict(from_attributes=True)
