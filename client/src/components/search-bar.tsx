import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search recipes..." }: SearchBarProps) {
    return (
        <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-11 bg-white border-[#E5E5E0] rounded-full shadow-sm focus-visible:ring-1 focus-visible:ring-[#8FA792] text-base placeholder:text-muted-foreground/60 h-12"
                placeholder={placeholder}
            />
        </div>
    );
}
