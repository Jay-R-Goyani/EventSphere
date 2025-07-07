import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "What is EventSphere?",
        answer: "EventSphere is a platform designed to help students discover, join, and participate in events from universities and colleges across the world."
    },
    {
        question: "How can I register for an event?",
        answer: "To register, simply visit the event details page, click the 'Register' button, and follow the instructions to confirm your participation."
    },
    {
        question: "Are the events free to attend?",
        answer: "It depends on the event. Some events are free, while others may depend on which college you study, as same college students do not need to pay any registration fees.However registration fees is a matter completely under event organiser's hand so you nned to check the event details for more information."
    },
    {
        question: "Can I create my own event on EventSphere?",
        answer: "Yes! If you are an event organizer from a registered college, you can create and list your own event on the platform. Visit the 'Create Event' page to get started."
    },
    {
        question: "Is EventSphere available on mobile?",
        answer: "Currently, EventSphere is web-based. However, we are working on a mobile app for a more seamless experience."
    },
    {
        question: "How do I contact EventSphere support?",
        answer: "You can contact our support team by visiting the 'Contact Us' page, where you will find an email address."
    },
    {
        question: "How can I stay updated on new events?",
        answer: "You can visit tha page frequently as of now, nut don't worry, we are working on a feature where you can follow any college or domain and you will be notified by an email when they list an event."
    },
    {
        question: "Can I get a refund for event tickets?",
        answer: "Refund policies vary depending on the event organizer. You can refer to the event's terms and conditions for specific refund information. The Event Sphere do not hold any responsibility of any sort of Specific event policy."
    },
    {
        question: "How do I delete my EventSphere account?",
        answer: "To delete your account, go to the 'Settings' page in your profile and select 'Delete Account'. Please note that this action is irreversible."
    },
    {
        question: "Can I volunteer at events listed on EventSphere?",
        answer: "Yes! Many events allow students to volunteer. You can find volunteer opportunities in the event details. We are also working on to add a more detailed feature for this puspose where you can interact with different event organisers and network with like minded people."
    }
];

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAnswer = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white mt-12">
                {/* Hero Section */}
                <div className="container mx-auto px-6 py-28">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold mb-6 text-yellow-500">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Here are some of the most commonly asked questions about EventSphere. If you need more help, feel free to reach out to us.
                        </p>
                    </div>

                    {/* FAQ Accordion */}
                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer hover:bg-gray-700 transition-all duration-300"
                                onClick={() => toggleAnswer(index)}
                            >
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-semibold">{faq.question}</h3>
                                    <ChevronDown
                                        className={`w-6 h-6 transition-transform duration-300 ${openIndex === index ? "transform rotate-180" : ""}`}
                                    />
                                </div>
                                {openIndex === index && (
                                    <p className="mt-4 text-gray-400">{faq.answer}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
