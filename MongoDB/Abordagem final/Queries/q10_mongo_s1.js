conn = new Mongo();
var db = conn.getDB("tpch_1");
var collection = db.scale1;

var options = {
	allowDiskUse: true,
	maxTimeMS : 4*3600*1000
};

var pipeline = [
        {
            "$match": {
					"c_orders.o_orderdate": {
						$gte: ISODate('1993-08-01T00:00:00.000Z'),
						$lt: ISODate('1993-11-01T00:00:00.000Z')
					},
                    "c_orders.c_lineitems.l_returnflag": "R"
			}
        },
		{
			$unwind: {
				path: '$c_orders'
			}
		}, {
			$unwind: {
				path: '$c_orders.o_lineitems'
			}
		},		
        {
            "$group": {
                "_id": {
                    "c_phone": "$c_phone",
                    "c_comment": "$c_comment",
                    "c_acctbal": "$c_acctbal",
                    "c_address": "$c_address",
                    "c_custkey": "$c_custkey",
                    "c_name": "$c_name"
                },
                "SUM(c_orders\u1390c_lineitems\u1390l_extendedprice)": {
                    $sum: {
						$multiply: [
							'$c_orders.o_lineitems.l_extendedprice',
							'$c_orders.o_lineitems.l_discount'
						]
					}
                }
            }
        }, 
        {
            "$project": {
                "c_custkey": "$_id.c_custkey",
                "c_name": "$_id.c_name",
                "SUM(c_orders\u1390c_lineitems\u1390l_extendedprice)": "$SUM(c_orders\u1390c_lineitems\u1390l_extendedprice)",
                "c_acctbal": "$_id.c_acctbal",
                "c_address": "$_id.c_address",
                "c_phone": "$_id.c_phone",
                "c_comment": "$_id.c_comment",
                "_id": 0
            }
        }, 
        {
            "$limit": 20
        }
    ];

printjson(collection.explain("allPlansExecution").aggregate(pipeline, options));
