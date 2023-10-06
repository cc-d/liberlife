from .user import router as urouter
from .task import router as trouter
from .task_updates import router as turouter

ROUTERS = [urouter, trouter, turouter]
