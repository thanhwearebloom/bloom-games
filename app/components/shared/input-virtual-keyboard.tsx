import { useState, type FC } from "react";
import { useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ArrowLeftToLine, Pencil } from "lucide-react";

export const InputVirtualKeyboard: FC<{
  value?: number;
  onChangeValue?: (value: number) => void;
  name?: string;
  id?: string;
  min?: number;
  max?: number;
  onClose?: () => void;
}> = ({ value, onChangeValue, name, id, min, max, onClose }) => {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState<string>("");

  // Initialize temp when opening the drawer
  useEffect(() => {
    if (open) {
      setTemp(value !== undefined && value !== null ? String(value) : "");
    }
  }, [open, value]);

  const append = (d: string) => {
    setTemp((prev) => {
      if (prev === "0") return d; // replace leading zero
      if (prev === "-0") return "-" + d; // handle -0
      return prev + d;
    });
  };

  const toggleSign = () => {
    setTemp((prev) => {
      if (!prev || prev === "0") return prev; // no-op on empty or zero
      return prev.startsWith("-") ? prev.slice(1) : "-" + prev;
    });
  };

  const backspace = () => {
    setTemp((prev) => {
      const next = prev.slice(0, -1);
      return next === "-" ? "" : next;
    });
  };

  const parsed = temp === "" || temp === "-" ? null : parseInt(temp, 10);
  const isValid =
    parsed !== null &&
    (min === undefined || parsed >= min) &&
    (max === undefined || parsed <= max);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      onClose?.();
    }
  };

  const handleSubmit = () => {
    if (isValid && parsed !== null) {
      onChangeValue?.(parsed);
      handleOpenChange(false);
    }
  };

  return (
    <>
      <input type="hidden" name={name} id={id} value={value ?? ""} />
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full" type="button">
            {value ?? "--"}
            <Pencil />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Enter your value</DrawerTitle>
            <DrawerDescription className="text-sm text-muted-foreground">
              {min !== undefined || max !== undefined ? (
                <span>
                  Range: {min !== undefined ? min : "-∞"} to{" "}
                  {max !== undefined ? max : "∞"}
                </span>
              ) : (
                <span>Tap the keypad to enter a number.</span>
              )}
            </DrawerDescription>
          </DrawerHeader>
          <div className="mx-auto mb-2 text-center text-4xl font-semibold tabular-nums">
            {temp === "" ? "—" : temp}
          </div>
          <div className="max-w-3xl w-full grid gap-3 grid-cols-3 mx-auto p-3 [&_button]:text-3xl [&_button]:p-8">
            <Button
              type="button"
              variant="secondary"
              onClick={() => append("7")}
            >
              7
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => append("8")}
            >
              8
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => append("9")}
            >
              9
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => append("4")}
            >
              4
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => append("5")}
            >
              5
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => append("6")}
            >
              6
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => append("1")}
            >
              1
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => append("2")}
            >
              2
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => append("3")}
            >
              3
            </Button>
            <Button
              type="button"
              variant="secondary"
              title="Toggle Positive / Negative"
              onClick={toggleSign}
            >
              +/-
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => append("0")}
            >
              0
            </Button>
            <Button
              type="button"
              variant="secondary"
              title="Backspace"
              onClick={backspace}
            >
              <ArrowLeftToLine />
            </Button>
          </div>
          <DrawerFooter className="flex justify-between flex-row gap-3">
            <DrawerClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full max-w-1/2"
              >
                Cancel
              </Button>
            </DrawerClose>
            <Button
              type="button"
              className="w-full max-w-1/2"
              onClick={handleSubmit}
              disabled={!isValid}
            >
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
