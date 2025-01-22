import styles from "./page.module.css";
import ChatContainer from "./components/ChatContainer";
import Title from "./components/Title";

export default function HomePage() {
  const handleFirstMessageSent = () => {
    // Função de callback para quando a primeira mensagem for enviada
  };

  return (
    <div className={styles.homeContainer}>
      <Title />
      <ChatContainer />
    </div>
  );
}
