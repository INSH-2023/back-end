from sqlalchemy import create_engine, MetaData

user = "root"
password = "Tslol05346194!"
host = "localhost:3306"
db = "fix_device"

engine = create_engine("mysql+pymysql://"+user+":"+password+"@"+host+"/"+db)

conn = engine.connect()

meta = MetaData()
