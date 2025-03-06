// ... existing code ...
// Line 12 - Replace React-style JSX with standard HTML
// Change from:
// <div style={{width : "100%", display : "flex", flexDirection : "column"}}>
// To:
const columnContainer = `<div style="width: 100%; display: flex; flex-direction: column">
  ${columnContent}
</div>`;
