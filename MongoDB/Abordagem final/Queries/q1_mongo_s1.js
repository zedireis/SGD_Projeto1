// CMD to execute within shell: mongo --quiet q1_mongo.js
// Time without optimizations:
//   Running time: 33417 ms (~33.417 sec)

conn = new Mongo();
db = conn.getDB("tpch_1");
printjson(db.scale1.explain("allPlansExecution").aggregate([
   // $unwind cannot unwind nested arrays directly (see [1]); so
   // one must use stacked $unwinds and $projects in the pipeline
   { $unwind: 	"$c_orders" },
   // Equivalent to: WHERE l_shipdate <= date '1998-12-01' - interval '90 days'
   // Remark: 90days * 24h/day * 3600sec/h * 1000msec/sec = 7776000000. Generally,
   //         [DELTA] * 24h/day * 3600sec/h * 1000msec/sec is used in mongo.
   {$project: {
	lineitems: {
	    $filter: {
		input: "$c_orders.o_lineitems",
		as: "l",
		cond: {$lte:["$$l.l_shipdate",  new Date(ISODate("1998-12-01T00:00:00Z").getTime() - 108*24*3600*1000)]}
	    }
	}
    }},
    { $unwind: "$lineitems"},
    // Equivalent to: GROUP BY l_returnflag, l_linestatus
    { $group: {
	_id: {l_returnflag: "$lineitems.l_returnflag", l_linestatus: "$lineitems.l_linestatus"},
	sum_qty: { $sum: "$lineitems.l_quantity" }, //sum(l_quantity)
	sum_base_price: {$sum: "$lineitems.l_extendedprice"}, //sum(l_extendedprice)
	sum_disc_price: {$sum: {$multiply: ["$lineitems.l_extendedprice", {$subtract: [1, "$lineitems.l_discount"]}]}}, //sum(l_extendedprice * (1 - l_discount))
	sum_charge: {$sum: {$multiply: ["$lineitems.l_extendedprice", {$subtract: [1, "$lineitems.l_discount"]}, {$add: [1, "$lineitems.l_tax"]}]}}, //sum(l_extendedprice * (1 - l_discount) * (1 + l_tax))
	avg_qty: {$avg: "$lineitems.l_quantity"}, //avg(l_quantity)
	avg_price: {$avg: "$lineitems.l_extendedprice"}, //avg(l_extendedprice)
	avg_disc: {$avg: "$lineitems.l_discount"}, //avg(l_discount)
	count_order: {$sum: 1} //count(*)
    }},
    // Equivalent to ORDER BY l_returnflag asc, l_linestatus asc
    { $sort: { "_id.l_returnflag": 1, "_id.l_linestatus": 1} }
], {allowDiskUse: true}));

// References:
// [1] https://jira.mongodb.org/browse/SERVER-6436