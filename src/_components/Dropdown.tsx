"use client";

import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
import { cn } from "@/lib/utils";

interface DropdownContextType {
  onSelect: (item: { label: string; value: string }) => void;
}
const DropdownContext = createContext<DropdownContextType | null>(null);

function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
}

function useElementWidth(ref: React.RefObject<HTMLElement>) {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, []);

  return width;
}

interface DropdownProps {
  children: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  arrowIcon?: React.ReactNode;
  initialValue?: string;
}

export const Dropdown = ({
  children,
  className,
  triggerClassName,
  arrowIcon,
  initialValue,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const width = useElementWidth(triggerRef);

  useClickOutside(dropdownRef, () => setOpen(false));

  const handleSelect = (item: { label: string; value: string }) => {
    setSelected(item);
    setOpen(false);
  };

  return (
    <DropdownContext.Provider value={{ onSelect: handleSelect }}>
      <div
        ref={dropdownRef}
        className="relative inline-block text-left"
        style={{ width: width ?? "auto" }}
      >
        <button
          ref={triggerRef}
          onClick={() => setOpen(!open)}
          className={cn(
            "bg-popover text-popover-foreground focus-visible:ring-ring flex w-full items-center justify-between gap-2 rounded-md border px-4 py-2 text-sm font-medium shadow-md transition-all focus-visible:ring",
            triggerClassName,
          )}
        >
          <span className="w-full max-w-full truncate" title={selected?.label}>
            {selected ? selected.label : initialValue}
          </span>
          {arrowIcon || (
            <ArrowSvg
              className={cn(
                "size-5 rotate-90 transition-transform",
                open && "-rotate-90",
              )}
            />
          )}
        </button>
        <div
          className={cn(
            "bg-popover text-popover-foreground absolute left-0 mt-2 scale-95 rounded-md border p-1 opacity-0 shadow-lg transition-all duration-150 ease-in-out",
            open && "scale-100 opacity-100",
            className,
          )}
          style={{
            minWidth: width ?? "auto",
            width: width ?? "auto",
            maxWidth: "250px",
          }}
        >
          {children}
        </div>
      </div>
    </DropdownContext.Provider>
  );
};

interface DropdownItemProps {
  item: { label: string; value: string; icon?: React.ReactNode };
  onClick?: () => void;
  className?: string;
}

export const DropdownItem = ({
  item,
  onClick,
  className,
}: DropdownItemProps) => {
  const context = useContext(DropdownContext);
  return (
    <div
      onClick={() => {
        context?.onSelect(item);
        onClick?.();
      }}
      className={cn(
        "hover:bg-accent hover:text-accent-foreground flex max-w-[220px] cursor-pointer items-center gap-2 truncate rounded-md px-4 py-2 text-sm transition-colors",
        className,
      )}
      title={item.label}
    >
      {item.icon && <span className="mr-2">{item.icon}</span>}
      {item.label.length > 20 ? `${item.label.slice(0, 20)}...` : item.label}
    </div>
  );
};

interface DropdownSubmenuProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export const DropdownSubmenu = ({
  label,
  children,
  className,
}: DropdownSubmenuProps) => {
  const [open, setOpen] = useState(false);
  const submenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(submenuRef, () => setOpen(false));

  return (
    <div
      ref={submenuRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        className="hover:bg-accent hover:text-accent-foreground flex max-w-[220px] cursor-pointer items-center justify-between truncate rounded-md px-4 py-2 text-sm transition-colors"
        title={label}
      >
        {label}
        <ArrowSvg
          className={cn("size-4 transition-transform", open && "rotate-90")}
        />
      </div>
      <div
        className={cn(
          "bg-popover text-popover-foreground absolute left-full top-0 ml-1 w-48 scale-95 rounded-md border p-1 opacity-0 shadow-lg transition-all duration-150 ease-in-out",
          open && "scale-100 opacity-100",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};

function ArrowSvg({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
    </svg>
  );
}
