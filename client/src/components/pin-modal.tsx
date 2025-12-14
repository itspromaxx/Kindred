import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pin: string) => void;
  title?: string;
  description?: string;
}

const CORRECT_PIN = "Cheerla";

export function PinModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  description = "This action cannot be undone. Please enter the PIN to confirm."
}: PinModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (pin.toLowerCase() === CORRECT_PIN.toLowerCase()) {
      setPin("");
      setError(false);
      onConfirm(pin);
    } else {
      setError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleClose = () => {
    setPin("");
    setError(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                x: isShaking ? [0, -10, 10, -10, 10, 0] : 0
              }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                x: { duration: 0.4 }
              }}
              className="glass rounded-2xl p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-semibold">{title}</h2>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-lg shrink-0"
                  onClick={handleClose}
                  data-testid="button-close-pin-modal"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pin">Enter PIN</Label>
                  <Input
                    id="pin"
                    type="password"
                    placeholder="Enter admin PIN"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setError(false);
                    }}
                    className={error ? "border-destructive" : ""}
                    autoFocus
                    data-testid="input-pin"
                  />
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-sm text-destructive"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Incorrect PIN. Please try again.
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-xl border-[#E5E5E0] hover:bg-gray-100"
                    onClick={handleClose}
                    data-testid="button-cancel-delete"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm"
                    data-testid="button-confirm-delete"
                  >
                    Delete
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
