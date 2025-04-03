
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageLayout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gb-dark mb-6">404</h1>
          <p className="text-2xl text-gb-dark/80 mb-8">
            Oops! We couldn't find the page you're looking for.
          </p>
          <Button asChild className="btn-primary">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
