const fs = require('fs');

const data = JSON.parse(fs.readFileSync('db.json', 'utf8'));

data.products = [
  {
    "id": "p7Irh327IFg",
    "name": "Executive Excellence Award",
    "price": 450,
    "category": "Corporate Awards",
    "image": "https://imgs.search.brave.com/wped5r2LYVGyol1UXrMdD2RXZmjLsSHcwCpOik6yrEc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTg0/NjAyMzY1L3Bob3Rv/L3dpbm5lcnMtdHJv/cGhpZXMuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPVByaFdw/OE5fQmRFMDU5eWVv/QmFuX2RZRDhPR0tG/Y0JMVVY0eGN0dm5C/TkU9",
    "description": "A majestic corporate award crafted to honor exceptional leadership and visionary excellence.",
    "scale": "12\" Standard",
    "material": "24K Polished Gold Inlay",
    "sku": "AUR-2886"
  },
  {
    "id": "s1aK2ohVZh4",
    "name": "Gold Victory Cup",
    "price": 850,
    "category": "Custom Cups",
    "image": "https://imgs.search.brave.com/gUe-1L-vJ0PyF7vBDop-FDkC2LYOWhR0XOos6opz_KM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjAw/Mzc1MzYxLTAwMS9w/aG90by9hc3NvcnRl/ZC10cm9waGllcy5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/TlBBQjZTSjZ3eHVz/c3BzWVM2cktJbWxa/NVlZeGNZbzBhV0hi/TWlEeW1aYz0",
    "description": "An impressive golden cup, perfect for grand sports tournaments and championships.",
    "scale": "16\" Grand",
    "material": "Solid Brass with Gold Plating",
    "sku": "AUR-7260"
  },
  {
    "id": "Fsn-HQW2ntc",
    "name": "Marathon Finisher Medal",
    "price": 45,
    "category": "Custom Medals",
    "image": "https://imgs.search.brave.com/k_2L_x9M_T_4R_z_5P_q_3N_v_1S_y_0Q_u_6W_o_8Y_w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTg0/NjAyMzY1L3Bob3Rv/L3dpbm5lcnMtdHJv/cGhpZXMuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPVByaFdw/OE5fQmRFMDU5eWVv/QmFuX2RZRDhPR0tG/Y0JMVVY0eGN0dm5C/TkU9",
    "description": "A high-quality bespoke medal with custom ribbon options, crafted for marathon finishers.",
    "scale": "3\" Diameter",
    "material": "Zinc Alloy",
    "sku": "AUR-2767"
  },
  {
    "id": "N4j_fT9Qk1l",
    "name": "Titanium Soccer Trophy",
    "price": 320,
    "category": "Sports Trophies",
    "image": "https://imgs.search.brave.com/wped5r2LYVGyol1UXrMdD2RXZmjLsSHcwCpOik6yrEc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTg0/NjAyMzY1L3Bob3Rv/L3dpbm5lcnMtdHJv/cGhpZXMuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPVByaFdw/OE5fQmRFMDU5eWVv/QmFuX2RZRDhPR0tG/Y0JMVVY0eGN0dm5C/TkU9",
    "description": "Modern titanium soccer trophy for the Most Valuable Player.",
    "scale": "14\" Standard",
    "material": "Titanium Finish",
    "sku": "AUR-9901"
  },
  {
    "id": "L9p_xZ2We3q",
    "name": "Crystal Star Pillar",
    "price": 180,
    "category": "Corporate Awards",
    "image": "https://imgs.search.brave.com/gUe-1L-vJ0PyF7vBDop-FDkC2LYOWhR0XOos6opz_KM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMjAw/Mzc1MzYxLTAwMS9w/aG90by9hc3NvcnRl/ZC10cm9waGllcy5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/TlBBQjZTSjZ3eHVz/c3BzWVM2cktJbWxa/NVlZeGNZbzBhV0hi/TWlEeW1aYz0",
    "description": "Elegant optical crystal star for top performers.",
    "scale": "10\" Standard",
    "material": "K9 Optical Crystal",
    "sku": "AUR-8122"
  },
  {
    "id": "X8b_cR1Vf2m",
    "name": "Silver Championship Cup",
    "price": 650,
    "category": "Custom Cups",
    "image": "https://imgs.search.brave.com/wped5r2LYVGyol1UXrMdD2RXZmjLsSHcwCpOik6yrEc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTg0/NjAyMzY1L3Bob3Rv/L3dpbm5lcnMtdHJv/cGhpZXMuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPVByaFdw/OE5fQmRFMDU5eWVv/QmFuX2RZRDhPR0tG/Y0JMVVY0eGN0dm5C/TkU9",
    "description": "Classic silver-plated cup for elite competitions.",
    "scale": "18\" Exhibition",
    "material": "Silver-Plated Brass",
    "sku": "AUR-3411"
  }
];

fs.writeFileSync('db.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated products in db.json');
