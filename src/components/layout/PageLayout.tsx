
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Helmet } from 'react-helmet-async';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  canonicalUrl?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  title = "Good Business | Building Businesses That Transform Lives",
  description = "Good Business is a venture studio and consulting firm helping leaders scale, fix what's broken, and build companies that last.",
  canonicalUrl
}) => {
  // Base organization structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Good Business",
    "description": "A venture studio and consulting firm helping leaders scale, fix what's broken, and build companies that last.",
    "url": "https://goodbusiness.com"
  };

  return (
    <>
      <Helmet>
        {title && <title>{title}</title>}
        {description && <meta name="description" content={description} />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default PageLayout;
