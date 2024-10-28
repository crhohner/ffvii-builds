import Link from "next/link";
export default function ErrorPage() {
  return (
    <div>
      <h1>An error occured :(</h1>
      <Link href="/">Return Home</Link>
    </div>
  );
}
