#!/bin/bash
cd packages/home
counter=90
while [ $counter -le 100 ]
do
  hugo new cycles/$counter.md
  ((counter++))
done
echo All done
