conn = new Mongo();
db = conn.getDB("tpch_1");
printjson(db.scale1.explain("allPlansExecution").aggregate([
    { $project: {
	_id:0,
	orders: "$c_orders"
    }},
    { $unwind: "$orders" },
    { $project: {
	orderpriority: "$orders.o_orderpriority",
	lineitems: "$orders.o_lineitems"
    }},
    { $unwind: "$lineitems" },
    { $match: { $and:[
	{"lineitems.l_shipmode":{$in:["RAIL", "REG AIR"]}},
	{$expr: {$lt: ["$lineitems.l_commitdate", "$lineitems.l_receiptdate"]}},
	{$expr: {$lt: ["$lineitems.l_shipdate", "$lineitems.l_commitdate"]}},
	{"lineitems.l_receiptdate":{$gte:ISODate("1992-01-01T00:00:00Z")}},
	{"lineitems.l_receiptdate":{$lt:ISODate("1993-01-01T00:00:00Z")}}
    ]}},
    { $project: {
	orderpriority: 1,
	l_shipmode: "$lineitems.l_shipmode"	
    }},
    { $group: {
	_id: "$l_shipmode",
	high_line_count: {$sum: {
	    $switch: {
		branches: [
		    { 
			case: {$or:[{$eq:["$orderpriority", "1-URGENT"]}, 
				    {$eq:["$orderpriority", "2-HIGH"]}]},
			then: 1
		    }
		],
		default: 0
	    }
	}},
	low_line_count: {$sum: {
	    $switch: {
		branches: [
		    {
			case: {$and:[{$ne:["$orderpriority", "1-URGENT"]}, 
				     {$ne:["$orderpriority", "2-HIGH"]}]},
			then: 1
		    }
		],
		default: 0
	    }
	}}
    }},
    { $sort: { "_id": 1 } }
], {allowDiskUse:true}));
