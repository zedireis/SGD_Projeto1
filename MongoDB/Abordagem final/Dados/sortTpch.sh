#!/bin/bash

savespace=false
while getopts s flag
do
    case "${flag}" in
        s) savespace=true;;
    esac
done

sort -nk2 -t '|' orders.tbl -o orders_sorted.csv

if [ savespace ]
then
	echo "Orders Space Saved"
	rm orders.tbl
fi

echo "Orders sorted"
echo "              Sorting lineitems"

awk -F'|' 'NR==FNR{o[$1]=FNR; next} {print o[$1] "|" $0}' \
<(awk -F'|' '{print $1}' orders_sorted.csv | uniq) \
lineitem.tbl | sort -t '|' -nk1 | cut -d'|' -f2- > \
lineitem_sorted.csv

if [ savespace ]
then
	echo "Lineitems Space Saved"
	rm lineitem.tbl
fi

mv orders_sorted.csv orders_sorted.tbl
mv lineitem_sorted.csv lineitem_sorted.tbl

echo "Joining to json"

./crjoin -d 1 -m 0 -c customer.tbl \
				 -o orders_sorted.tbl \
				 -l lineitem_sorted.tbl \
				 -r data.json

 echo "Done"