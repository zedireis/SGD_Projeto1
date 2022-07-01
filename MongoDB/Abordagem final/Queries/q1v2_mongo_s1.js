conn = new Mongo();
var db = conn.getDB("tpch_1");
var collection = db.scale1;

var options = {
	allowDiskUse: true
};

var pipeline = [
	{
		"$match": {
			"c_orders.o_lineitems.l_shipdate": {
				"$lte": new Date(ISODate("1998-08-15T00:00:00Z"))
			}
		}
	}, 
	{
		"$group": {
			"_id": {
				"c_orders\u1390o_lineitems\u1390l_returnflag": "$c_orders.o_lineitems.l_returnflag",
				"c_orders\u1390o_lineitems\u1390l_linestatus": "$c_orders.o_lineitems.l_linestatus"
			},
			"SUM(c_orders\u1390o_lineitems\u1390l_quantity)": {
				"$sum": "$c_orders.o_lineitems.l_quantity"
			},
			"SUM(c_orders\u1390o_lineitems\u1390l_extendedprice)": {
				"$sum": "$c_orders.o_lineitems.l_extendedprice"
			},
			"AVG(c_orders\u1390o_lineitems\u1390l_quantity)": {
				"$avg": "$c_orders.o_lineitems.l_quantity"
			},
			"AVG(c_orders\u1390o_lineitems\u1390l_extendedprice)": {
				"$avg": "$c_orders.o_lineitems.l_extendedprice"
			},
			"AVG(c_orders\u1390o_lineitems\u1390l_discount)": {
				"$avg": "$c_orders.o_lineitems.l_discount"
			},
			"COUNT(*)": {
				"$sum": 1
			}
		}
	}, 
	{
		"$project": {
			"c_orders.o_lineitems.l_returnflag": "$_id.c_orders\u1390o_lineitems\u1390l_returnflag",
			"c_orders.o_lineitems.l_linestatus": "$_id.c_orders\u1390o_lineitems\u1390l_linestatus",
			"SUM(c_orders\u1390o_lineitems\u1390l_quantity)": "$SUM(c_orders\u1390o_lineitems\u1390l_quantity)",
			"SUM(c_orders\u1390o_lineitems\u1390l_extendedprice)": "$SUM(c_orders\u1390o_lineitems\u1390l_extendedprice)",
			"AVG(c_orders\u1390o_lineitems\u1390l_quantity)": "$AVG(c_orders\u1390o_lineitems\u1390l_quantity)",
			"AVG(c_orders\u1390o_lineitems\u1390l_extendedprice)": "$AVG(c_orders\u1390o_lineitems\u1390l_extendedprice)",
			"AVG(c_orders\u1390o_lineitems\u1390l_discount)": "$AVG(c_orders\u1390o_lineitems\u1390l_discount)",
			"COUNT(*)": "$COUNT(*)",
			"_id": {l_returnflag: "$lineitems.l_returnflag", l_linestatus: "$lineitems.l_linestatus"}
		}
	}, 
	{
		"$sort": {
			"_id.l_returnflag": 1, "_id.l_linestatus": 1
		}
	}
];

printjson(collection.explain("allPlansExecution").aggregate(pipeline, options));
