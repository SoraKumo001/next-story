import Link from "next/link";
import { ReactNode } from "react";

export function LinkBox({
  enable,
  href,
  children
}: {
  enable?: boolean;
  href: string;
  children?: ReactNode;
}) {
  return (
    <>
      <style jsx>{`
        .link {
          display: inline-block;
          margin: 0.5em;
          padding: 0.5em;
          border-radius: 3px;
          background-color: ghostwhite;
          border: solid 1px;
          text-decoration: none;
        }
        .link:hover {
          background-color: aliceblue;
        }
        #disable {
          opacity: 0.3;
        }
      `}</style>
      {enable !== false ? (
        <Link href={href}>
          <a className="link">{children}</a>
        </Link>
      ) : (
        <a className="link" id="disable">
          {children}
        </a>
      )}
    </>
  );
}
