import { adjustHue, transparentize } from "color2k";
import { Fragment, useId } from "react";

type Segments = string[] | Record<string, string>;

interface SegmentedControlProps {
  segments: Segments;
  value: string;
  onChange: (value: string) => void;
  color: string;
  label: string;
}

const SegmentedControl = ({ segments, value, onChange, color, label }: SegmentedControlProps) => {
  const id = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.checked) {
      onChange(e.currentTarget.value);
    }
  };

  const segmentsArray = Array.isArray(segments)
    ? segments.map(s => ({ id: s, label: s }))
    : Object.entries(segments).map(([k, v]) => ({ id: k, label: v || k }));

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
      className="relative flex rounded border-[3px] border-solid focus-within:outline"
      style={{ borderColor: inactiveColor }}
      role="radiogroup"
      aria-labelledby={`${id}-label`}
    >
      <span id={`${id}-label`} className="sr-only">
        {label}
      </span>
      <div
        className="pointer-events-none absolute m-[-3px] h-[calc(100%+6px)] rounded transition-all duration-200"
        style={floaterStyle}
        aria-hidden="true"
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
              className="peer sr-only"
            />
            <label
              htmlFor={inputId}
              className="z-0 mx-[-3px] my-0 flex-[1_0_auto] cursor-pointer p-1 text-center font-bold transition-all duration-200"
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

export default SegmentedControl;
