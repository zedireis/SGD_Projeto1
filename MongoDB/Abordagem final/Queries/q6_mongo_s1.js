conn = new Mongo();
var db = conn.getDB("tpch_1");
var collection = db.scale1;

var options = {
	allowDiskUse: true,
	maxTimeMS : 4*3600*1000
};

var pipeline = [
	{
		$match: {
			'c_orders.o_lineitems.l_shipdate': {
				$gte: ISODate('1994-01-01T00:00:00.000Z'),
				$lt: ISODate('1995-01-01T00:00:00.000Z')
			},
			'c_orders.o_lineitems.l_discount': {
				$gt: 0.05,
				$lt: 0.07
			},
			'c_orders.o_lineitems.l_quantity': {
				$lt: 24
			}
		}
	}, {
		$unwind: {
			path: '$c_orders'
		}
	}, {
		$unwind: {
			path: '$c_orders.o_lineitems'
		}
	}, {
		$group: {
			_id: {},
			'SUM(c_orders᎐o_lineitems᎐l_extendedprice)': {
				$sum: {
					$multiply: [
						'$c_orders.o_lineitems.l_extendedprice',
						'$c_orders.o_lineitems.l_discount'
					]
				}
			}
		}
	}
];

printjson(collection.explain("allPlansExecution").aggregate(pipeline, options));
