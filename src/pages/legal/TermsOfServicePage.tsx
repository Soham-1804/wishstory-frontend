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

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      tag="Legal"
      title="Terms of Service"
      subtitle="Please read these terms carefully before using WishStory."
      lastUpdated="January 1, 2025"
      sections={[
        {
          heading: 'Agreement to Terms',
          body: (
            <>
              <P>By accessing or using WishStory at wishstory.in ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you do not have permission to access the Service.</P>
              <P>These Terms apply to all users of the Service, including without limitation users who are browsers, customers, merchants, or contributors of content.</P>
            </>
          ),
        },
        {
          heading: 'Description of Service',
          body: (
            <>
              <P>WishStory is a premium emotional storytelling platform. Users submit personal memories, photographs, and details, and our human team crafts a cinematic, personalised story page delivered via a private URL.</P>
              <P>WishStory is a human-powered service. All stories are created manually by our creative team. The platform is not automated — each story is unique and individually crafted.</P>
            </>
          ),
        },
        {
          heading: 'User Accounts',
          body: (
            <>
              <P>To use WishStory, you must create an account by providing accurate, complete, and current information. You are responsible for:</P>
              <UL items={[
                'Maintaining the confidentiality of your account password.',
                'All activity that occurs under your account.',
                'Notifying us immediately of any unauthorised use of your account.',
                'Ensuring your account information remains accurate and up to date.',
              ]} />
              <P>We reserve the right to terminate accounts that provide false information or violate these Terms.</P>
            </>
          ),
        },
        {
          heading: 'Acceptable Use',
          body: (
            <>
              <P>You agree to use WishStory only for lawful purposes. You must not:</P>
              <UL items={[
                'Submit content that infringes on any third party\'s intellectual property rights.',
                'Upload photographs of individuals without their consent.',
                'Submit content that is defamatory, obscene, hateful, or otherwise objectionable.',
                'Attempt to gain unauthorised access to any part of the Service or its related systems.',
                'Use the Service for any commercial purpose other than personal story commissions.',
                'Impersonate any person or entity or misrepresent your affiliation with any person or entity.',
                'Submit false, misleading, or fraudulent information.',
              ]} />
            </>
          ),
        },
        {
          heading: 'Content Ownership and Licence',
          body: (
            <>
              <P>You retain ownership of all content you submit to WishStory, including photographs and story descriptions. By submitting content, you grant WishStory a non-exclusive, worldwide, royalty-free licence to use, reproduce, and modify your content solely for the purpose of creating your commissioned story.</P>
              <P>The finished story pages, designs, typography, and cinematic layouts created by our team are the intellectual property of WishStory. You are granted a personal, non-transferable licence to share your story link with others.</P>
              <P>We will never use your personal content or photographs for marketing, advertising, or promotional purposes without your explicit written consent.</P>
            </>
          ),
        },
        {
          heading: 'Payments and Pricing',
          body: (
            <>
              <P>All prices are listed on our website and are subject to change. Current packages are:</P>
              <UL items={[
                'Signature Story — $15 (₹1,250 INR approx.): Delivery within 24 hours.',
                'Luxe Film — $35 (₹2,900 INR approx.): Delivery within 12 hours.',
              ]} />
              <P>Payment is processed securely through Razorpay. By completing a purchase, you authorise WishStory to charge your selected payment method for the amount indicated.</P>
              <P>All sales are final upon payment. Please refer to our Refund Policy for details on our refund and revision process.</P>
            </>
          ),
        },
        {
          heading: 'Delivery Timelines',
          body: (
            <>
              <P>Delivery times are estimates, not guarantees. WishStory will make every reasonable effort to deliver your story within the stated timeframe. Delivery times begin from the moment payment is confirmed and all required content has been submitted.</P>
              <P>Delays may occur due to incomplete story submissions, high demand periods, or technical issues. In the event of a significant delay, we will notify you by email.</P>
            </>
          ),
        },
        {
          heading: 'Revisions',
          body: (
            <>
              <P>We want you to love your story. Each package includes one round of revisions, which you may request within 7 days of delivery. Revision requests must be submitted via email or through your dashboard.</P>
              <P>Revisions are limited to adjustments to existing content. Requests for entirely new story concepts or substantially different content may be treated as new orders.</P>
            </>
          ),
        },
        {
          heading: 'Disclaimer of Warranties',
          body: (
            <P>WishStory is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components. The emotional response of story recipients cannot be guaranteed.</P>
          ),
        },
        {
          heading: 'Limitation of Liability',
          body: (
            <P>To the maximum extent permitted by applicable law, WishStory shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation loss of profits, data, or goodwill, resulting from your use of or inability to use the Service. Our total liability for any claim shall not exceed the amount you paid for the order giving rise to the claim.</P>
          ),
        },
        {
          heading: 'Termination',
          body: (
            <P>We reserve the right to suspend or terminate your account at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, third parties, or the integrity of the Service. Upon termination, your right to use the Service will immediately cease.</P>
          ),
        },
        {
          heading: 'Governing Law',
          body: (
            <P>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or your use of WishStory shall be subject to the exclusive jurisdiction of the courts of India.</P>
          ),
        },
        {
          heading: 'Changes to Terms',
          body: (
            <P>We reserve the right to modify these Terms at any time. We will provide notice of significant changes by email or via a notice on our website. Your continued use of WishStory after any such changes constitutes your acceptance of the new Terms.</P>
          ),
        },
        {
          heading: 'Contact',
          body: (
            <>
              <P>For questions about these Terms of Service, please contact us:</P>
              <ul className="space-y-1.5 list-none">
                {['Email: legal@wishstory.in', 'Website: wishstory.in/contact'].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-gold mt-1 text-[10px] flex-shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </>
          ),
        },
      ]}
    />
  )
}
