import { supabase } from '../../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';

// MANGGIL SEO DINAMIS
export async function generateMetadata() {
  const { data: settings } = await supabase
    .from('settings')
    .select('sitename, domain')
    .eq('id', 1)
    .single();

  const siteName = settings?.sitename || 'SITENAME';
  const domainURL = settings?.domain ? `https://${settings.domain}` : 'https://domain.com';

  return {
    title: `Privacy Policy | ${siteName}`,
    description: `Read the official Privacy Policy for ${siteName}. Understand how we collect, use, and protect your personal data and information while using our video hosting platform.`,
    alternates: {
      canonical: `${domainURL}/privacy`,
    },
    openGraph: {
      title: `Privacy Policy - ${siteName}`,
      description: `Official Privacy Policy and Data Protection guidelines for ${siteName}.`,
      url: `${domainURL}/privacy`,
      siteName: siteName,
      locale: 'en_US',
      type: 'website',
    }
  };
}

export default async function PrivacyPolicy() {
  // Tarik data Sitename dari database buat disisipin ke dalam teks hukum
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

      {/* MAIN CONTENT - BERSIH, RAPI, TEKS MURNI */}
      <main style={{ 
        maxWidth: '800px', 
        margin: '60px auto', 
        padding: '0 20px', 
        color: '#c9d1d9', 
        lineHeight: '1.8', 
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'left'
      }}>
        
        <h1 style={{ color: '#fff', fontSize: '42px', marginBottom: '5px', letterSpacing: '-0.5px' }}>Privacy Policy</h1>
        <p style={{ color: '#8b949e', marginBottom: '50px', fontSize: '14px' }}>Last Updated and Effective: March 2026</p>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>1. Introduction</h2>
          <p style={{ marginBottom: '15px' }}>
            Welcome to {siteName}. We respect your privacy and are deeply committed to protecting your personal data. This Privacy Policy outlines how we collect, use, process, and disclose your information when you access or use our video hosting, streaming, and sharing platform (the "Service").
          </p>
          <p>
            By using {siteName}, you consent to the data practices described in this policy. If you disagree with any part of this Privacy Policy, you must immediately discontinue your use of our Service.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>2. Information We Collect</h2>
          <p style={{ marginBottom: '15px' }}>
            We collect various types of information to provide and continuously improve our Service to you:
          </p>
          <p style={{ marginBottom: '15px' }}>
            <strong>Personal Data:</strong> While using our Service, especially during account registration or communication with our support team, we may ask you to provide certain personally identifiable information. This may include, but is not limited to, your email address, username, and contact information.
          </p>
          <p style={{ marginBottom: '15px' }}>
            <strong>Usage Data:</strong> We automatically collect information on how the Service is accessed and used. This Usage Data may include your computer's Internet Protocol (IP) address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
          </p>
          <p>
            <strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, VAST tags, and similar tracking technologies to track activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>3. How We Use Your Data</h2>
          <p style={{ marginBottom: '15px' }}>
            {siteName} uses the collected data for various indispensable business purposes:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>To provide, maintain, and monitor the usage of our Service.</li>
            <li>To manage your account and provide customer support.</li>
            <li>To deliver targeted advertising, marketing, and promotional materials that may be of interest to you.</li>
            <li>To detect, prevent, and address technical issues, fraud, or illegal activities.</li>
            <li>To fulfill our legal and regulatory obligations.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>4. Third-Party Advertising and Analytics</h2>
          <p style={{ marginBottom: '15px' }}>
            To keep our Service free for users, {siteName} relies on advertising revenue. We partner with third-party ad networks and exchanges that may use cookies, web beacons, and other tracking technologies to collect information about your activities on our website and other sites across the internet. 
          </p>
          <p>
            This information is used to provide you with targeted advertisements (including banner ads, pre-roll video ads, and pop-unders) based on your interests. These third-party vendors have their own privacy policies addressing how they use such information, and {siteName} accepts no responsibility or liability for their privacy practices.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>5. Data Disclosure and Sharing</h2>
          <p style={{ marginBottom: '15px' }}>
            We do not sell your Personal Data. However, we may share or disclose your information in the following situations:
          </p>
          <p style={{ marginBottom: '15px' }}>
            <strong>Law Enforcement:</strong> Under certain circumstances, {siteName} may be required to disclose your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).
          </p>
          <p>
            <strong>Business Transactions:</strong> If {siteName} is involved in a merger, acquisition, or asset sale, your Personal Data may be transferred as a business asset. We will provide notice before your Personal Data is transferred and becomes subject to a different Privacy Policy.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>6. Data Security</h2>
          <p style={{ marginBottom: '15px' }}>
            The security of your data is of utmost importance to us. We employ commercially acceptable physical, electronic, and managerial procedures to safeguard and secure the information we collect online. However, please remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use enterprise-grade means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>7. Your Data Protection Rights (GDPR & CCPA)</h2>
          <p style={{ marginBottom: '15px' }}>
            Depending on your location, you may have specific rights regarding your personal information:
          </p>
          <p style={{ marginBottom: '15px' }}>
            <strong>European Economic Area (EEA) Residents:</strong> Under the General Data Protection Regulation (GDPR), you have the right to access, rectify, or erase your personal data, as well as the right to restrict or object to certain processing of your data.
          </p>
          <p>
            <strong>California Residents:</strong> Under the California Consumer Privacy Act (CCPA), you have the right to request access to the specific pieces of personal information we have collected about you, the right to request deletion of your information, and the right to opt-out of the "sale" of your personal information (note: we do not sell your personal data).
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>8. Children's Privacy</h2>
          <p style={{ marginBottom: '15px' }}>
            Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Child has provided us with Personal Data, please contact us immediately. If we become aware that we have collected Personal Data from children without verification of parental consent, we take strict steps to remove that information from our servers.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>9. Changes to This Privacy Policy</h2>
          <p style={{ marginBottom: '15px' }}>
            We may update our Privacy Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

      </main>

      {/* FOOTER KOMPONEN */}
      <Footer />
    </>
  );
}
