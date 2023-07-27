#!/bin/bash
# Basic while loop
cd packages/home
counter=63
while [ $counter -le 64 ]
do
  hugo new cycles/$counter.md
  ((counter++))
done
echo All done
