conn = new Mongo();
db = conn.getDB("tpch_1");
cursor = db.scale1.getPlanCache().clear();