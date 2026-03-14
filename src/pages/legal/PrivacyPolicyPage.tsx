import LegalLayout from './LegalLayout'

const P = ({ children }: { children: React.ReactNode }) => <p>{children}</p>
const UL = ({ items }: { items: string[] }) => (
  <ul className="space-y-1.5 list-none">
    {items.map(item => (
      <li key={item} className="flex items-start gap-2">
        <span className="text-gold mt-1 text-[10px] flex-shrink-0">—</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
)

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      tag="Legal"
      title="Privacy Policy"
      subtitle="How WishStory collects, uses, and protects your personal information."
      lastUpdated="January 1, 2025"
      sections={[
        {
          heading: 'Introduction',
          body: (
            <>
              <P>WishStory ("we", "us", or "our") operates at wishstory.in and is committed to protecting the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</P>
              <P>By using WishStory, you consent to the data practices described in this policy. If you do not agree with the terms of this policy, please do not access the site or use our services.</P>
            </>
          ),
        },
        {
          heading: 'Information We Collect',
          body: (
            <>
              <P>We collect information you provide directly to us, including:</P>
              <UL items={[
                'Account information: your full name, email address, and password when you register.',
                'Story content: recipient names, occasion types, personal memories, descriptions, and any photos you upload.',
                'Payment information: billing details processed securely through Razorpay. We never store your card numbers on our servers.',
                'Communications: messages you send to our support team.',
              ]} />
              <P>We also collect certain information automatically when you visit our site, including your IP address, browser type, device information, pages visited, and time spent on pages.</P>
            </>
          ),
        },
        {
          heading: 'How We Use Your Information',
          body: (
            <>
              <P>We use the information we collect to:</P>
              <UL items={[
                'Create and manage your WishStory account.',
                'Process your story orders and payments.',
                'Craft the cinematic story pages you have commissioned.',
                'Send you transactional emails — order confirmations, story delivery notifications, and account updates.',
                'Respond to your support enquiries.',
                'Improve and personalise the WishStory experience.',
                'Detect and prevent fraudulent transactions.',
                'Comply with legal obligations.',
              ]} />
            </>
          ),
        },
        {
          heading: 'Photos and Story Content',
          body: (
            <>
              <P>Photos you upload are stored securely on Cloudinary, a third-party cloud storage service, and are used solely for the purpose of crafting your commissioned story. Our team accesses uploaded photos only for story creation purposes.</P>
              <P>Story content — including your personal descriptions, memories, and recipient details — is treated as highly sensitive. We will never share this content with third parties for marketing or advertising purposes.</P>
              <P>After your story is delivered, uploaded photos and content are retained for up to 90 days to allow for revisions or re-delivery, after which they may be deleted from our servers at your request.</P>
            </>
          ),
        },
        {
          heading: 'Information Sharing and Disclosure',
          body: (
            <>
              <P>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</P>
              <UL items={[
                'Service providers: Razorpay (payments), Cloudinary (image storage), and our email provider — all bound by confidentiality agreements.',
                'Legal requirements: if required by law, court order, or governmental authority.',
                'Business transfers: in the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.',
                'With your explicit consent: for any other purpose disclosed to you at the time of collection.',
              ]} />
            </>
          ),
        },
        {
          heading: 'Data Security',
          body: (
            <>
              <P>We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. These include:</P>
              <UL items={[
                'All passwords are hashed using bcrypt before storage.',
                'All data transmission is encrypted via SSL/TLS.',
                'Payment processing is handled entirely by Razorpay and never touches our servers.',
                'Access to your story data is restricted to you and authorised WishStory team members only.',
              ]} />
              <P>No method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.</P>
            </>
          ),
        },
        {
          heading: 'Cookies',
          body: (
            <>
              <P>WishStory uses minimal cookies solely for session management and authentication. We do not use third-party advertising cookies or tracking cookies.</P>
              <P>You can instruct your browser to refuse all cookies or indicate when a cookie is being sent. However, if you do not accept cookies, some features of the service may not function properly.</P>
            </>
          ),
        },
        {
          heading: 'Your Rights',
          body: (
            <>
              <P>You have the right to:</P>
              <UL items={[
                'Access the personal information we hold about you.',
                'Request correction of inaccurate or incomplete data.',
                'Request deletion of your account and associated data.',
                'Withdraw consent for optional data processing at any time.',
                'Lodge a complaint with a supervisory authority.',
              ]} />
              <P>To exercise any of these rights, contact us at privacy@wishstory.in. We will respond within 14 business days.</P>
            </>
          ),
        },
        {
          heading: "Children's Privacy",
          body: (
            <P>WishStory is not directed at individuals under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately and we will delete it.</P>
          ),
        },
        {
          heading: 'Changes to This Policy',
          body: (
            <P>We may update this Privacy Policy from time to time. We will notify you of any significant changes by email or by posting a prominent notice on our website. Your continued use of WishStory after the effective date of changes constitutes your acceptance of the updated policy.</P>
          ),
        },
        {
          heading: 'Contact Us',
          body: (
            <>
              <P>If you have any questions about this Privacy Policy or our data practices, please contact us:</P>
              <UL items={[
                'Email: privacy@wishstory.in',
                'Website: wishstory.in/contact',
                'Response time: within 2 business days',
              ]} />
            </>
          ),
        },
      ]}
    />
  )
}
