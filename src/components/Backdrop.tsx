interface BackdropProps {
  open: boolean;
  onClose: () => void;
  clickToClose?: boolean;
}

const Backdrop = ({ open, onClose, clickToClose = true }: BackdropProps) => {
  if (!open) return null;
  const handleClick = () => {
    if (clickToClose) {
      onClose();
    }
  };

  return (
    <div
      className={`z-50 fixed inset-0 bg-gray-500 bg-opacity-50 transition-all duration-300 ${
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleClick}
    ></div>
  );
};

export default Backdrop;
