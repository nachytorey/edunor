export function EdunorLogo() {
  return (
    <div className="flex flex-col items-start leading-none">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
        .edunor-text {
          font-family: 'Righteous', 'Impact', sans-serif;
          font-size: clamp(1.5rem, 6vw, 2.5rem);
          font-weight: 900;
          letter-spacing: -2px;
          line-height: 0.95;
        }
        .nautica-text {
          font-family: 'Righteous', 'Impact', sans-serif;
          font-size: clamp(0.9rem, 4vw, 1.2rem);
          font-weight: 900;
          letter-spacing: 2px;
          text-align: right;
          line-height: 1;
        }
      `}</style>
      <span className="edunor-text text-primary">EDUNOR</span>
      <span className="nautica-text text-primary">NÁUTICA</span>
    </div>
  )
}
