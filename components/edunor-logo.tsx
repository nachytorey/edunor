import Image from "next/image"

export function EdunorLogo() {
  return (
    <Image
      src="/images/edunor-logo.png"
      alt="Edunor Nautica"
      width={100}
      height={30}
      className="h-40 w-50"
      priority
    />
  )
}
