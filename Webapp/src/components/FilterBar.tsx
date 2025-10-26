import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "lucide-react";

interface FilterBarProps {
  selectedRole: string;
  selectedDateRange: string;
  onRoleChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;
}

export function FilterBar({
  selectedRole,
  selectedDateRange,
  onRoleChange,
  onDateRangeChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm mb-2 text-gray-600">Ruolo Specifico</label>
        <Select value={selectedRole} onValueChange={onRoleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Seleziona ruolo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti i ruoli</SelectItem>
            <SelectItem value="senior-backend">Senior Backend Engineer</SelectItem>
            <SelectItem value="frontend-dev">Frontend Developer</SelectItem>
            <SelectItem value="data-scientist">Data Scientist</SelectItem>
            <SelectItem value="product-manager">Product Manager</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm mb-2 text-gray-600">Intervallo di Date</label>
        <Select value={selectedDateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Seleziona intervallo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Ultimi 7 giorni</SelectItem>
            <SelectItem value="30d">Ultimi 30 giorni</SelectItem>
            <SelectItem value="90d">Ultimi 90 giorni</SelectItem>
            <SelectItem value="custom">Personalizzato</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
