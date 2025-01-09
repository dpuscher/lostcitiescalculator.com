import { adjustHue, transparentize } from "color2k";
import { Fragment, useId } from "react";

type Segments = string[] | Record<string, string>;

interface SegmentedControlProps {
  segments: Segments;
  value: string;
  onChange: (value: string) => void;
  color: string;
}

export const SegmentedControl = ({ segments, value, onChange, color }: SegmentedControlProps) => {
  const id = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.checked) {
      onChange(e.currentTarget.value);
    }
  };

  const segmentsArray = Array.isArray(segments)
    ? segments.map(s => ({ id: s, label: s }))
    : Object.entries(segments).map(([k, v]) => ({ id: k, label: v }));

  // Which segment is active?
  const activeIndex = segmentsArray.findIndex(seg => seg.id === value);

  // Calculate derived colors & sizing
  const hueShift = adjustHue(color, 30);
  const inactiveColor = transparentize(color, 0.3);
  const activeTextColor = "#ffffff";
  const segmentWidth = `calc(${(100 / segmentsArray.length).toFixed(3)}% + 2px)`;

  // Floater highlight style (position + gradient)
  const floaterStyle: React.CSSProperties = {
    transform: `translateX(${(activeIndex * 100).toFixed(2)}%)`,
    width: segmentWidth,
    backgroundImage: `linear-gradient(${color}, ${hueShift})`,
  };

  return (
    <div
      className="relative flex border-solid border-[3px] rounded"
      style={{ borderColor: inactiveColor }}
    >
      <div
        className="absolute pointer-events-none h-[calc(100%+6px)] transition-all duration-200 m-[-3px] rounded"
        style={floaterStyle}
      />
      {segmentsArray.map(seg => {
        const inputId = `${id}-${seg.id}`;
        const isActive = seg.id === value;
        return (
          <Fragment key={seg.id}>
            <input
              id={inputId}
              name={id}
              type="radio"
              value={seg.id}
              checked={isActive}
              onChange={handleChange}
              className="hidden peer"
            />
            <label
              htmlFor={inputId}
              className="flex-[1_0_auto] text-center font-bold mx-[-3px] my-0 z-0 p-1 transition-all duration-200"
              style={{
                width: segmentWidth,
                color: isActive ? activeTextColor : inactiveColor,
              }}
            >
              {seg.label}
            </label>
          </Fragment>
        );
      })}
    </div>
  );
};
