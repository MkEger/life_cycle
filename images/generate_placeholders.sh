#!/bin/bash

# Array of food items
items=(
  "caprese-salad" "caprese-salad-bowl" "mediterranean-salad" "thai-salad"
  "veggie-wrap" "falafel-wrap" "spicy-tofu-wrap" "beans-rice-wrap"
  "eggplant-poke-bowl" "zucchini-poke-bowl" "mango-avocado-poke" "teriyaki-tofu-poke"
  "tomato-basil-soup" "mushroom-soup" "peas-mint-cream" "sweet-potato-cream"
  "classic-acai" "fruity-acai" "choco-berry-acai" "matcha-acai"
  "fresh-orange-juice" "green-power-smoothie" "berry-boost-smoothie" "tropical-glow-smoothie"
  "classic-americano" "vanilla-oat-latte" "mocha-bliss" "chai-latte"
  "herbal-tea" "green-tea"
  "chocolate-mousse" "tiramisu" "panna-cotta" "cheesecake"
)

# Generate placeholder for each item
for item in "${items[@]}"; do
  cat > "${item}.jpg" << IMGEOF
<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="#f5f5f5"/>
  <rect x="50" y="50" width="200" height="200" rx="20" fill="#3DAB51"/>
  <text x="150" y="180" font-family="Arial" font-size="80" text-anchor="middle" fill="white">🍽️</text>
</svg>
IMGEOF
done

echo "Generated ${#items[@]} placeholder images"
