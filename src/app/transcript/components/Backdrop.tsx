interface BackdropProps {
  open: boolean;
  onClose: () => void;
}
export default function Backdrop({ open, onClose }: BackdropProps) {
  if (!open) return null;
  return (
    <div
      className={`fixed inset-0 bg-gray-500 bg-opacity-50 transition-all duration-300 opacity-100`}
      onClick={onClose}
    ></div>
  );
}
