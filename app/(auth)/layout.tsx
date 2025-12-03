const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full bg-background dark:bg-[#1F1F1F]">
            {children}
        </div>
    );
};

export default AuthLayout;
