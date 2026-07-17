import PublicNavbar from "@/components/ui/shared/PublicNavbar";

const CommonLayout = ({ children } : { children: React.ReactNode }) => {
    return (
        <>  
            <PublicNavbar/>
            {children}
        </>
    );
};

export default CommonLayout;