import { motion, AnimatePresence } from "framer-motion";

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HireModal({ isOpen, onClose }: HireModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-lg border border-gray-800"
          >
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSckQNPKzaQDw2b5WP6N9D4gC0JKPMDHZh3Pzd_jsM3U9N21Dw/viewform?embedded=true"
              width="100%"
              height="600"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
            >
              Loading…
            </iframe>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 