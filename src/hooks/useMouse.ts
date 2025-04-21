import { useEffect, useState } from "react"

export const useMouse = (containerRef: React.RefObject<HTMLDivElement | null>) => {
  const [mouseXPosition, setMouseXPosition] = useState<number | null>(null);
  const [mouseYPosition, setMouseYPosition] = useState<number | null>(null);
  useEffect(() => {
    const handleMovement = (e: MouseEvent) => {
      // Paķer konteinera referenci un sāk x/y kordinātes no augšējā kreizā stūra. (savādāk sidebar un topbar ir jau aizņēmuši vietu)
      if (containerRef?.current && containerRef?.current != null) {
        const rect = containerRef.current.getBoundingClientRect();
        setMouseXPosition(e.clientX - rect.left);
        setMouseYPosition(e.clientY - rect.top);
      }
    }
    document.addEventListener("mousemove", handleMovement)
    return () => {document.removeEventListener("mousemove", handleMovement)}
  }, [containerRef])
  
  return [mouseXPosition, mouseYPosition];
}