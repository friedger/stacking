#!/bin/bash
cd packages/home
counter=103
while [ $counter -le 110 ]
do
  hugo new cycles/$counter.md
  hugo new mp/cycles/$counter.md
  ((counter++))
done
echo All done
