import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const showToast = (type, message) => {
  const baseConfig = {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light", // you can switch to "colored" if needed
    style: {
      borderRadius: "8px",
      fontFamily: "Nunito, sans-serif",
      fontSize: "14px",
      backgroundColor: "#f3f4f6", // soft gray background
      color: "#111827", // dark gray text
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    },
    progressStyle: {
      background: type === "success"
        ? "#16a34a" // green
        : type === "error"
        ? "#dc2626" // red
        : "#9ca3af", // neutral gray
    },
  };

  switch (type) {
    case "success":
      toast.success(message, baseConfig);
      break;
    case "error":
      toast.error(message, baseConfig);
      break;
    case "info":
      toast.info(message, baseConfig);
      break;
    case "warn":
      toast.warn(message, baseConfig);
      break;
    default:
      toast(message, baseConfig);
      break;
  }
};
