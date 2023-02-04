from sqlalchemy import create_engine, MetaData

user = "root"
password = "abcd1234"
host = "localhost:3306"
db = "fix_device"

engine = create_engine("mysql+pymysql://"+user+":"+password+"@"+host+"/"+db, echo=True)

meta = MetaData()

conn = engine.connect()