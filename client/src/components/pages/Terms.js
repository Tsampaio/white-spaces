import React from 'react';
import SecondHeader from '../partials/SecondHeader';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './Terms.module.css';

const Terms = () => {
  return (
    <>
      <SecondHeader />
			<div className={styles.privacyCtn}>
        <Container className={styles.divCard}>
          <Row>
            <Col>
              <h1 className={styles.privacyMainTitle}>Terms of Use</h1>
             
              <p>By accessing this School, you are agreeing to be bound by these Terms of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this School are protected by applicable copyright and trademark law.</p>

              <h2 className={styles.privacySecondTitle}>Use License</h2>

              <p>Permission is granted to temporarily download one copy of any downloadable materials on the School’s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul>
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial)</li>
                <li>attempt to decompile or reverse engineer any software contained on the School’s web site</li>
                <li>remove any copyright or other proprietary notations from the materials or</li>
                <li>transfer the materials to another person or 'mirror' the materials on any other server.</li>
              </ul>
              <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by Company at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</p>

              <h2 className={styles.privacySecondTitle}>Disclaimer</h2>
              <p>The materials on the School’s website are provided 'as is'. The School makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, the School does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</p>
        
              <h2 className={styles.privacySecondTitle}>Limitations</h2>
              <p>In no event shall the School be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the School’s website, even if the School or an authorized of the School has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>

              <h2 className={styles.privacySecondTitle}>Revisions and Errata</h2>
              <p>The materials appearing on the School’s website may include technical, typographical, or photographic errors. The School does not warrant that any of the materials on its web site are accurate, complete, or current. The School may make changes to the materials contained on its web site at any time without notice. The School does not, however, make any commitment to update the materials.</p>

              <h2 className={styles.privacySecondTitle}>Links</h2>
              <p>The School has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by the School of the site. Use of any such linked website is at the user's own risk.</p>
            
              <h2 className={styles.privacySecondTitle}>Site Terms of Use Modifications</h2>
              <p>The School may revise these Terms of Use for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Use.</p>
            
              <h2 className={styles.privacySecondTitle}>Governing Law</h2>
              <p>Any claim relating to the School’s website shall be governed by the laws of the School Owner’s home jurisdiction without regard to its conflict of law provisions.</p>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default Terms;
