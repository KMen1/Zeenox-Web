import { toast } from "sonner";

type Result = {
  message: string;
  success: boolean;
};

export function withNotification(result: Result): Result {
  if (!result.success) {
    toast("An error occurred", {
      description: result.message || "Please try again later",
    });
  }

  return result;
}
