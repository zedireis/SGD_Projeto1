#!/bin/bash

VAR1='$'

for file in *.tbl
do
	echo "Processing $file"
    mv -v "$file" "${file%.tbl}.csv"
	sed -e "s/|.${VAR1}//" *.csv -i
done;


str="C_CUSTKEY|C_NAME|C_ADDRESS|C_NATIONKEY|C_PHONE|C_ACCTBAL|C_MKTSEGMENT|C_COMMENT"
sed -i "1s/^/${str}\n/" customer.csv

str="L_ORDERKEY|L_PARTKEY|L_SUPPKEY|L_LINENUMBER|L_QUANTITY|L_EXTENDEDPRICE|L_DISCOUNT|L_TAX|L_RETURNFLAG|L_LINESTATUS|L_SHIPDATE|L_COMMITDATE|L_RECEIPTDATE|L_SHIPINSTRUCT|L_SHIPMODE|L_COMMENT"
sed -i "1s/^/${str}\n/" lineitem.csv

str="N_NATIONKEY|N_NAME|N_REGIONKEY|N_COMMENT"
sed -i "1s/^/${str}\n/" nation.csv

str="O_ORDERKEY|O_CUSTKEY|O_ORDERSTATUS|O_TOTALPRICE|O_ORDERDATE|O_ORDERPRIORITY|O_CLERK|O_SHIPPRIORITY|O_COMMENT"
sed -i "1s/^/${str}\n/" orders.csv

str="P_PARTKEY|P_NAME|P_MFGR|P_BRAND|P_TYPE|P_SIZE|P_CONTAINER|P_RETAILPRICE|P_COMMENT"
sed -i "1s/^/${str}\n/" part.csv

str="PS_PARTKEY|PS_SUPPKEY|PS_AVAILQTY|PS_SUPPLYCOST|PS_COMMENT"
sed -i "1s/^/${str}\n/" partsupp.csv

str="R_REGIONKEY|R_NAME|R_COMMENT"
sed -i "1s/^/${str}\n/" region.csv

str="S_SUPPKEY|S_NAME|S_ADDRESS|S_NATIONKEY|S_PHONE|S_ACCTBAL|S_COMMENT"
sed -i "1s/^/${str}\n/" supplier.csv

for file in *.csv
do
	echo "JSON $file"
    csvjson -d "|" "${file}" > "${file%.csv}.json"
done;