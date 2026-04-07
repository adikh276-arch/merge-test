import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ScreenWrapperProps {
  children: ReactNode;
  screenKey: string;
}

const ScreenWrapper = ({ children, screenKey }: ScreenWrapperProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenKey}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        className="min-h-screen flex flex-col px-5 py-10 max-w-lg mx-auto"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default ScreenWrapper;
