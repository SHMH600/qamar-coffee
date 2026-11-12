/* ==========================================================================
   products.js - Product data for Qamar Coffee Roasters
   All products live in ONE array of objects. The product pages and the home
   page render their cards from this array using the DOM (see shop.js).
   Prices are in Qatari Riyals (QAR).
   ========================================================================== */
"use strict";

const PRODUCTS = [
  /* ---------------- Coffee beans (page: products-coffee.html) ---------------- */
  { id: "c1", page: "coffee", category: "Single Origin", name: "Ethiopia Yirgacheffe", origin: "Ethiopia", roast: "Light",
    price: 62, image: "images/coffee-ethiopia.svg", alt: "Light-roast Ethiopia Yirgacheffe coffee bag",
    description: "Floral and bright with jasmine, lemon zest and a tea-like finish.",
    details: "Washed process, 1,900 m altitude. Tasting notes: jasmine, bergamot, peach. Best brewed as a pour-over. 250 g bag.", featured: true },
  { id: "c2", page: "coffee", category: "Single Origin", name: "Colombia Huila", origin: "Colombia", roast: "Medium",
    price: 55, image: "images/coffee-colombia.svg", alt: "Medium-roast Colombia Huila coffee bag",
    description: "Balanced and sweet with red apple, caramel and milk chocolate.",
    details: "Washed process, 1,750 m altitude. Tasting notes: red apple, caramel, cocoa. A great all-rounder for filter or espresso. 250 g bag.", featured: false },
  { id: "c3", page: "coffee", category: "Single Origin", name: "Brazil Santos", origin: "Brazil", roast: "Medium-Dark",
    price: 48, image: "images/coffee-brazil.svg", alt: "Medium-dark Brazil Santos coffee bag",
    description: "Smooth and nutty with a creamy body and low acidity.",
    details: "Natural process, 1,100 m altitude. Tasting notes: hazelnut, toffee, dark chocolate. Perfect with milk. 250 g bag.", featured: false },
  { id: "c4", page: "coffee", category: "Single Origin", name: "Guatemala Antigua", origin: "Guatemala", roast: "Medium",
    price: 58, image: "images/coffee-guatemala.svg", alt: "Medium-roast Guatemala Antigua coffee bag",
    description: "Rich and spicy with cocoa, orange peel and a velvety finish.",
    details: "Washed process, volcanic soil, 1,600 m altitude. Tasting notes: cocoa, orange peel, brown sugar. 250 g bag.", featured: false },
  { id: "c5", page: "coffee", category: "Single Origin", name: "Kenya AA Nyeri", origin: "Kenya", roast: "Light",
    price: 72, image: "images/coffee-kenya.svg", alt: "Light-roast Kenya AA Nyeri coffee bag",
    description: "Juicy and vibrant with blackcurrant and grapefruit acidity.",
    details: "Washed process, 1,800 m altitude. Tasting notes: blackcurrant, grapefruit, brown sugar. Limited seasonal lot. 250 g bag.", featured: false },
  { id: "c6", page: "coffee", category: "Blends", name: "Qamar House Blend", origin: "Brazil & Colombia", roast: "Dark",
    price: 45, image: "images/coffee-house.svg", alt: "Dark-roast Qamar House Blend coffee bag",
    description: "Our signature everyday blend: bold, chocolatey and comforting.",
    details: "A blend of Brazilian and Colombian beans. Tasting notes: dark chocolate, roasted almond, caramel. Great for Arabic-style and milk coffee. 250 g bag.", featured: true },
  { id: "c7", page: "coffee", category: "Blends", name: "Doha Espresso", origin: "Brazil, Ethiopia & Guatemala", roast: "Dark",
    price: 52, image: "images/coffee-espresso.svg", alt: "Dark-roast Doha Espresso blend coffee bag",
    description: "A thick, syrupy espresso with a long, sweet crema.",
    details: "Built for espresso machines and moka pots. Tasting notes: molasses, cocoa nibs, dried fruit. 250 g bag.", featured: false },
  { id: "c8", page: "coffee", category: "Decaf", name: "Decaf Colombia", origin: "Colombia", roast: "Medium",
    price: 59, image: "images/coffee-decaf.svg", alt: "Medium-roast decaffeinated Colombia coffee bag",
    description: "Swiss Water decaf that keeps all the sweetness and body.",
    details: "Decaffeinated with the chemical-free Swiss Water process. Tasting notes: brown sugar, almond, orange. 250 g bag.", featured: false },

  /* ---------------- Equipment & gifts (page: products-equipment.html) ---------------- */
  { id: "e1", page: "equipment", category: "Brewing", name: "Ceramic V60 Dripper Set", origin: "Japan", roast: "",
    price: 135, image: "images/equip-dripper.svg", alt: "Ceramic cone dripper with a glass server",
    description: "Cone dripper with a glass server and 40 paper filters.",
    details: "Size 02, makes 1-4 cups. Ceramic holds heat for a stable brew. Includes a glass server and 40 filters.", featured: true },
  { id: "e2", page: "equipment", category: "Brewing", name: "Gooseneck Kettle 0.8 L", origin: "Stainless steel", roast: "",
    price: 210, image: "images/equip-kettle.svg", alt: "Black gooseneck pour-over kettle",
    description: "Precision-pour kettle for controlled, even extraction.",
    details: "0.8 litre capacity, 304 stainless steel, heat-resistant handle. Works on gas, electric and induction hobs.", featured: false },
  { id: "e3", page: "equipment", category: "Grinders", name: "Manual Burr Grinder", origin: "Stainless steel burrs", roast: "",
    price: 245, image: "images/equip-grinder.svg", alt: "Manual coffee burr grinder with glass jar",
    description: "Hand grinder with 40 click settings, from espresso to French press.",
    details: "Conical steel burrs, 30 g capacity, 40 grind settings, foldable handle. Easy to carry on trips.", featured: false },
  { id: "e4", page: "equipment", category: "Brewing", name: "French Press 600 ml", origin: "Borosilicate glass", roast: "",
    price: 98, image: "images/equip-press.svg", alt: "Glass French press with black frame",
    description: "Classic full-body brewing in four minutes.",
    details: "600 ml (4 cups), double-mesh filter, heat-resistant borosilicate glass. Dishwasher safe.", featured: false },
  { id: "e5", page: "equipment", category: "Brewing", name: "Digital Coffee Scale", origin: "0.1 g precision", roast: "",
    price: 120, image: "images/equip-scale.svg", alt: "Digital coffee scale showing 18 grams",
    description: "Weigh beans and water with 0.1 g precision and a built-in timer.",
    details: "Max 2 kg, 0.1 g accuracy, flow-rate timer, USB-C rechargeable, water-resistant surface.", featured: false },
  { id: "e6", page: "equipment", category: "Gift Boxes", name: "Starter Gift Box", origin: "Gift set", roast: "",
    price: 160, image: "images/equip-giftbox-starter.svg", alt: "Brown gift box tied with a golden ribbon",
    description: "Two 250 g bags, a ceramic mug and a handwritten card.",
    details: "Contains Qamar House Blend, Colombia Huila, a 300 ml ceramic mug and a handwritten greeting card. Gift wrapped.", featured: false },
  { id: "e7", page: "equipment", category: "Gift Boxes", name: "Connoisseur Gift Box", origin: "Gift set", roast: "",
    price: 420, image: "images/equip-giftbox-premium.svg", alt: "Dark green premium gift box with gold ribbon",
    description: "Three single-origin bags, a French press and a scale in a premium box.",
    details: "Contains Ethiopia Yirgacheffe, Kenya AA, Guatemala Antigua (250 g each), a 600 ml French press and a digital scale.", featured: false },
  { id: "e8", page: "equipment", category: "Gift Boxes", name: "Ceramic Mug Duo", origin: "Handmade ceramic", roast: "",
    price: 85, image: "images/equip-mugs.svg", alt: "Two ceramic coffee mugs, one cream and one dark brown",
    description: "Two hand-glazed 300 ml mugs, ideal as a housewarming gift.",
    details: "Set of two 300 ml stoneware mugs, microwave and dishwasher safe, packed in a recycled gift box.", featured: false }
];

/* Discount codes for the optional cart feature (percentage off). */
const DISCOUNT_CODES = { QAMAR10: 10, WELCOME15: 15 };
