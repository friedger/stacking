#!/bin/bash
# Basic while loop
cd packages/home
counter=61
while [ $counter -le 61 ]
do
  hugo new cycles/$counter.md
  ((counter++))
done
echo All done
