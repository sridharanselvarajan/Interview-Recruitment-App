'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Mail, MapPin, MessageSquare, Phone, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "sriselvan05@gmail.com",
    gradient: "from-blue-500 to-indigo-600",
    href: "mailto:sriselvan05@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 9345888109",
    gradient: "from-emerald-500 to-teal-600",
    href: "tel:+919345888109",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "SECE, Coimbatore",
    gradient: "from-purple-500 to-pink-600",
    href: null,
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { name, email, message } = formData;
    const subject = `Contact Form Submission from ${name}`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
    window.location.href = `mailto:sriselvan05@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    setSubmitSuccess(true);
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-400/30 rounded-2xl blur-lg animate-pulse" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl">
                <MessageSquare className="h-7 w-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contact & Feedback</h1>
              <p className="text-gray-500 text-sm mt-0.5">We'd love to hear from you</p>
            </div>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in-up delay-100">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            const content = (
              <div
                className={`card-premium p-5 flex items-center gap-4 animate-fade-in-up`}
                style={{ animationDelay: `${index * 80 + 100}ms` }}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{info.label}</p>
                  <p className="font-semibold text-gray-800 text-sm mt-0.5">{info.value}</p>
                </div>
              </div>
            );
            return info.href
              ? <a key={index} href={info.href}>{content}</a>
              : <div key={index}>{content}</div>;
          })}
        </div>

        {/* Contact Form */}
        <div className="animate-fade-in-up delay-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
            <h2 className="font-bold text-xl text-gray-800">Send a Message</h2>
          </div>

          <div className="card-premium p-6 md:p-8">
            {submitSuccess && (
              <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 animate-scale-in">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-700 font-medium">
                  Your email client should open with the message prepared. If not, email us directly at{" "}
                  <a href="mailto:sriselvan05@gmail.com" className="underline">sriselvan05@gmail.com</a>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-gray-700">
                    Your Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-gray-700">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  required
                  className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-gray-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  We typically respond within 24 hours
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl btn-shimmer text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    : <Send className="w-4 h-4" />
                  }
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}