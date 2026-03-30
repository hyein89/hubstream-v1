import { supabase } from '../../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';

// MANGGIL SEO DINAMIS (Otomatis ganti nama web)
export async function generateMetadata() {
  const { data: settings } = await supabase
    .from('settings')
    .select('sitename, domain')
    .eq('id', 1)
    .single();

  const siteName = settings?.sitename || 'SITENAME';
  const domainURL = settings?.domain ? `https://${settings.domain}` : 'https://domain.com';

  return {
    title: `Terms of Service | ${siteName}`,
    description: `Read the complete Terms of Service and User Agreement for ${siteName}. Learn about our policies, user guidelines, and terms of use for our video hosting platform.`,
    alternates: {
      canonical: `${domainURL}/terms`,
    },
    openGraph: {
      title: `Terms of Service - ${siteName}`,
      description: `Official Terms of Service for ${siteName}.`,
      url: `${domainURL}/terms`,
      siteName: siteName,
      locale: 'en_US',
      type: 'website',
    }
  };
}

export default async function TermsOfService() {
  // Tarik data Sitename dari database buat disisipin ke dalam teks hukumnya
  const { data: settings } = await supabase
    .from('settings')
    .select('sitename')
    .eq('id', 1)
    .single();

  const siteName = settings?.sitename || 'SITENAME';

  return (
    <>
      {/* PANGGIL CSS ASLI LO */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/style.css" precedence="default" />

      {/* HEADER KOMPONEN */}
      <Header sitename={siteName} />

      {/* MAIN CONTENT - TANPA BORDER, TANPA BOX. BERSIH & RAPIH */}
      <main style={{ 
        maxWidth: '800px', 
        margin: '60px auto', 
        padding: '0 20px', 
        color: '#c9d1d9', 
        lineHeight: '1.8', 
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'left'
      }}>
        
        <h1 style={{ color: '#fff', fontSize: '42px', marginBottom: '5px', letterSpacing: '-0.5px' }}>Terms of Service</h1>
        <p style={{ color: '#8b949e', marginBottom: '50px', fontSize: '14px' }}>Last Updated and Effective: March 2026</p>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>1. Acceptance of Terms</h2>
          <p style={{ marginBottom: '15px' }}>
            Welcome to {siteName}. By accessing, browsing, or using our video hosting, streaming, and sharing services (collectively referred to as the "Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must strictly refrain from using our platform.
          </p>
          <p>
            These Terms constitute a legally binding agreement between you (the "User") and {siteName}. We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>2. Description of Service</h2>
          <p style={{ marginBottom: '15px' }}>
            {siteName} provides an online platform that allows users to upload, host, manage, share, and stream digital video content. The Service includes our website, APIs, embedded video players, and any related applications. 
          </p>
          <p>
            We offer our services on an "AS IS" and "AS AVAILABLE" basis. We are constantly innovating and changing our Service, which means we may add, remove, or modify features, bandwidth limits, or storage capacities at our sole discretion, without prior notice to you.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>3. User Accounts and Security</h2>
          <p style={{ marginBottom: '15px' }}>
            While basic viewing may not require an account, uploading and managing content requires you to register. When creating an account, you agree to provide accurate, current, and complete information. You are solely responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>
          <p>
            {siteName} cannot and will not be liable for any loss or damage arising from your failure to comply with the above security requirements. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>4. Content Ownership and License</h2>
          <p style={{ marginBottom: '15px' }}>
            <strong>Your Content:</strong> You retain all of your ownership rights in the videos and content you upload to {siteName}. We do not claim any copyright over your original material.
          </p>
          <p style={{ marginBottom: '15px' }}>
            <strong>License to {siteName}:</strong> By uploading content to our platform, you grant {siteName} a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the content in connection with the Service and {siteName}'s business operations, including promoting and redistributing part or all of the Service.
          </p>
          <p>
            You represent and warrant that you have all necessary rights, licenses, consents, and permissions to grant the above licenses to {siteName} without infringing the rights of any third party.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>5. Prohibited Content and Conduct</h2>
          <p style={{ marginBottom: '15px' }}>
            To maintain a safe environment, you are strictly prohibited from uploading, posting, or transmitting any content that:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>Infringes on any third party's copyrights, trademarks, or other intellectual property rights.</li>
            <li>Contains explicitly unlawful material, including but not limited to child exploitation, non-consensual intimate imagery, or terrorism-related content.</li>
            <li>Promotes violence, hate speech, or discrimination based on race, ethnicity, religion, sexual orientation, or gender identity.</li>
            <li>Contains software viruses, malware, trojan horses, or any other computer code designed to interrupt, destroy, or limit the functionality of the Service.</li>
            <li>Involves spamming, phishing, or deceptive advertising schemes.</li>
          </ul>
          <p>
            {siteName} utilizes automated systems and human review to monitor content. We reserve the right to immediately remove any content and terminate the accounts of users who violate these guidelines without prior warning.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>6. Copyright and DMCA Policy</h2>
          <p style={{ marginBottom: '15px' }}>
            {siteName} respects the intellectual property of others and complies with the Digital Millennium Copyright Act (DMCA). If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible via the Service, please notify our copyright agent in writing.
          </p>
          <p>
            We operate a strict "repeat infringer" policy. Users who are found to repeatedly upload copyrighted material without authorization will have their accounts permanently terminated and all associated files purged from our servers.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>7. Advertisements and Monetization</h2>
          <p style={{ marginBottom: '15px' }}>
            The Service is supported by advertising revenue. By using {siteName}, you agree that we may place advertising, sponsorships, and promotions on, about, or in conjunction with your content. The manner, mode, and extent of such advertising are subject to change without specific notice to you.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>8. Data Retention and Deletion</h2>
          <p style={{ marginBottom: '15px' }}>
            While we strive to provide highly available infrastructure, {siteName} is not intended to be a secure backup service. We make no guarantees regarding the permanent retention of your files. 
          </p>
          <p>
            Inactive accounts, videos with zero views over an extended period, or files that violate our policies may be deleted automatically to free up server capacity. We highly recommend keeping personal backups of all content you upload to our platform.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>9. Disclaimer of Warranties</h2>
          <p style={{ marginBottom: '15px' }}>
            YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. {siteName.toUpperCase()} EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p>
            We make no warranty that (i) the Service will meet your requirements, (ii) the Service will be uninterrupted, timely, secure, or error-free, or (iii) the quality of any products, services, information, or other material obtained by you through the Service will meet your expectations.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>10. Limitation of Liability</h2>
          <p style={{ marginBottom: '15px' }}>
            YOU EXPRESSLY UNDERSTAND AND AGREE THAT {siteName.toUpperCase()} SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA OR OTHER INTANGIBLE LOSSES (EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES), RESULTING FROM: (I) THE USE OR THE INABILITY TO USE THE SERVICE; (II) UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR DATA; OR (III) ANY OTHER MATTER RELATING TO THE SERVICE.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>11. Indemnification</h2>
          <p style={{ marginBottom: '15px' }}>
            You agree to defend, indemnify, and hold harmless {siteName}, its affiliates, officers, directors, employees, and agents, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees) arising from: (i) your use of and access to the Service; (ii) your violation of any term of these Terms of Service; (iii) your violation of any third-party right, including without limitation any copyright, property, or privacy right; or (iv) any claim that your content caused damage to a third party.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>12. General Information</h2>
          <p style={{ marginBottom: '15px' }}>
            <strong>Governing Law:</strong> These Terms shall be governed by and construed in accordance with international digital business laws, without regard to its conflict of law provisions.
          </p>
          <p>
            <strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and {siteName} and govern your use of the Service, superseding any prior agreements between you and {siteName} (including, but not limited to, any prior versions of the Terms of Service).
          </p>
        </section>

      </main>

      {/* FOOTER KOMPONEN */}
      <Footer />
    </>
  );
}
