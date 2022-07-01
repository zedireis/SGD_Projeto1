#!/bin/bash

start_time=$SECONDS

echo -n "Importing data "
mongoimport --db "tpch_1" \
	--collection "scale1" \
	--file data.json --numInsertionWorkers 6 --drop
echo "... done"

elapsed=$(( SECONDS - start_time ))
echo "Import time in seconds"
echo $elapsed
echo $elapsed > importTime.txt