import { Bell } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

export const Navbar = () => {
    const { user } = useUser();

    const displayName = user?.firstName
        ? `${user.firstName}${user.lastName ? ' ' + user.lastName[0] + '.' : ''}`
        : user?.username ?? 'User';

    const avatarUrl = user?.imageUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id ?? 'default'}`;

    return (
        <header className="fixed top-0 right-0 left-0 md:left-64 h-20 bg-white/70 backdrop-blur-md z-40 px-8 flex items-center justify-between border-b border-gray-100/50">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                    Welcome Back, <span className="text-primary">{user?.firstName ?? 'User'}</span>
                </h1>
                <p className="text-sm text-gray-500">Track your health journey today</p>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 hover:shadow-lg transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent p-0.5 shadow-md">
                        <div className="w-full h-full rounded-full bg-white p-0.5 overflow-hidden">
                            <img src={avatarUrl} alt={displayName} className="w-full h-full rounded-full bg-gray-100 object-cover" />
                        </div>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm font-bold text-gray-700">{displayName}</p>
                        <p className="text-xs text-primary font-medium">Pro Member</p>
                    </div>
                </div>
            </div>
        </header>
    );
};
