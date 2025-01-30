import { CATEGORY_CONFIG } from "@/components/circuit/constants";

export const ChildHeader = ({ data }) => {
  const { category } = data;
  const { icon: Icon, iconColor, backgroundColor } = CATEGORY_CONFIG[category];

  return (
    <div
      className={`flex justify-between items-center h-1/3 px-3 py-1 text-black font-medium rounded-t-xl ${backgroundColor}`}
    >
      <span className="tracking-wide">{category}</span>
      <Icon className={`${iconColor}`} data-testid={`${category}-icon`} />
    </div>
  );
};
