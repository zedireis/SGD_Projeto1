conn = new Mongo();
db = conn.getDB("tpch_1");
printjson(db.scale1.explain("allPlansExecution").aggregate([
    { $match: {
	"c_mktsegment": "AUTOMOBILE", 
	"c_orders.o_lineitems.l_shipdate":{$gt: ISODate("1992-01-02T00:00:00Z")}
    }},
    { $unwind: "$c_orders" },
    { $match: {"c_orders.o_orderdate": {$lt: ISODate("1992-01-02T00:00:00Z")}}},
    { $project: {
	"o_orderkey": "$c_orders.o_orderkey",
    	"o_orderdate": "$c_orders.o_orderdate",
    	"o_shippriority": "$c_orders.o_shippriority",
    	"lineitems": "$c_orders.o_lineitems"
    }},
    { $unwind: "$lineitems"},
    { $match: {"lineitems.l_shipdate": {$gt: ISODate("1992-01-02T00:00:00Z")}}},
    { $group: { 
    	_id: {l_orderkey: "$o_orderkey", o_orderdate: "$o_orderdate", o_shippriority: "$o_shippriority"},
    	revenue: {$sum: {$multiply: ["$lineitems.l_extendedprice", {$subtract: [1, "$lineitems.l_discount"]}]}}
    }},
    { $sort: { "revenue": -1, "_id.o_orderdate": 1 }},
    { $limit : 10 }
], {allowDiskUse:true}));
