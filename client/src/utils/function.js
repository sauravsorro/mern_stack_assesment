import toast from "react-hot-toast";

export const appToaster = (type, message) => {
  if (type === "success") {
    toast.success(typeof message === "string" ? message : "Success");
  } else {
    toast.error(typeof message === "string" ? message : "Something went wrong");
  }
};
