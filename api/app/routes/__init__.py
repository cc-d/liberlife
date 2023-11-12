from .user import router as urouter
from .goal import router as trouter
from .snapshot import router as srouter

ROUTERS = [urouter, trouter, srouter]
