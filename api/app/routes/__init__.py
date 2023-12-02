from .user import router as urouter
from .goal import router as trouter
from .snapshot import router as srouter
from .template import router as tprouter

ROUTERS = [urouter, trouter, srouter, tprouter]
