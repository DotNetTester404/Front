import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, ExternalLink, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { Spinner } from '../components/ui/Loaders';
import toast from 'react-hot-toast';

const FAQS = [
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping takes 3–5 business days. Expedited shipping (1–2 business days) is available at checkout. Free standard shipping on orders over $100.',
  },
  {
    q: 'Can I return products?',
    a: 'Yes! We offer a 30-day return policy for all unused items in original packaging. Simply contact our support team to initiate a return and receive a prepaid return label.',
  },
  {
    q: 'How do refunds work?',
    a: 'Refunds are processed within 3–5 business days after we receive your return. The amount will be credited back to your original payment method. You\'ll receive an email confirmation once processed.',
  },
  {
    q: 'How do I track my order?',
    a: 'Once your order ships, you\'ll receive an email with a tracking number. You can also view real-time order status on your My Orders page after logging in.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. All transactions are secured with 256-bit SSL encryption via Stripe.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'Orders can be modified or cancelled within 1 hour of placement. After that, the order enters processing and cannot be changed. Contact us immediately at support@shoplux.com.',
  },
  {
    q: 'Do you offer international shipping?',
    a: 'Currently we ship within the United States only. International shipping is coming soon! Sign up for our newsletter to be notified when it launches.',
  },
  {
    q: 'What if my item arrives damaged?',
    a: 'We\'re sorry to hear that! Please take a photo of the damage and contact us within 48 hours of delivery. We\'ll send a replacement or issue a full refund immediately.',
  },
];

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border border-primary-200 rounded-xl overflow-hidden transition-all duration-200 ${open ? 'shadow-soft' : ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-primary-50 transition-colors"
      >
        <span className="font-medium text-primary-900 pr-4">{faq.q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-primary-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-primary-500 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 pt-1 text-sm text-primary-600 leading-relaxed animate-fade-in">
          {faq.a}
        </div>
      )}
    </div>
  );
}

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    reset();
    setSending(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero */}
      <div className="bg-primary-950 py-16 text-center">
        <div className="page-container">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 animate-fade-up">How Can We Help?</h1>
          <p className="text-primary-400 text-lg max-w-xl mx-auto animate-fade-up">
            Find answers to common questions or reach out to our friendly support team.
          </p>
        </div>
      </div>

      <div className="page-container py-12 md:py-16">
        {/* FAQ */}
        <section className="mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title mb-2">Frequently Asked Questions</h2>
            <p className="text-primary-500 mb-8">Everything you need to know about ordering, shipping, and returns.</p>
            <div className="space-y-3">
              {FAQS.map((faq, i) => <FAQItem key={i} faq={faq} />)}
            </div>
          </div>
        </section>

        {/* Contact section */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Contact info */}
            <div>
              <h2 className="section-title mb-2">Get In Touch</h2>
              <p className="text-primary-500 mb-8">Still have questions? We'd love to hear from you.</p>

              <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-xl">
                  <div className="w-10 h-10 bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900 text-sm">Email Support</h3>
                    <p className="text-primary-500 text-sm mt-0.5">support@shoplux.com</p>
                    <p className="text-xs text-primary-400 mt-0.5">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-xl">
                  <div className="w-10 h-10 bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900 text-sm">Phone Support</h3>
                    <p className="text-primary-500 text-sm mt-0.5">+1 (555) 123-4567</p>
                    <p className="text-xs text-primary-400 mt-0.5">Mon–Fri, 9am–6pm EST</p>
                  </div>
                </div>

                <div className="p-4 bg-primary-50 rounded-xl">
                  <h3 className="font-semibold text-primary-900 text-sm mb-3">Follow Us</h3>
                  <div className="flex gap-3">
                    {[
                      { label: 'Facebook', handle: '/ShopLux' },
                      { label: 'Instagram', handle: '@shoplux' },
                      { label: 'X (Twitter)', handle: '@shoplux' },
                    ].map(({ label, handle }) => (
                      <a key={label} href="#" className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl hover:shadow-soft transition-all group">
                        <ExternalLink className="w-5 h-5 text-primary-600 group-hover:text-primary-900 transition-colors" />
                        <span className="text-[10px] font-medium text-primary-400">{handle}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="card p-6">
              <h3 className="font-bold text-primary-900 text-lg mb-5">Send a Message</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">First Name</label>
                    <input type="text" placeholder="Alex" className={`input ${errors.name ? 'input-error' : ''}`}
                      {...register('name', { required: 'Required' })} />
                    {errors.name && <p className="mt-1 text-xs text-error-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="label">Last Name</label>
                    <input type="text" placeholder="Johnson" className="input" {...register('lastName')} />
                  </div>
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" placeholder="you@example.com" className={`input ${errors.email ? 'input-error' : ''}`}
                    {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })} />
                  {errors.email && <p className="mt-1 text-xs text-error-500">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="label">Subject</label>
                  <input type="text" placeholder="How can we help?" className={`input ${errors.subject ? 'input-error' : ''}`}
                    {...register('subject', { required: 'Required' })} />
                  {errors.subject && <p className="mt-1 text-xs text-error-500">{errors.subject.message}</p>}
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea rows={4} placeholder="Tell us more…" className={`input resize-none ${errors.message ? 'input-error' : ''}`}
                    {...register('message', { required: 'Required', minLength: { value: 20, message: 'Min 20 characters' } })} />
                  {errors.message && <p className="mt-1 text-xs text-error-500">{errors.message.message}</p>}
                </div>
                <button type="submit" disabled={sending} className="btn-primary btn w-full btn-lg">
                  {sending ? <Spinner size="sm" className="text-white" /> : <Send className="w-4 h-4" />}
                  {sending ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
