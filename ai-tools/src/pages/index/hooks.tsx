import { useState, useEffect } from "react";

export function useFriendStatus() {
  const [isOnline, setIsOnline] = useState(0);

  // Simulating an online status change after a delay
  useEffect(() => {
    setIsOnline(1);
  }, []); // Empty dependency array ensures this only runs once after the first render

  return isOnline;
}
