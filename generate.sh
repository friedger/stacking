#!/bin/bash
# Basic while loop
cd packages/home
counter=67
while [ $counter -le 67 ]
do
  hugo new cycles/$counter.md
  ((counter++))
done
echo All done
