conn = new Mongo();
db = conn.getDB("tpch_1");
printjson(db.scale1.explain("allPlansExecution").aggregate([
    { $project: {
	_id:0, 
	orders: {$filter:{
		 input: "$c_orders",
		 as: "o",
		 cond: {$and: [{$gte:["$$o.o_orderdate", ISODate("1992-01-01T00:00:00Z")]}, {$lt:["$$o.o_orderdate", ISODate("1992-04-01T00:00:00Z")]}]}}
	}}
	
    },
    { $unwind: "$orders" },
    { $project: {
	orderkey: "$orders.o_orderkey",
	orderpriority: "$orders.o_orderpriority",
	lineitems: "$orders.o_lineitems" 
    }},
    { $unwind: "$lineitems"},
    { $match: {$expr:{$lt:["$lineitems.l_commitdate","$lineitems.l_receiptdate"]}}},
    { $group: {
	_id: {orderkey:"$orderkey", orderprioriry:"$orderpriority"}
    }},
    { $group: {
	_id: "$_id.orderprioriry",
	order_count: {$sum: 1}
    }},
    { $sort: {"_id": 1}}
], {allowDiskUse:true}));
