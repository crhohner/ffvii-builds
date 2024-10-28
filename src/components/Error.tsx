export default function Error(props: { error: string | null }) {
  const { error } = props;
  return <>{error != null ? <div className="err">{error}</div> : null}</>;
}
