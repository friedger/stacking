#!/bin/bash
# Basic while loop
cd packages/home
counter=60
while [ $counter -le 60 ]
do
  hugo new cycles/$counter.md
  ((counter++))
done
echo All done
