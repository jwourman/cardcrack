"use client";

import { useState } from "react";
import { Mail, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1000));
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
      variant: "success",
    });
    setName(""); setEmail(""); setMessage("");
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-500">
          Have a question, issue, or feedback? We read every message.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { icon: Mail, title: "Email", body: "support@cardcrack.io" },
          { icon: Clock, title: "Response Time", body: "Within 24 hours" },
          { icon: MessageSquare, title: "Topic", body: "Billing, content, or technical" },
        ].map((item) => (
          <div key={item.title} className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mx-auto mb-3">
              <item.icon className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{item.title}</p>
            <p className="text-sm font-medium text-gray-700">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Tell us how we can help..."
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full gap-2">
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  );
}
