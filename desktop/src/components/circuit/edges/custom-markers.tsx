import { ACTIVATION_COLOR, REPRESSION_COLOR } from "@/components/circuit/constants";

export const CustomMarkers = () => {
  return (
    <svg style={{ position: "absolute", top: 0, left: 0 }} aria-hidden="true">
      <defs>
        <marker id="Repression" viewBox="0 0 10 10" markerWidth={8} markerHeight={8} refX={5} refY={5} orient="0">
          <path d="M0,5 L10,5" stroke={REPRESSION_COLOR} strokeWidth="1.5" fill="none" />
        </marker>
        <marker id="Activation" viewBox="0 0 10 10" markerWidth={8} markerHeight={6} refX={5} refY={5} orient="auto">
          <polyline
            points="0,0 6,5 0,10"
            stroke={ACTIVATION_COLOR}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </marker>
      </defs>
    </svg>
  );
};
