export function BrainOrbit() {
  return (
    <div className="brain-visual" aria-label="A living token brain represented as a connected neural sphere">
      <div className="orbit orbit-one"><i /><i /><i /></div>
      <div className="orbit orbit-two"><i /><i /></div>
      <div className="brain-core">
        <span className="core-ring" />
        <span className="core-glyph">
          <i /><i /><i /><i /><i />
        </span>
      </div>
      <span className="orbit-label label-a">OBSERVE</span>
      <span className="orbit-label label-b">REASON</span>
      <span className="orbit-label label-c">PROPOSE</span>
      <span className="orbit-label label-d">SETTLE</span>
    </div>
  );
}
