export default function Spinner({ size=18 }) {
  return <span style={{ display:"inline-block", width:size, height:size,
    border:"2px solid var(--border)", borderTop:"2px solid var(--primary)",
    borderRadius:"50%", animation:"spin .6s linear infinite" }} />;
}
