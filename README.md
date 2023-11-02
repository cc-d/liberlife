# liberlife

**NOW LIVE:** [https://life.liberfy.ai](https://life.liberfy.ai)

This seems like a fun, simple little project that may end up being useful. It's primarily intended as a personal life tracker tool for my own use.

![App Preview](/preview.png)

## Project Overview

- **compose.yml:** Project's Docker composition file.
- **.envs/:** Environment variable configurations.
- **.vscode/:** Visual Studio Code specific settings.
- **api/**
  - **Dockerfile:** API's Docker configuration.
  - **app/:** Core application functionality.
    - **crud/:** Database CRUD operations.
    - **db/:** Database models and session management.
    - **routes/:** Endpoints and their logic.
    - **utils/:** Helpers like middleware and security.
  - **tests/:** Unit and integration tests.
- **frontend/**
  - **Dockerfile:** Frontend's Docker configuration.
  - **public/:** Public assets and templates.
  - **src/:** Main source code for frontend, including core utilities, components, contexts, and page components.
- **nginx/:** Nginx server configurations and Docker setup.

## async

Every route and non-cpu bound route/query/test/whatever is async. This was, a lot, harder than doing things 100% sync, and in many cases was utterly unnecessary, but it was good practice.

## async tests

Here are the results from the integration test suite with everything 100% async:

```
---------- coverage: platform darwin, python 3.11.5-final-0 ----------
Name                        Stmts   Miss  Cover   Missing
---------------------------------------------------------
__init__.py                     0      0   100%
app/__init__.py                 0      0   100%
app/config.py                  17      0   100%
app/crud/__init__.py            0      0   100%
app/crud/goal.py               29      5    83%   29, 36, 43-44, 53
app/crud/user.py               29     14    52%   20-33, 40-46, 52-54
app/db/__init__.py             14      4    71%   8-12
app/db/common.py                8      4    50%   7, 14-16
app/db/models.py               32      0   100%
app/db/session.py               9      0   100%
app/main.py                    23      4    83%   21, 26, 32-35
app/routes/__init__.py          3      0   100%
app/routes/goal.py             82     31    62%   30, 45, 60, 67, 77, 83, 93-100, 112, 118, 127-135, 146-151, 164-173, 186, 194-198
app/routes/user.py             37     10    73%   28-39, 50, 60, 66
app/schemas/__init__.py         1      0   100%
app/schemas/common.py           7      0   100%
app/schemas/goal.py            28      0   100%
app/schemas/user.py            16      0   100%
app/utils/__init__.py           0      0   100%
app/utils/dependencies.py      17      3    82%   22-23, 29
app/utils/middleware.py        16      0   100%
app/utils/security.py          26      1    96%   26
---------------------------------------------------------
TOTAL                         394     76    81%


======= 14 passed in 3.45s==============
```

now, it doesn't feel so pointless. 14 pretty short test funcs for 84% coverage is pretty good.
