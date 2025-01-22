import { Poppins } from "next/font/google";
import styles from "./page.module.css";
import SoundRecorder from "./components/SoundRecorder"; // Verifique se o componente está sendo exportado corretamente

const poppins = Poppins({
  weight: "700",
  subsets: ["latin"],
});

export default function HomePage() {
  return (
    <div className={`${styles.container} ${poppins.className}`}>
      <SoundRecorder />
    </div>
  );
}
