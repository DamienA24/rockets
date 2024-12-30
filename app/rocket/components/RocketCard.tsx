import Image from "next/image";
import { RocketCardProps } from "../types/index";
import { Card, CardDescription, CardTitle } from "./ui/Card";

export default function RocketCard({
  name,
  description,
  image,
  isSelected,
  onSelect,
}: RocketCardProps) {
  return (
    <Card
      className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-lg ${
        isSelected
          ? "bg-secondary border-primary"
          : "border-gray-200 hover:border-primary"
      }`}
      onClick={onSelect}
    >
      <div className="relative w-full h-48 mb-4">
        <Image
          src={image}
          alt={name}
          className="object-contain"
          fill
          priority
        />
      </div>
      <CardTitle
        className={`text-xl font-bold mb-2 ${isSelected ? "text-primary" : ""}`}
      >
        {name}
      </CardTitle>
      <CardDescription className="text-white">{description}</CardDescription>
    </Card>
  );
}
