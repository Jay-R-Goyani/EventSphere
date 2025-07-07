import React from "react";
// import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Film, Heart, Users, Code, Github, Twitter } from "lucide-react";
import Jay from "../../../public/assets/images/Jay_SE.jpg";
import Smit from "../../../public/assets/images/Smit_SE.jpg";
import DD from "../../../public/assets/images/DD_SE.jpg";
import Kathan from "../../../public/assets/images/Kathan_SE.jpg";

const techStack = [
    { name: "React", iconSrc: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
    { name: "JavaScript", iconSrc: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" },
    { name: "Tailwind CSS", iconSrc: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" },
    { name: "Node.js", iconSrc: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" },
    { name: "MongoDB", iconSrc: "https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg" },
    { name: "Cloudinary", iconSrc: "https://res.cloudinary.com/demo/image/upload/cloudinary_logo.png" },
];

export const AboutUs = () => {
    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
                {/* Hero Section */}
                <div className="container mx-auto px-6 py-28">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold mt-12 mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text animate-pulse">
                            About Us
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            We're passionate about making the campus events vibrant and happening.
                            With over 1000+ events from 100+ campuses, we have come a long way and
                            now it's your turn to show the world what your campus got!
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        <FeatureCard
                            icon={<Film className="w-10 h-10 text-purple-400" />}
                            title="Comprehensive Event Listings"
                            description="Access a wide variety of college events, from cultural festivals to tech workshops, complete with detailed schedules, descriptions, and participant information."
                        />
                        <FeatureCard
                            icon={<Heart className="w-10 h-10 text-pink-400" />}
                            title="Personalized Event Experience"
                            description="Discover and bookmark events that align with your interests, with recommendations tailored to your preferences and past participation."
                        />
                        <FeatureCard
                            icon={<Users className="w-10 h-10 text-blue-400" />}
                            title="Community"
                            description="Join discussions, share reviews, and connect with other enthusiasts"
                        />
                    </div>

                    {/* Team Section */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            Meet Our Team
                        </h2>
                        <div className="grid grid-cols-4 gap-10">
                            <a href="https://github.com/Jay-R-Goyani" target="_blank" rel="noopener noreferrer">
                                <TeamMember image={Jay} name="Jay" />
                            </a>
                            
                            <a href="https://github.com/202201162-Smit" target="_blank" rel="noopener noreferrer">
                                <TeamMember image={Smit} name="Smit" />
                            </a>
                            <a href="https://github.com/202201150-Dhrudeep" target="_blank" rel="noopener noreferrer">
                                <TeamMember image={DD} name="Dhrudeep" />
                            </a>
                            <a href="https://github.com/Kathan-Kadiya" target="_blank" rel="noopener noreferrer">
                                <TeamMember image={Kathan} name="Kathan" />
                            </a>
                            
                        </div>


                    </div>

                    {/* Tech Stack */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-center mb-12">Built With Modern Tech</h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            {techStack.map((tech) => (
                                <TechItem key={tech.name} iconSrc={tech.iconSrc} name={tech.name} />
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="text-center text-gray-400">
                        <div className="flex justify-center gap-6 mb-8">
                        <a
                            href="https://github.com/Jay-R-Goyani/EventSphere"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-purple-400 transition-colors"
                        >
                            <Github className="w-8 h-8" />
                        </a>
                            
                        </div>
                        <p>© All rights reserved.</p>
                    </footer>
                </div>
            </div>
            <Footer />
        </div>
    );
};

function FeatureCard({ icon, title, description }) {
    return (
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    );
}

function TeamMember({ image, name, role }) {
    return (
        <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <img
                src={image}
                alt={name}
                className="w-36 h-36 rounded-full mx-auto mb-4 object-cover border-4 border-yellow-500 shadow-lg"
            />
            <h3 className="text-lg font-bold">{name}</h3>
            <p className="text-gray-400">{role}</p>
        </div>
    );
}

function TechItem({ iconSrc, name }) {
    return (
        <div className="flex items-center gap-2 bg-gray-800 px-5 py-3 rounded-full shadow-md hover:shadow-lg hover:border hover:border-purple-400 transition-all duration-300">
            <img src={iconSrc} alt={`${name} logo`} className="w-8 h-8" />
            <span className="text-white">{name}</span>
        </div>
    );
}
