#!/bin/bash

mkdir -p tmp/img/svgCards

for card in app/img/svgCards/*.svg
do
    name=${card##*/}
    sed 's/\<svg/\<svg viewBox="260 370 224 313" preserveAspectRatio="none"/' < $card > tmp/img/svgCards/$name
done