import Image from "next/image";
import { RocketCardProps } from "../types";

export default function RocketCard({
  name,
  description,
  image,
  isSelected,
  onSelect,
}: RocketCardProps) {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-lg ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-blue-300"
      }`}
      onClick={onSelect}
    >
      <div className="relative w-full h-48 mb-4">
        <Image src={image} alt={name} fill className="object-contain" />
      </div>
      <h3
        className={`text-xl font-bold mb-2 ${isSelected ? "text-black" : ""}`}
      >
        {name}
      </h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
