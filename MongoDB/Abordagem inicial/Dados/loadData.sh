#!/bin/bash

start_time=$SECONDS

echo -n "Importing customer"
mongoimport --db "tpch_original" \
	--collection "customer" \
	--file customer.json --jsonArray --numInsertionWorkers 6 --drop
echo "... done"

echo -n "Importing lineitem"
mongoimport --db "tpch_original" \
	--collection "lineitem" \
	--file lineitem.json --jsonArray --numInsertionWorkers 6 --drop
echo "... done"

echo -n "Importing nation"
mongoimport --db "tpch_original" \
	--collection "nation" \
	--file nation.json --jsonArray --drop
echo "... done"

echo -n "Importing orders"
mongoimport --db "tpch_original" \
	--collection "orders" \
	--file orders.json --jsonArray --drop
echo "... done"

echo -n "Importing part"
mongoimport --db "tpch_original" \
	--collection "part" \
	--file part.json --jsonArray --drop
echo "... done"

echo -n "Importing partsupp"
mongoimport --db "tpch_original" \
	--collection "partsupp" \
	--file partsupp.json --jsonArray --drop
echo "... done"

echo -n "Importing region"
mongoimport --db "tpch_original" \
	--collection "region" \
	--file region.json --jsonArray --drop
echo "... done"

echo -n "Importing supplier"
mongoimport --db "tpch_original" \
	--collection "supplier" \
	--file supplier.json --jsonArray --drop
echo "... done"


elapsed=$(( SECONDS - start_time ))
echo "Import time in seconds"
echo $elapsed
echo $elapsed > importTime.txt