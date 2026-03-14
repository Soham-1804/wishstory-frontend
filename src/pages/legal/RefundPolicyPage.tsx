import LegalLayout from './LegalLayout'
import { Link } from 'react-router-dom'

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

export default function RefundPolicyPage() {
  return (
    <LegalLayout
      tag="Legal"
      title="Refund Policy"
      subtitle="Our fair and transparent approach to refunds and revisions."
      lastUpdated="January 1, 2025"
      sections={[
        {
          heading: 'Our Commitment',
          body: (
            <>
              <P>At WishStory, every story is crafted by a human creative with care, time, and genuine emotional investment. We want you to be completely satisfied with your experience.</P>
              <P>Because each story is a custom, handcrafted product made specifically for you, our refund policy is structured to balance your satisfaction with the time our team invests in creating your story.</P>
            </>
          ),
        },
        {
          heading: 'Before Production Begins',
          body: (
            <>
              <P>If you wish to cancel your order before our team has begun working on your story (typically within 2 hours of payment), you are eligible for a full refund.</P>
              <P>To request a pre-production cancellation, email us at refunds@wishstory.in with your order ID as soon as possible. We process pre-production refunds within 5–7 business days.</P>
            </>
          ),
        },
        {
          heading: 'After Production Has Begun',
          body: (
            <>
              <P>Once our team has begun creating your story, we are unable to offer a full refund as significant time and creative effort has been invested. However, we offer the following:</P>
              <UL items={[
                'Free revisions: one round of revisions is included with every package, within 7 days of delivery.',
                'Partial refund: if you are genuinely dissatisfied with the final story and revisions have not resolved the issue, we will consider a partial refund of up to 50% at our discretion.',
                'Story redo: in cases of significant errors on our part (incorrect names, wrong occasion, etc.), we will redo the story at no additional charge.',
              ]} />
            </>
          ),
        },
        {
          heading: 'Delivery Delays',
          body: (
            <>
              <P>We strive to meet all stated delivery timelines. In the event that we fail to deliver your story within the promised window:</P>
              <UL items={[
                'Signature Story (24 hours): if delivery exceeds 36 hours from payment confirmation, you are eligible for a full refund.',
                'Luxe Film (12 hours): if delivery exceeds 24 hours from payment confirmation, you are eligible for a full refund.',
              ]} />
              <P>Delays caused by incomplete or unclear story submissions provided by the customer do not qualify for delivery delay refunds.</P>
            </>
          ),
        },
        {
          heading: 'Technical Issues',
          body: (
            <P>If you experience a technical issue that prevents you from accessing your delivered story link — such as a broken link, inaccessible page, or corrupted content — please contact us immediately. We will resolve the issue within 24 hours or, if unable to do so, issue a full refund.</P>
          ),
        },
        {
          heading: 'Non-Refundable Situations',
          body: (
            <>
              <P>Refunds will not be issued in the following situations:</P>
              <UL items={[
                'The story has been delivered and the revision window (7 days) has expired.',
                'You provided incomplete, inaccurate, or insufficient story details and the story was crafted based on what was provided.',
                'You changed your mind about the recipient, occasion, or theme after production has begun.',
                'Dissatisfaction due to subjective preferences that were not communicated in the original submission.',
                'The story was shared with the recipient and has already been viewed.',
              ]} />
            </>
          ),
        },
        {
          heading: 'Payment Processing',
          body: (
            <>
              <P>All refunds are processed through the original payment method via Razorpay. Refund timelines depend on your bank or card issuer:</P>
              <UL items={[
                'Credit / Debit cards: 5–10 business days.',
                'UPI: 1–3 business days.',
                'Net banking: 3–7 business days.',
              ]} />
              <P>We will send you a confirmation email once a refund has been initiated on our end.</P>
            </>
          ),
        },
        {
          heading: 'How to Request a Refund',
          body: (
            <>
              <P>To request a refund or revision, please:</P>
              <UL items={[
                'Email refunds@wishstory.in with subject: "Refund Request — [Your Order ID]"',
                'Include your order ID, the reason for your request, and any relevant details.',
                'Our team will respond within 1–2 business days.',
              ]} />
              <P>
                You can also reach us through our{' '}
                <Link to="/contact" className="text-wine hover:text-mauve underline underline-offset-2 transition-colors">
                  contact page
                </Link>.
              </P>
            </>
          ),
        },
        {
          heading: 'Questions',
          body: (
            <P>If you have any questions about this Refund Policy, please contact us at refunds@wishstory.in. We are committed to resolving any issues fairly and promptly.</P>
          ),
        },
      ]}
    />
  )
}
