# liberlife

### **LIVE:** [https://life.liberfy.ai](https://life.liberfy.ai)

#### (no password requirements)

See [https://life.liberfy.ai/demo](https://life.liberfy.ai/demo) for a non-persistent demo of the frontend.

This seems like a fun, simple little project that may end up being useful. It's primarily intended as a personal life tracker tool for my own use.

It's starting to look pretty good. If you use this, please attribute me in some way. If you use this to make money, attribute me some money.

#### download android .apk

There is an apk that can be downloaded from [https://life.liberfy.ai/liberlife.apk](https://life.liberfy.ai/liberlife.apk)

### Project Structure

#### frontend/

This directory holds the React application including all source code, configurations, and dependencies.

- `/build/`: Compiled production build of the React app.
- `/public/`: Static assets like `favicon.ico` and `index.html` template.
- `/src/`: Source code for the app including components, contexts, pages, and utilities.
  - `/api/`: TypeScript files defining the API models, services, and schemas.
  - `/app/`: Core application setup and theme configuration.
  - `/components/`: Reusable React components used throughout the app.
  - `/contexts/`: React context providers for application-wide state management.
  - `/pages/`: Components representing entire pages in the app, organized by route.
  - `/utils/`: Utility functions and helpers for various features in the app.

#### api/

Contains the backend API source code, including database models, routes, schemas, and utility functions.

- `/alembic/`: Alembic migrations for database schema changes.
- `/app/`: Core backend application files, including API route definitions.
  - `/crud/`: CRUD utilities for database operations.
  - `/db/`: Database session management and model definitions.
  - `/routes/`: API endpoint definitions.
  - `/schemas/`: Pydantic schemas for data validation and serialization.
  - `/utils/`: Helper functions and utilities for the backend.
- `/tests/`: Unit and integration tests for the API.

#### mobile/

Contains the mobile application codebase if one exists. This is where you would find the Android and iOS app implementations, typically in a framework like React Native.

- `/app/`: The source code for the mobile app.
- `/build/`: Compiled output for the mobile app.

#### Lighthouse

![!Lighthouse score](/static/lighthouse.png)

#### Dark Mode Preview:

![!Dark Mode (default) preview](/static/dark0.png)
![!Dark Mode (default) preview](/static/dark1.png)
![!Dark Mode (default) preview](/static/dark2.png)

#### Light Mode Preview:

![!Lite Mode preview](/static/lite0.png)
![!Lite Mode preview](/static/lite1.png)

## async tests

lol exceptions padded test coverage

```
---------- coverage: platform darwin, python 3.11.5-final-0 ----------
Name                        Stmts   Miss  Cover   Missing
---------------------------------------------------------
__init__.py                     0      0   100%
app/__init__.py                 0      0   100%
app/config.py                  21      0   100%
app/crud/__init__.py            0      0   100%
app/crud/goal.py               36      3    92%   56-57, 66
app/crud/snapshots.py          21     12    43%   27, 34-52
app/crud/user.py               30     14    53%   24-32, 43-49, 55-57
app/db/__init__.py             24     12    50%   13-17, 21-25, 29-33
app/db/common.py                8      4    50%   7, 14-16
app/db/models.py               81      7    91%   116, 131-136, 173
app/db/session.py              13      0   100%
app/main.py                    23      4    83%   21, 26, 32-35
app/routes/__init__.py          5      0   100%
app/routes/goal.py            117     26    78%   40, 45, 56, 68, 91, 103, 116, 128, 134-135, 145, 149, 163, 165, 170, 185, 189-192, 198-200, 212, 217-225
app/routes/snapshot.py         40     13    68%   35-37, 46-49, 66, 73, 78-81
app/routes/template.py         75     45    40%   25-33, 39-48, 57-61, 68-73, 83-88, 97-100, 110-115, 126-129, 142-148, 158-162
app/routes/user.py             36      8    78%   28-36, 61
app/schemas/__init__.py         1      0   100%
app/schemas/common.py           9      0   100%
app/schemas/goal.py            53      0   100%
app/schemas/snapshot.py        20      0   100%
app/schemas/user.py            16      0   100%
app/utils/__init__.py           0      0   100%
app/utils/dependencies.py      18      1    94%   28
app/utils/httperrors.py       190      0   100%
app/utils/middleware.py        16      0   100%
app/utils/security.py          34      7    79%   26, 49-55
---------------------------------------------------------
TOTAL                         887    156    82%


======================================= 88 passed in 4.62s
```
