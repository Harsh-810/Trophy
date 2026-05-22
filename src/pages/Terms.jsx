import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: '#050505', color: '#f5f2ec', minHeight: '100vh', paddingTop: '140px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ 
          fontFamily: "'Cormorant Garamond', serif", 
          fontSize: '48px', 
          color: '#d4af37', 
          marginBottom: '40px',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          Terms of Excellence
        </h1>
        
        <div style={{ 
          fontSize: '15px', 
          lineHeight: '1.8', 
          color: 'rgba(255,255,255,0.8)',
          fontWeight: '300'
        }}>
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h3 style={{ color: '#d4af37', marginTop: '40px', marginBottom: '15px', fontFamily: "'Cormorant Garamond', serif", fontSize: '24px' }}>1. Introduction</h3>
          <p>Welcome to Aurelian Trophies. By accessing our platform, participating in custom curation, or purchasing any of our bespoke masterpieces, you agree to be bound by these Terms of Excellence. These terms guarantee the mutual respect and standard of luxury expected between Aurelian and our esteemed clientele.</p>

          <h3 style={{ color: '#d4af37', marginTop: '40px', marginBottom: '15px', fontFamily: "'Cormorant Garamond', serif", fontSize: '24px' }}>2. Craftsmanship & Authenticity</h3>
          <p>Every piece commissioned or purchased from Aurelian is guaranteed to be authentic, crafted with the highest quality materials, and inspected rigorously. However, due to the bespoke nature of our craftsmanship, slight variations in finish, weight, and dimensions may occur. These are not defects but the hallmarks of artisanal creation.</p>

          <h3 style={{ color: '#d4af37', marginTop: '40px', marginBottom: '15px', fontFamily: "'Cormorant Garamond', serif", fontSize: '24px' }}>3. Bespoke Orders & Client Submissions</h3>
          <p>When you submit a bespoke request via the Client Submission portal, you agree that all designs, specifications, and intellectual property resulting from the collaboration remain the exclusive property of Aurelian unless a separate transfer of rights is explicitly documented and signed.</p>

          <h3 style={{ color: '#d4af37', marginTop: '40px', marginBottom: '15px', fontFamily: "'Cormorant Garamond', serif", fontSize: '24px' }}>4. Payments & Vault Acquisition</h3>
          <p>All prices are listed in USD. Full payment or an agreed-upon deposit is required prior to the commencement of any custom work or dispatch of items from our vault. We reserve the right to cancel any order subject to inventory discrepancies or suspected fraudulent activity.</p>

          <h3 style={{ color: '#d4af37', marginTop: '40px', marginBottom: '15px', fontFamily: "'Cormorant Garamond', serif", fontSize: '24px' }}>5. Returns & Restoration</h3>
          <p>Due to the exclusive and personalized nature of our trophies and awards, all bespoke sales are final. For catalog items, returns are accepted within 14 days of receipt, provided the item is returned in its original, pristine condition. Aurelian reserves the right to reject returns that show signs of mishandling.</p>
          
          <h3 style={{ color: '#d4af37', marginTop: '40px', marginBottom: '15px', fontFamily: "'Cormorant Garamond', serif", fontSize: '24px' }}>6. Limitation of Liability</h3>
          <p>Aurelian Trophies shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform or the ownership of our products. Our maximum liability in any dispute shall not exceed the total purchase price of the item in question.</p>

          <div style={{ marginTop: '60px', paddingTop: '30px', borderTop: '1px solid rgba(212, 175, 55, 0.2)', textAlign: 'center' }}>
            <p>For any inquiries regarding these terms, please contact our Curatorial Desk via the <Link to="/contact" style={{ color: '#d4af37', textDecoration: 'none' }}>Contact Page</Link>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
