import { User } from "@supabase/supabase-js";
import Link from "next/link";

type FooterProps = {
  user: User | null;
};

export default function Footer(props: FooterProps) {
  return (
    <footer>
      <Link href="mailto:admin@ffvii-savepoint.com">Give feedback!</Link>
      {props.user && (
        <Link style={{ color: "var(--error-color)" }} href="/delete-account">
          Delete account
        </Link>
      )}
    </footer>
  );
}
