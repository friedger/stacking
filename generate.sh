#!/bin/bash
# Basic while loop
cd packages/home
counter=3
while [ $counter -le 59 ]
do
  hugo new cycles/$counter.md
  ((counter++))
done
echo All done
