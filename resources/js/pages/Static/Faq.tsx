import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import MainLayout from '@/layouts/MainLayout';
import { Head } from '@inertiajs/react';

export default function Faq() {
  const faqs = [
    {
      question: "How do I purchase an artwork?",
      answer: "You can purchase artworks directly through our website. For originals, we recommend contacting us via WhatsApp to confirm availability and shipping details. Prints and digital downloads can be purchased instantly."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship prints and original artworks worldwide. Shipping costs and delivery times vary depending on your location and the size of the artwork."
    },
    {
      question: "What is the return policy?",
      answer: "We offer a 14-day return policy for printed artworks if they arrive damaged. Original artworks are final sale unless there is a significant discrepancy in the description."
    },
    {
      question: "Are the prints limited edition?",
      answer: "Most of our prints are open edition, but we do offer select limited edition runs. Check the product description for specific details."
    },
     {
      question: "Can I commission a custom piece?",
      answer: "Yes, many of our artists accept commissions. Please contact us with your requirements and we will connect you with the right artist."
    }
  ];

  return (
    <MainLayout>
      <Head title="FAQ" />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-3xl">
        <h1 className="font-heading text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-medium text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </MainLayout>
  );
}
