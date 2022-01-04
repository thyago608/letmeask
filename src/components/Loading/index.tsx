import Lottie from "react-lottie";
import loading from "assets/animation/loading.json";

export function Loading() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loading,
  };
  return <Lottie options={defaultOptions} width={200} height={200} />;
}
