import styles from "./page.module.css";
import ChatContainer from "./components/ChatContainer";
import Title from "./components/Title";
import SidebarToggle from "./components/SidebarToggle";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <SidebarToggle />
      <div className={styles.sidebar}>
        {/* Conteúdo da Sidebar */}
      </div>
      <div className={styles.homeContainer}>
        <Title />
        <ChatContainer />
      </div>
    </div>
  );
}
