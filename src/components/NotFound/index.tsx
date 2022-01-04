import Lottie from "react-lottie";
import notFound from "assets/animation/not-found.json";

export function NotFound() {
  const defaultOptions = {
    autoplay: true,
    loop: true,
    animationData: notFound,
  };
  return <Lottie options={defaultOptions} width={300} height={300} />;
}
