export default function Box({ displayText, background, border }) {
  return (
    <div className="box" style={{ background, border }}>
      {displayText}
    </div>
  );
}
