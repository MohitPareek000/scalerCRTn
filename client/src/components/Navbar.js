import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <header className="bg-white/80 backdrop-blur sticky top-0 z-40 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <img src="https://assets.fp.scaler.com/seo/_next/static/media/scaler-light.6def257e.svg" alt="Scaler" className="h-6 w-auto" />
                    <span className="sr-only">Scaler</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                    <button className="hover:text-gray-900">AI Interviews</button>
                    <button className="hover:text-gray-900">How it Works</button>
                    <button className="hover:text-gray-900">Testimonials</button>
                    <button className="hover:text-gray-900">FAQs</button>
                </nav>
                <div className="flex items-center gap-3">
                    <a
                        href="https://www.scaler.com/ai-mock-interview"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-md bg-primary-600 text-white text-sm font-medium hover:bg-primary-700"
                    >
                        Request a Callback
                    </a>
                </div>
            </div>
        </header>
    );
}


