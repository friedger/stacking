#!/bin/bash
# Basic while loop
cd packages/home
counter=65
while [ $counter -le 65 ]
do
  hugo new cycles/$counter.md
  ((counter++))
done
echo All done
