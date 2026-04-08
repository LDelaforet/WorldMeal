import Header from '@/components/Header';

export default function Profile() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Header currentPage="profile" />
            <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">My Profile</h1>

                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
                    <div className="mb-6 sm:mb-8">
                        <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl shrink-0">
                                👤
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 truncate">John Doe</h2>
                                <p className="text-xs sm:text-sm text-gray-600 truncate">john@example.com</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6 sm:pt-8">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Account Information</h3>
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        defaultValue="John Doe"
                                        className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        defaultValue="john@example.com"
                                        className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Bio</label>
                                    <textarea
                                        defaultValue="I love cooking and exploring new recipes!"
                                        rows={3}
                                        className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 mt-6 sm:mt-8 pt-6 sm:pt-8">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Change Password</h3>
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-gray-200">
                        <button className="flex-1 bg-primary text-white font-semibold py-2.5 sm:py-3 rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base active:scale-95 transform">
                            Save Changes
                        </button>
                        <button className="flex-1 bg-red-500 text-white font-semibold py-2.5 sm:py-3 rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base active:scale-95 transform">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
