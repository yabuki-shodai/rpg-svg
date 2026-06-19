type BouningenBoxProps = {
  className?: string;
  label?: string;
};

const BOUNINGEN_TEXT = `＼(･_･)＞＼(･_･)＞
       ) )             ) )
     /   \\           /   \\`;

const BouningenBox = ({
  className,
  label = "棒人間",
}: BouningenBoxProps) => {
  return (
    <pre
      aria-label={label}
      className={className}
      style={{
        margin: 0,
        color: "#ffffff",
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "24px",
        lineHeight: 1.2,
        whiteSpace: "pre",
      }}
    >
      {BOUNINGEN_TEXT}
    </pre>
  );
};

export default BouningenBox;
