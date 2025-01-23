import styles from "./page.module.css";
import ChatContainer from "./components/ChatContainer";
import Title from "./components/Title";
import SidebarToggle from "./components/SidebarToggle";
import { ObjectId } from "mongodb";

export default function HomePage() {
  const chatId = new ObjectId().toString(); // Gere um novo ObjectId válido

  return (
    <div className={styles.container}>
      <SidebarToggle />
      <div className={styles.sidebar}>
        {/* Conteúdo da Sidebar */}
      </div>
      <div className={styles.homeContainer}>
        <Title />
        <ChatContainer chatId={chatId} />
      </div>
    </div>
  );
}
