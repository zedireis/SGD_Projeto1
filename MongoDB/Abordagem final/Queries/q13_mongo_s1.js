conn = new Mongo();
db = conn.getDB("tpch_1");
printjson(db.scale1.explain("allPlansExecution").aggregate([
    { $project: {
	_id: "$c_custkey",
	orders: "$c_orders"
    }},
    { $unwind: {
	path: "$orders",
	preserveNullAndEmptyArrays: true
    }},
    { $project: {
	_id: 1,
	orderkey: "$orders.o_orderkey",
	ordercomment: "$orders.o_comment"
    }},
    { $match: {
    	ordercomment: {$not: /.*express.*packages.*/}
    }},
    { $group: {
    	_id: "$_id",
    	c_count: { $sum: {
	    $cond: [ {$eq:["$orderkey", undefined]}, 0, 1 ]
	}}
    }},
    { $group: {
    	_id: "$c_count",
    	custdist: {$sum: 1}
    }},
    {$sort: {"custdist": -1, "_id": -1}}
], {allowDiskUse:true}));
