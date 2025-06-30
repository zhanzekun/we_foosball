import Image from "next/image"

export const WinnerIcon = (isShow: boolean = true) => (
  <Image
    src="/trophy_1184688.png"
    alt="胜利"
    width={20}
    height={20}
    style={{ visibility: isShow ? 'visible' : 'hidden' }}
  />
)