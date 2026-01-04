import React from 'react';

export const LandingPage: React.FC = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Streamline Your Campus Recruitment
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            The ultimate platform connecting ambitious students, top-tier companies, and efficient administrators.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a href="/register" className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                Get Started
                            </a>
                            <a href="/login" className="text-sm font-semibold leading-6 text-gray-900">
                                Log in <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
