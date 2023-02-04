# set up fastapi
- virtualenv venv
(linux)
- source venv/Scripts/activate
(cmd)
- venv\Scripts\activate.bat

# create file
(linux)
- touch index.py
(cmd)
- type nul>index.py

# fastapi and mysql driver install
- pip install fastapi sqlalchemy pymysql uvicorn

# run app
- uvicorn index:app --reload