import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>Page Not Found :(</h1>
      <br />
      <Link href="/">Return Home</Link>
    </div>
  );
}
