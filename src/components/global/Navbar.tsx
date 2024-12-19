"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Logo from "../../../public/logo.png";


import {
    Leaf,
    MessageSquare,
    Video,
    CloudRain,
    Brain,
    Newspaper,
} from "lucide-react";

// Navbar component
export default function Navbar() {
    const [toggleMenu, setToggleMenu] = useState(false);

    // Define the navigation links with empty URLs
    const navButtons = [
        { name: "AI Assistant", url: "" },
        { name: "Videos", url: "" },
        { name: "CO2 Calculator", url: "" },
        { name: "Quiz", url: "" },
        { name: "News", url: "" },
    ];

    return (
        <nav className="bg-green-700 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <Leaf className="h-8 w-8" />
                        <span className="font-bold text-xl">GreenQuest</span>
                    </div>
                    <div className="hidden md:flex space-x-8">
                        <a
                            href="#chatbot"
                            className="hover:text-green-200 transition-colors"
                        >
                            AI Assistant
                        </a>
                        <a
                            href="#videos"
                            className="hover:text-green-200 transition-colors"
                        >
                            Videos
                        </a>
                        <a
                            href="#calculator"
                            className="hover:text-green-200 transition-colors"
                        >
                            CO2 Calculator
                        </a>
                        <a
                            href="#quiz"
                            className="hover:text-green-200 transition-colors"
                        >
                            Quiz
                        </a>
                        <a
                            href="#news"
                            className="hover:text-green-200 transition-colors"
                        >
                            News
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
