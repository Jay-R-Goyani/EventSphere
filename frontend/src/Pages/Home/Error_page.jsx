import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export const ErrorPage = () => {
    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col items-center justify-center">
                {/* Error Message Section */}
                <div className="text-center">
                    <h1 className="text-9xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text animate-pulse">
                        404
                    </h1>
                    <h2 className="text-4xl font-bold mb-6">Error</h2>
                    <p className="text-xl text-gray-300 max-w-md mx-auto leading-relaxed">
                        The page you are looking for is not available.
                    </p>
                </div>

                {/* Home Button */}
                <div className="mt-10">
                    <a
                        href="/"
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300"
                    >
                        Back to Home
                    </a>
                </div>
            </div>
            <Footer />
        </div>
    );
};

// Export default if needed for routing
// export default ErrorPage;