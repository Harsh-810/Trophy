const fs = require('fs');
const files = [
  'src/pages/AdminConsole.jsx', 
  'src/pages/AdminProduct.jsx', 
  'src/pages/AdminOrder.jsx', 
  'src/pages/AdminCoupon.jsx', 
  'src/pages/AdminUser.jsx'
];

const linkString = `          <li>
            <Link to="/admin/custom-orders">
              <i className="fa-solid fa-compass-drafting"></i> Custom Orders
            </Link>
          </li>
          <li>
            <Link to="/admin/inquiries">
              <i className="fa-regular fa-envelope"></i> Inquiries
            </Link>
          </li>`;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('/admin/custom-orders')) {
    // Find the Orders block and insert after it
    const match = content.match(/(<li>\s*<Link to="\/admin\/orders"[\s\S]*?<\/li>)/);
    if (match) {
      content = content.replace(match[1], match[1] + '\n' + linkString);
      fs.writeFileSync(file, content);
      console.log('Updated', file);
    } else {
      console.log('Orders link not found in', file);
    }
  } else {
    console.log('Already updated', file);
  }
});
