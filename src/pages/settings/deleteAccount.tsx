import { Button } from "@/components/ui/button";
import { useState } from "react";

export function DeleteAccountBtn() {
  const [disabled, setDisabled] = useState(false);
  const [confirmed, setComfirmed] = useState(false);

  async function handleClick() {
    if (!confirmed) {
      setComfirmed(true);
      return;
    }

    setDisabled(true);
    await fetch("/api/delete-account", {
      method: "POST",
    }).then(() => {
      window.location = "/";
    });
  }

  return (
    <Button onClick={handleClick} variant="destructive" disabled={disabled}>
      {!confirmed ? "Delete account" : "Are you sure?"}
    </Button>
  );
}
