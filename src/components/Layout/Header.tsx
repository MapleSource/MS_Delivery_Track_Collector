import React from "react";
import Head from "next/head";

interface HeaderProps {
  title: string;
  metaDescription?: string;
  favicon?: string;
}

const Header: React.FC<HeaderProps> = ({ title, metaDescription, favicon }) => {
  const fullTitle = `${title} | Runner`;

  return (
    <header>
      <Head>
        <title>{fullTitle}</title>
        <meta
          name="description"
          content={metaDescription ? metaDescription : ""}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={favicon ? favicon : "/favicon.ico"} />
      </Head>
    </header>
  );
};

export default Header;
