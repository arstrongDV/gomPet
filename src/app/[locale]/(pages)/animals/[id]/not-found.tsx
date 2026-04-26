'use client'

import Link from "next/link";



const NotFound = () => {

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, Page not found. <Link href={'/'}>Go back.. </Link></p>
    </div>
  );
};

export default NotFound;
