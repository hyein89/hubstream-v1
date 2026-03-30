import { supabase } from '@/lib/supabase';
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
    title: `DMCA Copyright Policy | ${siteName}`,
    description: `Official Digital Millennium Copyright Act (DMCA) Policy for ${siteName}. Learn how to report copyright infringement and submit takedown notices.`,
    alternates: {
      canonical: `${domainURL}/dmca`,
    },
    openGraph: {
      title: `DMCA Policy - ${siteName}`,
      description: `Official DMCA Copyright Policy and reporting guidelines for ${siteName}.`,
      url: `${domainURL}/dmca`,
      siteName: siteName,
      locale: 'en_US',
      type: 'website',
    }
  };
}

export default async function DmcaPolicy() {
  // Tarik data Sitename dari database
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
        
        <h1 style={{ color: '#fff', fontSize: '42px', marginBottom: '5px', letterSpacing: '-0.5px' }}>DMCA Copyright Policy</h1>
        <p style={{ color: '#8b949e', marginBottom: '50px', fontSize: '14px' }}>Last Updated and Effective: March 2026</p>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>1. Introduction and Policy Statement</h2>
          <p style={{ marginBottom: '15px' }}>
            {siteName} respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act of 1998, the text of which may be found on the U.S. Copyright Office website, {siteName} will respond expeditiously to claims of copyright infringement committed using our service and/or website (the "Site") if such claims are reported to our Designated Copyright Agent identified below.
          </p>
          <p>
            It is our strict policy to disable and/or terminate the accounts of users who repeatedly infringe or are repeatedly charged with infringing the copyrights or other intellectual property rights of others. As a video hosting platform, {siteName} acts as an Online Service Provider (OSP) and claims safe harbor from liability regarding user-generated content under the DMCA.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>2. Filing a DMCA Notice of Infringement</h2>
          <p style={{ marginBottom: '15px' }}>
            If you are a copyright owner, authorized to act on behalf of one, or authorized to act under any exclusive right under copyright, please report alleged copyright infringements taking place on or through the Site by completing a DMCA Notice of Alleged Infringement and delivering it to {siteName}'s Designated Copyright Agent.
          </p>
          <p style={{ marginBottom: '15px' }}>
            Upon receipt of a valid Notice, {siteName} will take whatever action, in its sole discretion, it deems appropriate, including removal of the challenged content from the Site and notifying the user who uploaded it.
          </p>
          <p style={{ marginBottom: '15px' }}>To file a valid DMCA Notice, you must provide the following information in writing:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><strong>Identification of the copyrighted work:</strong> Provide a detailed description of the copyrighted work that you claim has been infringed, or, if multiple copyrighted works are covered by a single notification, a representative list of such works.</li>
            <li><strong>Identification of the infringing material:</strong> Provide the exact URL(s) or link(s) on our Site where the allegedly infringing material is located. General search queries or domain names are not sufficient.</li>
            <li><strong>Your contact information:</strong> Provide your full legal name, mailing address, telephone number, and email address.</li>
            <li><strong>Good faith statement:</strong> Include the following statement: <em>"I have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law."</em></li>
            <li><strong>Perjury statement:</strong> Include the following statement: <em>"I swear, under penalty of perjury, that the information in the notification is accurate, and that I am the copyright owner or am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed."</em></li>
            <li><strong>Signature:</strong> Provide your physical or electronic signature.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>3. Filing a DMCA Counter-Notice</h2>
          <p style={{ marginBottom: '15px' }}>
            If you believe that your content that was removed (or to which access was disabled) is not infringing, or that you have the authorization from the copyright owner, the copyright owner's agent, or pursuant to the law, to upload and use the content, you may send a written Counter-Notice to the Designated Copyright Agent.
          </p>
          <p style={{ marginBottom: '15px' }}>The Counter-Notice must contain the following information:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><strong>Identification of the material:</strong> Describe the material that has been removed or to which access has been disabled and the specific URL at which the material appeared before it was removed or disabled.</li>
            <li><strong>Your contact information:</strong> Provide your name, address, telephone number, and email address.</li>
            <li><strong>Jurisdiction consent statement:</strong> Include a statement that you consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located, or if your address is outside of the United States, for any judicial district in which {siteName} may be found.</li>
            <li><strong>Service of process statement:</strong> Include a statement that you will accept service of process from the person who provided the original DMCA Notification or an agent of such person.</li>
            <li><strong>Good faith statement:</strong> Include the following statement: <em>"I swear, under penalty of perjury, that I have a good faith belief that the material was removed or disabled as a result of a mistake or misidentification of the material to be removed or disabled."</em></li>
            <li><strong>Signature:</strong> Provide your physical or electronic signature.</li>
          </ul>
          <p>
            If a Counter-Notice is received by the Designated Agent, {siteName} will send a copy of the Counter-Notice to the original complaining party informing that person that it may replace the removed content or cease disabling it in 10 business days. Unless the copyright owner files an action seeking a court order against the content provider, member or user, the removed content may be replaced, or access to it restored, in 10 to 14 business days or more after receipt of the Counter-Notice, at our sole discretion.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>4. Repeat Infringer Policy</h2>
          <p style={{ marginBottom: '15px' }}>
            In accordance with the DMCA and other applicable law, {siteName} has adopted a policy of terminating, in appropriate circumstances and at {siteName}'s sole discretion, the accounts of users who are deemed to be repeat infringers. {siteName} may also at its sole discretion limit access to the Site and/or terminate the accounts of any users who infringe any intellectual property rights of others, whether or not there is any repeat infringement.
          </p>
          <p>
            Any circumvention of our banning systems, such as creating new accounts after a termination for copyright violations, will result in immediate, permanent bans across all our network infrastructure.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#fff', fontSize: '24px', marginBottom: '15px' }}>5. Designated Copyright Agent</h2>
          <p style={{ marginBottom: '15px' }}>
            Please submit all DMCA Notices and Counter-Notices strictly to our Designated Copyright Agent via email for the fastest response time:
          </p>
          <div style={{ padding: '20px', background: '#161b22', borderLeft: '4px solid #da3633', marginTop: '20px' }}>
            <p style={{ margin: 0, color: '#fff' }}><strong>Attention:</strong> Copyright Agent / Legal Department</p>
            <p style={{ margin: '5px 0 0 0', color: '#58a6ff' }}>Email: dmca@{settings?.domain || 'domain.com'}</p>
          </div>
          <p style={{ marginTop: '20px', fontSize: '14px', color: '#8b949e' }}>
            <em>Note: Please allow up to 72 hours for our abuse team to process and investigate your claim. Sending multiple identical reports will delay the review process.</em>
          </p>
        </section>

      </main>

      {/* FOOTER KOMPONEN */}
      <Footer />
    </>
  );
}
